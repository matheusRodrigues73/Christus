import database from "infra/database";
import { BadRequestError } from "infra/errors";

async function create(userInputValues) {
  await validateUniqueUsername(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  const newUser = await insertNewUser(userInputValues);
  return newUser;

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
      throw new BadRequestError({
        message: "O Username enviado já está registrado",
        action: "Utilize outro Username para realizar o cadastro",
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
      throw new BadRequestError({
        message: "O Email enviado já está registrado",
        action: "Utilize outro Email para completar o cadastro",
      });
    }
  }

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

const user = {
  create,
};

export default user;
