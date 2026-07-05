<?php

function calculateUserRating(string $skillLevel, int $points, int $level): int
{
    $base = match ($skillLevel) {
        "intermedio" => 280,
        "avanzado" => 480,
        default => 80,
    };

    return (int) min(1000, max(1, $base + ($points * 0.3) + ($level * 15)));
}

function selectWithTopicDiversity(array $pool, int $count, string $topicKey = "topic"): array
{
    $selected = [];
    $usedTopics = [];

    foreach ($pool as $item) {
        if (count($selected) >= $count) {
            break;
        }

        $topic = $item[$topicKey] ?? "general";

        if (isset($usedTopics[$topic]) && count($selected) < $count - 1 && count($pool) > $count) {
            continue;
        }

        $selected[] = $item;
        $usedTopics[$topic] = true;
    }

    if (count($selected) < $count) {
        $pickedIds = array_column($selected, "id");

        foreach ($pool as $item) {
            if (count($selected) >= $count) {
                break;
            }
            if (in_array($item["id"], $pickedIds, true)) {
                continue;
            }
            $selected[] = $item;
            $pickedIds[] = $item["id"];
        }
    }

    return $selected;
}

function pickByDifficultyWindow(
    array $bank,
    int $count,
    int $userRating,
    array $excludeIds,
    callable $acceptItem
): array {
    $expansions = [0, 50, 100, 200, 400];

    foreach ($expansions as $expand) {
        $min = max(1, $userRating - 60 - $expand);
        $max = min(1000, $userRating + 100 + $expand);
        $pool = [];

        foreach ($bank as $item) {
            if (!isset($item["id"], $item["difficulty"])) {
                continue;
            }
            if ($item["difficulty"] < $min || $item["difficulty"] > $max) {
                continue;
            }
            if (in_array($item["id"], $excludeIds, true)) {
                continue;
            }
            if (!$acceptItem($item)) {
                continue;
            }
            $pool[] = $item;
        }

        shuffle($pool);
        $selected = selectWithTopicDiversity($pool, $count);

        if (count($selected) >= $count) {
            return array_slice($selected, 0, $count);
        }
    }

    $fallback = [];
    foreach ($bank as $item) {
        if (!isset($item["id"], $item["difficulty"])) {
            continue;
        }
        if (in_array($item["id"], $excludeIds, true)) {
            continue;
        }
        if (!$acceptItem($item)) {
            continue;
        }
        $fallback[] = $item;
    }

    shuffle($fallback);

    return array_slice($fallback, 0, $count);
}

function fetchAuthenticatedUser(mysqli $conn, string $username): ?array
{
    $stmt = $conn->prepare("SELECT skill_level, points, level FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    return $user ?: null;
}
