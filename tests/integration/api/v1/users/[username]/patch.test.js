import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH api/v1/users/[username]", () => {
  describe("Anonymous User", () => {
    test("With Unique Username", async () => {
      const createdUser = await orchestrator.createUser();

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser.username}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            username: "uniqueUser",
          }),
        },
      );
      expect(response.status).toBe(403);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        action: "Verifique se o seu usuário possui a feature!",
        message: "Voce não possui permição para executar esta ação.",
        name: "ForbiddenError",
        status_code: 403,
      });
    });
  });

  describe("Default User", () => {
    test("With Nonexistent User", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch("http://localhost:3000/api/v1/users/user1", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });
      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Este username não foi encontrado no sistema!",
        action: "Verifique se o username foi digitado corretamente",
        status_code: 404,
      });
    });

    test("With Duplicated Username", async () => {
      await orchestrator.createUser({
        username: "duplicatedUsername1",
      });

      const createdUser2 = await orchestrator.createUser({
        username: "duplicatedUsername2",
      });

      const activatedUser2 = await orchestrator.activateUser(createdUser2);
      const sessionObject2 = await orchestrator.createSession(
        activatedUser2.id,
      );

      const response = await fetch(
        "http://localhost:3000/api/v1/users/duplicatedUsername2",
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            Cookie: `session_id=${sessionObject2.token}`,
          },
          body: JSON.stringify({
            username: "duplicatedUsername1",
          }),
        },
      );
      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O Username enviado já está registrado",
        action: "Utilize outro Username para realizar esta operação",
        status_code: 400,
      });
    });

    test("With Duplicated Email", async () => {
      await orchestrator.createUser({
        email: "duplicatedEmail1@gmail.com",
      });

      const createdUser2 = await orchestrator.createUser({
        email: "duplicatedEmail2@gmail.com",
      });

      const activatedUser2 = await orchestrator.activateUser(createdUser2);
      const sessionObject2 = await orchestrator.createSession(
        activatedUser2.id,
      );

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser2.username}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            Cookie: `session_id=${sessionObject2.token}`,
          },
          body: JSON.stringify({
            email: "duplicatedEmail1@gmail.com",
          }),
        },
      );
      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O Email enviado já está registrado",
        action: "Utilize outro Email para realizar esta operação",
        status_code: 400,
      });
    });

    test('With "user2" targeting "user1"', async () => {
      const user1 = await orchestrator.createUser({ username: "user1" });
      const activatedUser1 = await orchestrator.activateUser(user1);
      await orchestrator.createSession(activatedUser1.id);
      const user2 = await orchestrator.createUser({ username: "user2" });
      const activatedUser2 = await orchestrator.activateUser(user2);
      const sessionObject2 = await orchestrator.createSession(
        activatedUser2.id,
      );

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${user1.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject2.token}`,
          },
          body: JSON.stringify({ username: "user3" }),
        },
      );

      expect(response.status).toBe(403);
    });

    test("With Unique Username", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser.username}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            username: "uniqueUser",
          }),
        },
      );
      expect(response.status).toBe(200);

      const updatedUser = await orchestrator.getUserByUsername("uniqueUser");
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: updatedUser.id,
        username: "uniqueUser",
        email: updatedUser.email,
        password: updatedUser.password,
        features: ["create:session", "read:session", "update:user"],
        created_at: updatedUser.created_at.toISOString(),
        updated_at: updatedUser.updated_at.toISOString(),
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With Unique Email", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser.username}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            email: "uniqueEmail@gmail.com",
          }),
        },
      );
      expect(response.status).toBe(200);

      const updatedUser = await orchestrator.getUserByUsername(
        createdUser.username,
      );
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: updatedUser.id,
        username: updatedUser.username,
        email: "uniqueEmail@gmail.com",
        password: updatedUser.password,
        features: ["create:session", "read:session", "update:user"],
        created_at: updatedUser.created_at.toISOString(),
        updated_at: updatedUser.updated_at.toISOString(),
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With New Password", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser.username}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            password: "newPassword",
          }),
        },
      );
      expect(response.status).toBe(200);

      const updatedUser = await orchestrator.getUserByUsername(
        createdUser.username,
      );
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        password: updatedUser.password,
        features: ["create:session", "read:session", "update:user"],
        created_at: updatedUser.created_at.toISOString(),
        updated_at: updatedUser.updated_at.toISOString(),
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const correctPassword = await password.compare(
        "newPassword",
        updatedUser.password,
      );
      expect(correctPassword).toBe(true);

      const incorrectPassword = await password.compare(
        createdUser.password,
        updatedUser.password,
      );
      expect(incorrectPassword).toBe(false);

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });
  });
});
