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
    test("With Nonexistent User", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users/user1", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "user2",
        }),
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

      await orchestrator.createUser({
        username: "duplicatedUsername2",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/duplicatedUsername2",
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
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

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser2.username}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
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
      expect(response.status).toBe(200);

      const updatedUser = await orchestrator.getUserByUsername("uniqueUser");
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: updatedUser.id,
        username: "uniqueUser",
        email: updatedUser.email,
        password: updatedUser.password,
        features: [],
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

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser.username}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
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
        features: [],
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

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser.username}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
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
        features: [],
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
