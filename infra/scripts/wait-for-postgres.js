const { exec } = require("node:child_process");

let loadInterval;
let index = 0;
let balls = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

function ballLoading() {
  loadInterval = setInterval(() => {
    let frame = balls[index++ % balls.length];
    process.stdout.write(
      `\r\x1b[33m${frame}\x1b[0m Aguardando conexão com Postgres...`,
    );
  }, 100);
}

function stopLoading() {
  clearInterval(loadInterval);
  process.stdout.write(
    "\r\u001b[K\u001b[F\u001b[K\x1b[32m✔\x1b[0m Postgres está pronto para receber conexões\n",
  );
}

function checkPostgresConnection() {
  exec(
    "docker exec infra-database-1 pg_isready --host localhost",
    (error, stdout) => {
      if (stdout.search("accepting connections") === -1) {
        checkPostgresConnection();
        return;
      }
      stopLoading();
    },
  );
}

process.stdout.write("🛑 Postgres ainda não está recebendo conexões\n");
ballLoading();
checkPostgresConnection();
