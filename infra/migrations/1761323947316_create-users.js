exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    // For reference, Github limits users with 39 characters
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },

    // Why 254 characters limit: https://stackoverflow.com/a/1199238
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },

    // Why 72 characters limit: https://www.npmjs.com/package/bcrypt#hash-info
    password: {
      type: "varchar(60)",
      notNull: true,
    },

    // Why use timestamp with timezone: https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
};

exports.down = false;
