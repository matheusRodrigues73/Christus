import bcrypt from "bcryptjs";
import { ValidationError } from "infra/errors";

async function hash(password) {
  const rounds = getNumberOfRounds();
  if (!password) {
    throw new ValidationError({
      message: "A senha não pode estar indefinida!",
      action: "Digite alguma senha para realizar a operação",
    });
  }
  return await bcrypt.hash(`${password + process.env.PEPER_TO_HASH}`, rounds);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(providedPassword, storedPassword) {
  const providedPasswordWithPeper =
    providedPassword + process.env.PEPER_TO_HASH;
  return await bcrypt.compare(providedPasswordWithPeper, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
