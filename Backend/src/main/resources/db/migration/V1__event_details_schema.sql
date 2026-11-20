-- V1: Event details expansion
-- Converts events.event_date from TIMESTAMP to DATE and adds the new
-- event detail columns. Guarded so it is a no-op on databases where the
-- events table does not exist yet (Hibernate creates it via ddl-auto).

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'events'
    ) THEN

        -- Convert event_date TIMESTAMP -> DATE, dropping the time part.
        ALTER TABLE events
            ALTER COLUMN event_date TYPE date
            USING event_date::date;

        -- New event detail columns (nullable to preserve existing rows).
        ALTER TABLE events
            ADD COLUMN IF NOT EXISTS category varchar(100);

        ALTER TABLE events
            ADD COLUMN IF NOT EXISTS venue_name varchar(200);

        ALTER TABLE events
            ADD COLUMN IF NOT EXISTS start_time time;

        ALTER TABLE events
            ADD COLUMN IF NOT EXISTS end_time time;

        ALTER TABLE events
            ADD COLUMN IF NOT EXISTS ticket_price numeric;

    END IF;
END $$;
