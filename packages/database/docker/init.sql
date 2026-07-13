-- Runs once on first Postgres boot (docker-entrypoint-initdb.d).
--
-- WHY THIS EXISTS: a Postgres SUPERUSER bypasses Row-Level Security entirely.
-- If the API connected as `postgres`, every RLS policy would be silently ignored
-- and cross-tenant isolation (exit criterion 3) would FALSELY appear to pass.
-- So the app connects as `estatify_app`, a deliberately un-privileged role that
-- CANNOT bypass RLS. Migrations run separately as the owner (`postgres`).

CREATE ROLE estatify_app WITH
  LOGIN
  PASSWORD 'estatify_app'
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE
  NOBYPASSRLS;

GRANT CONNECT ON DATABASE estatify TO estatify_app;
GRANT USAGE ON SCHEMA public TO estatify_app;

-- Tables are created later by `postgres` during `prisma migrate`. Default
-- privileges ensure the app role automatically gets DML on those future tables
-- (it never gets DDL, TRUNCATE, or ownership — so it cannot disable RLS).
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO estatify_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO estatify_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE ON TYPES TO estatify_app;
