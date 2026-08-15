import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";
import activation from "infra/activation.js";
import authorization from "models/authorization";

export default createRouter()
  .use(controller.injectAnonymousOrUser)
  .post(controller.canRequest("create:user"), postHandler)
  .handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userTryingToPost = request.context.user;
  const userInputValues = request.body;
  const createdUser = await user.create(userInputValues);

  const activationObject = await activation.create(createdUser.id);
  await activation.sendEmailToUser(createdUser, activationObject.id);

  const secureOutputValues = authorization.filterOutput(
    userTryingToPost,
    "read:user",
    createdUser,
  );

  return response.status(201).json(secureOutputValues);
}
