import activation from "infra/activation";
import webserver from "infra/webserver";
import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/activstions/[token_id]", () => {
  describe("Anonymous User", () => {
    test("With nonexistent token", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/activations/c369d48b-b025-4824-b0c3-200ef9207551`,
        { method: "PATCH" },
      );
      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message:
          "O token de ativação utilizado não foi encontrado ou está invalido.",
        action: "Faça um novo cadastro",
        status_code: 404,
      });
    });
    test("With expired token", async () => {
      jest.useFakeTimers({
        now: new Date(Date.now() - activation.EXPIRATION_IN_MILLISECONDS),
      });
      const createdUser = await orchestrator.createUser();
      const expiredActivationToken = await activation.create(createdUser.id);
      jest.useRealTimers();

      const response = await fetch(
        `${webserver.origin}/api/v1/activations/${expiredActivationToken.id}`,
        { method: "PATCH" },
      );
      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message:
          "O token de ativação utilizado não foi encontrado ou está invalido.",
        action: "Faça um novo cadastro",
        status_code: 404,
      });
    });
    test("With used token", async () => {
      const createdUser = await orchestrator.createUser();
      const activationToken = await activation.create(createdUser.id);
      const usedActivationToken = await activation.markTokenAsUsed(
        activationToken.id,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/activations/${usedActivationToken.id}`,
        { method: "PATCH" },
      );
      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message:
          "O token de ativação utilizado não foi encontrado ou está invalido.",
        action: "Faça um novo cadastro",
        status_code: 404,
      });
    });
  });
  describe("Default User", () => {
    test("With valid Token", async () => {
      const newUser = await orchestrator.createUser({
        username: "aactivationToken",
        email: "activationToken@gmail.com",
        password: "123",
      });
      const activationToken = await activation.create(newUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/activations/${activationToken.id}`,
        {
          method: "PATCH",
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        user_id: newUser.id,
        created_at: responseBody.created_at,
        expires_at: responseBody.expires_at,
        updated_at: responseBody.updated_at,
        used_at: responseBody.used_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.expires_at)).not.toBeNaN();

      const updated_at = new Date(responseBody.updated_at);
      updated_at.setMilliseconds(0);
      updated_at.setSeconds(0);
      const used_at = new Date(responseBody.used_at);
      used_at.setMilliseconds(0);
      used_at.setSeconds(0);
      expect(updated_at).toEqual(used_at);
    });
  });
});
