import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";

const route = createRouter();

route.post(postHandler);

export default route.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;
  const createdUser = await user.create(userInputValues);
  response.status(201).json(createdUser);
}
