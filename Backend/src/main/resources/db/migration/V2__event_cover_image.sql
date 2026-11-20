-- V2: Event cover image
-- Stores only the image URL/path on the event; binary content lives in
-- filesystem (local dev) or S3/CloudFront (production).

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'events'
    ) THEN
        ALTER TABLE events
            ADD COLUMN IF NOT EXISTS cover_image_url varchar(512);
    END IF;
END $$;
