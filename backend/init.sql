-- FitPulse database bootstrap script.
-- Run with psql against the default postgres database:
--   psql -d postgres -f backend/init.sql

SELECT format('CREATE DATABASE %I', 'fitpulse')
WHERE NOT EXISTS (
    SELECT 1 FROM pg_database WHERE datname = 'fitpulse'
)\gexec

\connect fitpulse

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    gender VARCHAR(50),
    fitness_level VARCHAR(50),
    goal VARCHAR(50),
    height INTEGER,
    weight INTEGER,
    target_weight INTEGER,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_onboarded BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS daily_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    steps INTEGER NOT NULL DEFAULT 0,
    workout_done BOOLEAN NOT NULL DEFAULT FALSE,
    workout_type VARCHAR(100),
    workout_duration INTEGER,
    energy_level VARCHAR(50) NOT NULL,
    meal VARCHAR(255),
    weight NUMERIC(5,2),
    CONSTRAINT uq_daily_logs_user_date UNIQUE (user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_logs_user_id ON daily_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON daily_logs (user_id, date DESC);

CREATE TABLE IF NOT EXISTS recommendations (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    workout_type VARCHAR(255) NOT NULL,
    intensity VARCHAR(50) NOT NULL,
    duration_minutes INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations (user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_date ON recommendations (user_id, date DESC);

