import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

test('POST to "api/v1/migrations" should return 200', async () => {
  const migratedMigrations = await fetch(
    "http://localhost:3000/api/v1/migrations",
    {
      method: "POST",
    },
  );
  expect(migratedMigrations.status).toBe(201);

  const migratedMigrationsBody = await migratedMigrations.json();
  expect(Array.isArray(migratedMigrationsBody)).toBe(true);
  expect(migratedMigrationsBody.length).toBeGreaterThan(0);

  const checkRolledMigrations = await fetch(
    "http://localhost:3000/api/v1/migrations",
    { method: "POST" },
  );
  expect(checkRolledMigrations.status).toBe(200);

  const checkRolledMigrationsBody = await checkRolledMigrations.json();
  expect(Array.isArray(checkRolledMigrationsBody)).toBe(true);
  expect(checkRolledMigrationsBody.length).toBe(0);
});
