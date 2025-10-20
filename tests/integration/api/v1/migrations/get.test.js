import waitForAllServices from "tests/orchestrator.js";
import database from "infra/database.js";

beforeAll(async () => {
  await waitForAllServices();
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
});

describe("GET api/v1/migrations", () => {
  describe("Anonymous User", () => {
    test("Retriving pending migrations", async () => {
      const pendingMigrations = await fetch(
        "http:localhost:3000/api/v1/migrations",
      );
      expect(pendingMigrations.status).toBe(200);

      const pendingMigrationsBody = await pendingMigrations.json();
      expect(Array.isArray(pendingMigrationsBody)).toBe(true);
      expect(pendingMigrationsBody.length).toBeGreaterThan(0);
    });
  });
});
