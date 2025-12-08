import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";
import activation from "infra/activation.js";

const route = createRouter();

route.post(postHandler);

export default route.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;
  const createdUser = await user.create(userInputValues);

  const activationObject = await activation.create(createdUser.id);
  await activation.sendEmailToUser(createdUser, activationObject.id);

  response.status(201).json(createdUser);
}
