import waitForAllServices from "tests/orchestrator.js";
import database from "infra/database.js";

beforeAll(async () => {
  await waitForAllServices();
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
});

describe("DELETE api/v1/migrations", () => {
  describe("Anonymous User", () => {
    test("Request a not allowed method", async () => {
      const methodNotAllowed = await fetch(
        "http://localhost:3000/api/v1/migrations",
        {
          method: "DELETE",
        },
      );
      expect(methodNotAllowed.status).toBe(405);

      const methodNotAllowedBody = await methodNotAllowed.json();
      expect(methodNotAllowedBody.error).toBe("Method Not Allowed");
    });
  });
});
