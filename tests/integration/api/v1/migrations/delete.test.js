import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
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
      expect(methodNotAllowedBody).toEqual({
        name: "NotAllowedMethodError",
        message: "O método é invalido nesse endpoint",
        action: "Verifique os métodos que o endpoint suporta",
        status_code: 405,
      });
    });
  });
});
