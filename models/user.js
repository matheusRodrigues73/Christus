import database from "infra/database.js";
import password from "models/password.js";
import { ValidationError, NotFoundError } from "infra/errors.js";

async function findOneByUsername(username) {
  const userFound = runSelectQuery(username);
  return userFound;

  async function runSelectQuery(username) {
    const userFound = await database.query({
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        LIMIT
          1
        ;
      `,
      values: [username],
    });
    if (userFound.rowCount === 0) {
      throw new NotFoundError({
        message: "Este usuário não foi encontrado no sistema!",
        action: "Verifique se o username foi digitado corretamente",
      });
    }

    return userFound.rows[0];
  }
}

async function create(userInputValues) {
  await validateUniqueUsername(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);
  return await insertNewUser(userInputValues);

  async function insertNewUser(userInputValues) {
    const queryResponse = await database.query({
      text: `
    INSERT INTO
      users (username, email, password)
    VALUES
      ($1, $2, $3)
    RETURNING
      *
    ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });
    return queryResponse.rows[0];
  }
}

async function update(username, updateObject) {
  const currentUser = await findOneByUsername(username);

  if ("username" in updateObject) {
    await validateUniqueUsername(updateObject.username);
  }

  if ("email" in updateObject) {
    await validateUniqueEmail(updateObject.email);
  }

  if ("password" in updateObject) {
    await hashPasswordInObject(updateObject);
  }

  const userWithNewValue = { ...currentUser, ...updateObject };
  const updeatedUser = await database.query({
    text: `
    UPDATE
      users
    SET
      username = $2,
      email = $3,
      password = $4,
      updated_at = timezone('utc', now())
    WHERE
      id = $1
    RETURNING
      *
    ;
    `,
    values: [
      userWithNewValue.id,
      userWithNewValue.username,
      userWithNewValue.email,
      userWithNewValue.password,
    ],
  });
  return updeatedUser.rows[0];
}

async function validateUniqueUsername(username) {
  const duplicatedUsername = await database.query({
    text: `
        SELECT
          username
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        ;
      `,
    values: [username],
  });
  if (duplicatedUsername.rows.length > 0) {
    throw new ValidationError({
      message: "O Username enviado já está registrado",
      action: "Utilize outro Username para realizar esta operação",
    });
  }
}

async function validateUniqueEmail(email) {
  const duplicatedEmail = await database.query({
    text: `
        SELECT 
          email 
        FROM 
          users 
        WHERE 
          LOWER(email) = LOWER($1)
        ;`,
    values: [email],
  });

  if (duplicatedEmail.rows.length > 0) {
    throw new ValidationError({
      message: "O Email enviado já está registrado",
      action: "Utilize outro Email para realizar esta operação",
    });
  }
}

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

const user = {
  create,
  findOneByUsername,
  update,
};

export default user;
