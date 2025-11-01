import bcrypt from "bcryptjs";

async function hash(password) {
  const rounds = getNumberOfRounds();
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
