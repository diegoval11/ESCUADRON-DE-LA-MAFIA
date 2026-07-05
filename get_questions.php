<?php
session_start();
include "config.php";
require_once __DIR__ . "/includes/rating.php";

header("Content-Type: application/json");

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
$user = fetchAuthenticatedUser($conn, $username);

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
$selected = pickByDifficultyWindow(
    $bank,
    $count,
    $userRating,
    $excludeIds,
    static function (array $q) use ($mode): bool {
        if (!isset($q["q"], $q["options"], $q["correct"])) {
            return false;
        }
        $modes = $q["modes"] ?? ["quiz"];

        return in_array($mode, $modes, true);
    }
);

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
