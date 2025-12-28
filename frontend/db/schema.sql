DROP TABLE IF EXISTS contact_submissions;
DROP TABLE IF EXISTS daily_limits;

CREATE TABLE IF NOT EXISTS daily_limits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT NOT NULL,
    date TEXT NOT NULL,
    count INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ip_address, date)
);

CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    country TEXT,
    city TEXT,
    turnstile_token TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_daily_limits_ip_date ON daily_limits(ip_address, date);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON contact_submissions(created_at);
