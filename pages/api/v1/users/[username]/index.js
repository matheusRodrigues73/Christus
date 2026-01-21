import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";

const route = createRouter();

route.use(controller.injectAnonymousOrUser);
route.get(getHandler);
route.patch(controller.canRequest("update:user"), patchHandler);

export default route.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const username = request.query.username;
  const userFound = await user.findOneByUsername(username);
  response.status(200).json(userFound);
}

async function patchHandler(request, response) {
  const username = request.query.username;
  const userUpdated = await user.update(username, request.body);
  response.status(200).json(userUpdated);
}
