-- AI海亀のスープ schema.sql
-- 作成日: 2026-06-30

CREATE DATABASE IF NOT EXISTS umigame CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE umigame;

-- ユーザーテーブル
CREATE TABLE users (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 問題テーブル
CREATE TABLE problems (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        INT UNSIGNED,
  story          TEXT         NOT NULL COMMENT 'ユーザーが入力した真相',
  question_text  TEXT         NOT NULL COMMENT 'AIが自動生成した問題文',
  key_points     TEXT         NOT NULL COMMENT '正解判定用の要点（AIが生成、JSON配列文字列）',
  difficulty     ENUM('easy', 'normal', 'hard') NOT NULL DEFAULT 'normal',
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 問題タグテーブル（1つの問題に最大3つのタグを持たせるための中間テーブル）
CREATE TABLE problem_tags (
  problem_id  INT UNSIGNED NOT NULL,
  tag         ENUM('horror','mystery','suspense','fantasy','sf','history','romance','youth','daily','school','work','travel','food','sports','true_story') NOT NULL,
  PRIMARY KEY (problem_id, tag),
  FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
);

-- プレイ履歴テーブル
CREATE TABLE plays (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED,
  problem_id      INT UNSIGNED,
  question_count  INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '質問した回数',
  clear_time_sec  INT UNSIGNED          DEFAULT NULL COMMENT 'クリアにかかった時間（秒）',
  is_cleared      TINYINT(1)   NOT NULL DEFAULT 0 COMMENT 'クリアしたか（0: 未クリア, 1: クリア）',
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE SET NULL
);