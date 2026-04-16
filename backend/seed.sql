-- Sample FitPulse data for demos and manual database updates.
-- Run after backend/init.sql:
--   psql -d fitpulse -f backend/seed.sql

BEGIN;

TRUNCATE TABLE recommendations, daily_logs, users RESTART IDENTITY CASCADE;

INSERT INTO users (
    id, name, age, gender, fitness_level, goal, height, weight, target_weight,
    email, hashed_password, is_onboarded
) VALUES
(
    'add94b95-e096-460d-a899-f472ad915349',
    'Aryan Dagar',
    29,
    'Female',
    'Intermediate',
    'weightloss',
    168,
    74,
    68,
    'aryan@gmail.com',
    '$2b$12$NXcvkqbxSM0h1Pb22lqb3O.1BeyZDjvN80jRqWpER8JuL9Wa0bFNS',
    TRUE
),
(
    '471334ca-a247-4e88-af9b-9366e58403a3',
    'Shagun Yadav',
    34,
    'Male',
    'Advanced',
    'muscle',
    180,
    86,
    NULL,
    'shagun@gmail.com',
    '$2b$12$NXcvkqbxSM0h1Pb22lqb3O.1BeyZDjvN80jRqWpER8JuL9Wa0bFNS',
    TRUE
),
(
    '0a216aab-df8d-40c2-a1b1-b855777db9c5',
    'Umang Yadav',
    26,
    'Other',
    'Beginner',
    'fitness',
    162,
    62,
    60,
    'umang@gmail.com',
    '$2b$12$NXcvkqbxSM0h1Pb22lqb3O.1BeyZDjvN80jRqWpER8JuL9Wa0bFNS',
    TRUE
);

INSERT INTO daily_logs (
    id, user_id, date, steps, workout_done, workout_type, workout_duration,
    energy_level, meal, weight
) VALUES
-- Aryan Sharma: 7-day run for dashboard + insights
('b99b8c0d-a4a8-45e3-a8a8-7a1f3b1a0001', 'add94b95-e096-460d-a899-f472ad915349', '2026-04-10', 6200, TRUE, 'Cardio', 25, 'Medium', 'Oats + fruit', 74.0),
('b99b8c0d-a4a8-45e3-a8a8-7a1f3b1a0002', 'add94b95-e096-460d-a899-f472ad915349', '2026-04-11', 7100, FALSE, NULL, NULL, 'Low', 'Dal rice', 73.9),
('b99b8c0d-a4a8-45e3-a8a8-7a1f3b1a0003', 'add94b95-e096-460d-a899-f472ad915349', '2026-04-12', 8400, TRUE, 'Yoga', 30, 'Medium', 'Poha', 73.8),
('b99b8c0d-a4a8-45e3-a8a8-7a1f3b1a0004', 'add94b95-e096-460d-a899-f472ad915349', '2026-04-13', 9200, TRUE, 'HIIT', 20, 'High', 'Paneer wrap', 73.7),
('b99b8c0d-a4a8-45e3-a8a8-7a1f3b1a0005', 'add94b95-e096-460d-a899-f472ad915349', '2026-04-14', 10150, TRUE, 'Strength', 35, 'High', 'Chicken salad', 73.5),
('b99b8c0d-a4a8-45e3-a8a8-7a1f3b1a0006', 'add94b95-e096-460d-a899-f472ad915349', '2026-04-15', 8900, FALSE, NULL, NULL, 'Medium', 'Roti sabzi', 73.4),
('b99b8c0d-a4a8-45e3-a8a8-7a1f3b1a0007', 'add94b95-e096-460d-a899-f472ad915349', '2026-04-16', 7600, TRUE, 'Cardio', 28, 'Medium', 'Idli sambar', 73.2),

-- Shagun Verma: strength-focused user
('b99b8c0d-a4a8-45e3-a8a8-7a1f3b1a0010', '471334ca-a247-4e88-af9b-9366e58403a3', '2026-04-13', 5400, TRUE, 'Strength', 60, 'High', 'Egg bhurji + toast', 86.0),
('b99b8c0d-a4a8-45e3-a8a8-7a1f3b1a0011', '471334ca-a247-4e88-af9b-9366e58403a3', '2026-04-14', 6100, TRUE, 'Strength', 55, 'High', 'Rajma chawal', 85.8),
('b99b8c0d-a4a8-45e3-a8a8-7a1f3b1a0012', '471334ca-a247-4e88-af9b-9366e58403a3', '2026-04-15', 4800, FALSE, NULL, NULL, 'Medium', 'Sprouts bowl', 85.8),
('b99b8c0d-a4a8-45e3-a8a8-7a1f3b1a0013', '471334ca-a247-4e88-af9b-9366e58403a3', '2026-04-16', 6900, TRUE, 'HIIT', 30, 'High', 'Protein shake', 85.6),

-- Umang Gupta: beginner/general fitness user
('b99b8c0d-a4a8-45e3-a8a8-7a1f3b1a0020', '0a216aab-df8d-40c2-a1b1-b855777db9c5', '2026-04-14', 4300, FALSE, NULL, NULL, 'Low', 'Khichdi', 62.0),
('b99b8c0d-a4a8-45e3-a8a8-7a1f3b1a0021', '0a216aab-df8d-40c2-a1b1-b855777db9c5', '2026-04-15', 5200, TRUE, 'Yoga', 25, 'Medium', 'Upma', 61.8),
('b99b8c0d-a4a8-45e3-a8a8-7a1f3b1a0022', '0a216aab-df8d-40c2-a1b1-b855777db9c5', '2026-04-16', 6800, TRUE, 'Cardio', 30, 'Medium', 'Dosa', 61.7);

INSERT INTO recommendations (
    id, user_id, date, workout_type, intensity, duration_minutes
) VALUES
(
    'c99b8c0d-a4a8-45e3-a8a8-7a1f3b1a0101',
    'add94b95-e096-460d-a899-f472ad915349',
    '2026-04-16',
    'Rhythmic Cardio: Cycling or Incline Walk',
    'medium',
    30
),
(
    'c99b8c0d-a4a8-45e3-a8a8-7a1f3b1a0102',
    '471334ca-a247-4e88-af9b-9366e58403a3',
    '2026-04-16',
    'Hypertrophy Power Session: Chest & Back',
    'high',
    45
),
(
    'c99b8c0d-a4a8-45e3-a8a8-7a1f3b1a0103',
    '0a216aab-df8d-40c2-a1b1-b855777db9c5',
    '2026-04-16',
    'steady-state cardio / bodyweight flow',
    'medium',
    30
);

COMMIT;

