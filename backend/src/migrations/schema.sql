-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id TEXT PRIMARY KEY,
  poll_id TEXT NOT NULL,
  nullifier TEXT NOT NULL,
  root TEXT NOT NULL,
  encrypted_vote TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  batched BOOLEAN DEFAULT false,
  batch_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_votes_pollid ON votes (poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_nullifier ON votes (nullifier);

-- Batches table
CREATE TABLE IF NOT EXISTS batches (
  batch_hash TEXT PRIMARY KEY,
  root TEXT NOT NULL,
  metadata TEXT,
  tx_hash TEXT,
  anchored_at TIMESTAMP WITH TIME ZONE
);
