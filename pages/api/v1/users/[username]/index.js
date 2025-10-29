import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";

const route = createRouter();

route.get(getHandler);

export default route.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const username = request.query.username;
  const userFound = await user.findOneByUsername(username);
  response.status(200).json(userFound);
}
