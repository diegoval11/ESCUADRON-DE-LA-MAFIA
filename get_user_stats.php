<?php
session_start();
include "config.php";
header("Content-Type: application/json");

if (!isset($_SESSION["user"])) {
    echo json_encode(["ok" => false, "error" => "No autenticado"]);
    exit;
}

$username = $_SESSION["user"];
$stmt = $conn->prepare("SELECT points, level, streak FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();

if (!$row) {
    echo json_encode(["ok" => false, "error" => "Usuario no encontrado"]);
    exit;
}

$points = (int) ($row["points"] ?? 0);
$level = (int) ($row["level"] ?? 1);
$streak = (int) ($row["streak"] ?? 0);

echo json_encode([
    "ok" => true,
    "points" => $points,
    "level" => $level,
    "streak" => $streak,
    "pointsInLevel" => $points % 100,
    "codeUnlocked" => $points >= 300,
]);
