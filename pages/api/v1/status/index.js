import database from "infra/database.js";

async function status(request, response) {
  const resp = await database.query("SELECT 1 + 1 as sum;");
  console.log(resp.rows);
  response
    .status(200)
    .json({ "curso.dev": "Os alunos do curso.dev são acima da média" });
}

export default status;
