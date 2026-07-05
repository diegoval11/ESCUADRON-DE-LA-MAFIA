<?php
session_start();
include "config.php";
header('Content-Type: application/json');

if (!isset($_SESSION["user"])) {
    echo json_encode(["ok" => false, "error" => "No autenticado"]);
    exit;
}

$mode = $_GET["mode"] ?? "quiz";
$count = max(1, min(15, (int) ($_GET["count"] ?? 8)));
$isDaily = ($mode === "quiz" && ($_GET["daily"] ?? "") === "1");
$today = date("Y-m-d");

$allowedModes = ["quiz", "timed"];
if (!in_array($mode, $allowedModes, true)) {
    echo json_encode(["ok" => false, "error" => "Modo inválido"]);
    exit;
}

if ($isDaily) {
    $count = 8;
    if (!isset($_SESSION["daily_quiz"])) {
        $_SESSION["daily_quiz"] = [];
    }
    if (!empty($_SESSION["daily_quiz"][$today]["completed"])) {
        echo json_encode(["ok" => false, "error" => "daily_done", "message" => "Ya completaste el reto diario de hoy."]);
        exit;
    }
    if (!empty($_SESSION["daily_quiz"][$today]["questions"])) {
        echo json_encode([
            "ok" => true,
            "questions" => $_SESSION["daily_quiz"][$today]["questions"],
            "meta" => ["count" => count($_SESSION["daily_quiz"][$today]["questions"]), "mode" => "quiz", "daily" => true],
        ]);
        exit;
    }
}

$username = $_SESSION["user"];
$stmt = $conn->prepare("SELECT skill_level, points, level FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if (!$user) {
    echo json_encode(["ok" => false, "error" => "Usuario no encontrado"]);
    exit;
}

$userRating = calculateUserRating(
    $user["skill_level"] ?? "basico",
    (int) ($user["points"] ?? 0),
    (int) ($user["level"] ?? 1)
);

$bankPath = __DIR__ . "/data/questions.json";
if (!is_readable($bankPath)) {
    echo json_encode(["ok" => false, "error" => "Banco de preguntas no disponible"]);
    exit;
}

$bank = json_decode(file_get_contents($bankPath), true);
if (!is_array($bank)) {
    echo json_encode(["ok" => false, "error" => "Banco de preguntas corrupto"]);
    exit;
}

if (!isset($_SESSION["answered_ids"]) || !is_array($_SESSION["answered_ids"])) {
    $_SESSION["answered_ids"] = [];
}

$excludeIds = $_SESSION["answered_ids"];
$selected = pickQuestions($bank, $mode, $count, $userRating, $excludeIds);

$public = array_map("toPublicQuestion", $selected);

if ($isDaily) {
    $_SESSION["daily_quiz"][$today] = [
        "completed" => false,
        "questions" => $public,
        "started_at" => date("c"),
    ];
} else {
    foreach ($selected as $q) {
        if (!in_array($q["id"], $_SESSION["answered_ids"], true)) {
            $_SESSION["answered_ids"][] = $q["id"];
        }
    }
}

echo json_encode([
    "ok" => true,
    "questions" => $public,
    "meta" => [
        "count" => count($public),
        "mode" => $mode,
        "daily" => $isDaily,
    ],
]);

function calculateUserRating(string $skillLevel, int $points, int $level): int
{
    $base = match ($skillLevel) {
        "intermedio" => 280,
        "avanzado" => 480,
        default => 80,
    };

    return (int) min(1000, max(1, $base + ($points * 0.3) + ($level * 15)));
}

function pickQuestions(array $bank, string $mode, int $count, int $userRating, array $excludeIds): array
{
    $expansions = [0, 50, 100, 200, 400];

    foreach ($expansions as $expand) {
        $min = max(1, $userRating - 60 - $expand);
        $max = min(1000, $userRating + 100 + $expand);

        $pool = filterPool($bank, $mode, $min, $max, $excludeIds);
        $selected = selectWithTopicDiversity($pool, $count);

        if (count($selected) >= $count) {
            return array_slice($selected, 0, $count);
        }
    }

    $fallback = filterPool($bank, $mode, 1, 1000, $excludeIds);
    shuffle($fallback);

    return array_slice($fallback, 0, $count);
}

function filterPool(array $bank, string $mode, int $min, int $max, array $excludeIds): array
{
    $pool = [];

    foreach ($bank as $q) {
        if (!isset($q["id"], $q["difficulty"], $q["q"], $q["options"], $q["correct"])) {
            continue;
        }

        $modes = $q["modes"] ?? ["quiz"];
        if (!in_array($mode, $modes, true)) {
            continue;
        }

        if ($q["difficulty"] < $min || $q["difficulty"] > $max) {
            continue;
        }

        if (in_array($q["id"], $excludeIds, true)) {
            continue;
        }

        $pool[] = $q;
    }

    shuffle($pool);

    return $pool;
}

function selectWithTopicDiversity(array $pool, int $count): array
{
    $selected = [];
    $usedTopics = [];

    foreach ($pool as $q) {
        if (count($selected) >= $count) {
            break;
        }

        $topic = $q["topic"] ?? "general";

        if (isset($usedTopics[$topic]) && count($selected) < $count - 1 && count($pool) > $count) {
            continue;
        }

        $selected[] = $q;
        $usedTopics[$topic] = true;
    }

    if (count($selected) < $count) {
        $pickedIds = array_column($selected, "id");

        foreach ($pool as $q) {
            if (count($selected) >= $count) {
                break;
            }
            if (in_array($q["id"], $pickedIds, true)) {
                continue;
            }
            $selected[] = $q;
            $pickedIds[] = $q["id"];
        }
    }

    return $selected;
}

function toPublicQuestion(array $q): array
{
    return [
        "id" => $q["id"],
        "q" => $q["q"],
        "options" => $q["options"],
        "correct" => (int) $q["correct"],
        "explain" => $q["explain"] ?? "",
    ];
}
