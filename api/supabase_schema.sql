-- Jalankan script SQL ini di Supabase SQL Editor Anda

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    balance BIGINT DEFAULT 1000,
    free_spins INTEGER DEFAULT 0,
    free_spin_total_win BIGINT DEFAULT 0,
    rtp INTEGER DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Buat akun admin default
INSERT INTO users (username, password_hash, role) 
VALUES ('admin', '$2b$10$wN9Q9xH/0aM8lV5XWzFwOe0u/f2h4L8l6o0j7xQzXfU5yP6K8T3W', 'admin') 
ON CONFLICT DO NOTHING;
