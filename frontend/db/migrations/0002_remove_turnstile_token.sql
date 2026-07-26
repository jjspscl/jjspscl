DROP TABLE IF EXISTS contact_submissions_new;

CREATE TABLE contact_submissions_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    country TEXT,
    city TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO contact_submissions_new (id, name, email, message, ip_address, user_agent, country, city, created_at)
SELECT id, name, email, message, ip_address, user_agent, country, city, created_at
FROM contact_submissions;

DROP TABLE contact_submissions;
ALTER TABLE contact_submissions_new RENAME TO contact_submissions;
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON contact_submissions(created_at);
