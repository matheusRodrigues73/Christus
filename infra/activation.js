import email from "infra/email.js";
import database from "infra/database.js";
import webServer from "infra/webserver.js";

const EXPIRATION_IN_MILLISECONDS = 60 * 15 * 1000; // 15 min

async function sendEmailToUser(userObject, token) {
  await email.send({
    to: userObject.email,
    subject: "Confirme seu cadastro pelo link de ativação",
    text: `${userObject.username}

${webServer.origin}/cadastro/ativar/${token}

Ative sua conta para poder interagir com a comunidade, criar seus própios posts, fazer parte de comunidades e mais!`,
  });
}

async function create(userId) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const activationObject = await runInsertQuery(userId, expiresAt);
  return activationObject;

  async function runInsertQuery(userId, expiresAt) {
    const result = await database.query({
      text: `
      INSERT INTO
        user_activation_tokens (user_id, expires_at)
      VALUES
        ($1, $2)
      RETURNING
        *
    ;`,
      values: [userId, expiresAt],
    });

    return result.rows[0];
  }
}

async function findOneValidById(token) {
  const activationToken = await runSelectQuery(token);
  return activationToken;

  async function runSelectQuery(token) {
    const result = await database.query({
      text: `
      SELECT
        *
      FROM
        user_activation_tokens
      WHERE
        id = $1
        AND used_at IS NULL
        AND expires_at > NOW()
      LIMIT
        1
      ;`,
      values: [token],
    });
    return result.rows[0];
  }
}

const activation = {
  sendEmailToUser,
  create,
  findOneValidById,
};

export default activation;
