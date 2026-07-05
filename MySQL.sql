CREATE DATABASE IF NOT EXISTS login_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE login_system;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  onboarded TINYINT(1) NOT NULL DEFAULT 0,
  skill_level VARCHAR(20) DEFAULT NULL,
  points INT NOT NULL DEFAULT 0,
  level INT NOT NULL DEFAULT 1,
  streak INT NOT NULL DEFAULT 0,
  last_played DATE DEFAULT NULL,
  games_played INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  type ENUM('games', 'streak', 'points', 'level') NOT NULL,
  threshold INT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  achievement_code VARCHAR(50) NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_achievement (user_id, achievement_code),
  CONSTRAINT fk_user_achievements_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO achievements (code, name, description, icon, type, threshold) VALUES
  ('first_game', 'Primer paso', 'Completa tu primera partida', '🎮', 'games', 1),
  ('games_5', 'En racha', 'Juega 5 partidas', '🕹️', 'games', 5),
  ('games_10', 'Adicto al código', 'Juega 10 partidas', '🏆', 'games', 10),
  ('streak_3', 'Constancia', 'Mantén una racha de 3 días', '🔥', 'streak', 3),
  ('streak_7', 'Imparable', 'Racha de 7 días seguidos', '⚡', 'streak', 7),
  ('points_100', 'Centurión', 'Acumula 100 puntos', '💯', 'points', 100),
  ('points_500', 'Maestro quest', 'Acumula 500 puntos', '⭐', 'points', 500),
  ('level_5', 'Nivel pro', 'Alcanza el nivel 5', '🚀', 'level', 5)
ON DUPLICATE KEY UPDATE name = VALUES(name);
