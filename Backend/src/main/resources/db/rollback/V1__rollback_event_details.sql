-- ROLLBACK for V1__event_details_schema.sql
-- NOT executed by Flyway. Run manually only if a rollback is required.
-- WARNING: converting DATE back to TIMESTAMP restores the column type but
-- the original time-of-day values are permanently lost.

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'events'
    ) THEN

        ALTER TABLE events
            ALTER COLUMN event_date TYPE timestamp
            USING event_date::timestamp;

        ALTER TABLE events DROP COLUMN IF EXISTS ticket_price;
        ALTER TABLE events DROP COLUMN IF EXISTS end_time;
        ALTER TABLE events DROP COLUMN IF EXISTS start_time;
        ALTER TABLE events DROP COLUMN IF EXISTS venue_name;
        ALTER TABLE events DROP COLUMN IF EXISTS category;

    END IF;
END $$;
