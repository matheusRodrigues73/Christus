import email from "infra/email.js";
import database from "infra/database.js";
import webServer from "infra/webserver.js";
import { NotFoundError } from "infra/errors.js";
import user from "models/user.js";

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

    if (result.rowCount === 0) {
      throw new NotFoundError({
        message:
          "O token de ativação utilizado não foi encontrado ou está invalido.",
        action: "Faça um novo cadastro",
      });
    }

    return result.rows[0];
  }
}

async function markTokenAsUsed(tokenId) {
  const usedActivationToken = await runUpdateQuery(tokenId);
  return usedActivationToken;

  async function runUpdateQuery(tokenId) {
    const result = await database.query({
      text: `
      UPDATE
        user_activation_tokens
      SET
        used_at = NOW()
      WHERE
        id = $1
      RETURNING
        * 
    ;`,
      values: [tokenId],
    });
    return result.rows[0];
  }
}

async function activateUserByUserId(userId) {
  const activatedUser = await user.setFeatures(userId, [
    "create:session",
    "read:session",
  ]);
  return activatedUser;
}

const activation = {
  sendEmailToUser,
  create,
  findOneValidById,
  markTokenAsUsed,
  activateUserByUserId,
};

export default activation;
