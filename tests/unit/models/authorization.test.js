const { InternalServerError } = require("infra/errors");
const { default: authorization } = require("models/authorization");

describe("models/authorization", () => {
  describe(".can()", () => {
    test("Without `user`", () => {
      expect(() => {
        authorization.can();
      }).toThrow(InternalServerError);
    });

    test("Without `user.features`", () => {
      const createdUser = {
        username: "UserWithoutFeatures",
      };

      expect(() => {
        authorization.can(createdUser);
      }).toThrow(InternalServerError);
    });

    test("Unknow `feature`", () => {
      const createdUser = {
        features: "unknow:feature",
      };
      expect(() => {
        authorization.can(createdUser, "unknow:feature");
      }).toThrow(InternalServerError);
    });

    test("With valid `user` and know `feature`", () => {
      const createdUser = {
        features: ["create:user"],
      };

      expect(authorization.can(createdUser, "create:user")).toBe(true);
    });
  });

  describe(".filterOutput", () => {
    test("Without `user`", () => {
      expect(() => {
        authorization.filterOutput();
      }).toThrow(InternalServerError);
    });

    test("Without `user.features`", () => {
      const createdUser = {
        username: "UserWithoutFeatures",
      };

      expect(() => {
        authorization.filterOutput(createdUser);
      }).toThrow(InternalServerError);
    });

    test("Unknow `feature`", () => {
      const createdUser = {
        features: "unknow:feature",
      };
      expect(() => {
        authorization.filterOutput(createdUser, "unknow:feature");
      }).toThrow(InternalServerError);
    });

    test("Without `resource`", () => {
      const createdUser = {
        features: "create:user",
      };
      expect(() => {
        authorization.filterOutput(createdUser, "read:user");
      }).toThrow(InternalServerError);
    });

    test("With valid `user`, `feature` and `resource`", () => {
      const createdUser = {
        features: ["read:user"],
      };

      const resource = {
        id: 1,
        username: "test",
        email: "resource@resource.com",
        password: ".",
        features: ["read:user"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(
        authorization.filterOutput(createdUser, "read:user", resource),
      ).toEqual({
        id: 1,
        username: "test",
        features: ["read:user"],
        created_at: resource.created_at,
        updated_at: resource.updated_at,
      });
    });
  });
});
