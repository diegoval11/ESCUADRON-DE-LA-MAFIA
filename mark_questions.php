<?php
session_start();
include "config.php";
header('Content-Type: application/json');

if (!isset($_SESSION["user"])) {
    echo json_encode(["ok" => false, "error" => "No autenticado"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$ids = $data["ids"] ?? [];

if (!is_array($ids) || empty($ids)) {
    echo json_encode(["ok" => false, "error" => "Sin IDs"]);
    exit;
}

if (!isset($_SESSION["answered_ids"]) || !is_array($_SESSION["answered_ids"])) {
    $_SESSION["answered_ids"] = [];
}

foreach ($ids as $id) {
    if (is_string($id) && $id !== "" && !in_array($id, $_SESSION["answered_ids"], true)) {
        $_SESSION["answered_ids"][] = $id;
    }
}

$today = date("Y-m-d");
if (!isset($_SESSION["daily_quiz"])) {
    $_SESSION["daily_quiz"] = [];
}
$_SESSION["daily_quiz"][$today] = [
    "completed" => true,
    "completed_at" => date("c"),
];

echo json_encode(["ok" => true]);
