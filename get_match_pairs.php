<?php
session_start();
include "config.php";
require_once __DIR__ . "/includes/rating.php";

header("Content-Type: application/json");

if (!isset($_SESSION["user"])) {
    echo json_encode(["ok" => false, "error" => "No autenticado"]);
    exit;
}

$count = max(4, min(8, (int) ($_GET["count"] ?? 6)));
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

$bankPath = __DIR__ . "/data/match_pairs.json";
if (!is_readable($bankPath)) {
    echo json_encode(["ok" => false, "error" => "Banco de emparejamiento no disponible"]);
    exit;
}

$bank = json_decode(file_get_contents($bankPath), true);
if (!is_array($bank)) {
    echo json_encode(["ok" => false, "error" => "Banco de emparejamiento corrupto"]);
    exit;
}

if (!isset($_SESSION["matched_ids"]) || !is_array($_SESSION["matched_ids"])) {
    $_SESSION["matched_ids"] = [];
}

$excludeIds = $_SESSION["matched_ids"];
$selected = pickByDifficultyWindow(
    $bank,
    $count,
    $userRating,
    $excludeIds,
    fn(array $item): bool => isset($item["term"], $item["def"])
);

foreach ($selected as $pair) {
    if (!in_array($pair["id"], $_SESSION["matched_ids"], true)) {
        $_SESSION["matched_ids"][] = $pair["id"];
    }
}

$public = array_map(static function (array $pair): array {
    return [
        "id" => $pair["id"],
        "term" => $pair["term"],
        "def" => $pair["def"],
    ];
}, $selected);

echo json_encode([
    "ok" => true,
    "pairs" => $public,
    "meta" => [
        "count" => count($public),
    ],
]);
