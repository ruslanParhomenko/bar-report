ALTER TABLE "Tobacco"
ALTER COLUMN "incoming" TYPE TEXT USING "incoming"::TEXT,
ALTER COLUMN "outgoing" TYPE TEXT USING "outgoing"::TEXT;
