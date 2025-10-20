import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST api/v1/migrations", () => {
  describe("Anonymous User", () => {
    test("Running at first time", async () => {
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
    });
    test("Running at second time", async () => {
      const checkRolledMigrations = await fetch(
        "http://localhost:3000/api/v1/migrations",
        { method: "POST" },
      );
      expect(checkRolledMigrations.status).toBe(200);

      const checkRolledMigrationsBody = await checkRolledMigrations.json();
      expect(Array.isArray(checkRolledMigrationsBody)).toBe(true);
      expect(checkRolledMigrationsBody.length).toBe(0);
    });
  });
});
