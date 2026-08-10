import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";
import authorization from "models/authorization";
import { ForbiddenError } from "infra/errors";

const route = createRouter();

route.use(controller.injectAnonymousOrUser);
route.get(getHandler);
route.patch(controller.canRequest("update:user"), patchHandler);

export default route.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const userTryingToGet = request.context.user;
  const username = request.query.username;
  const userFound = await user.findOneByUsername(username);

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:user",
    userFound,
  );
  response.status(200).json(secureOutputValues);
}

async function patchHandler(request, response) {
  const username = request.query.username;
  const userInputValues = request.body;

  const userTryingToPatch = request.context.user;
  const targetUser = await user.findOneByUsername(username);

  if (!authorization.can(userTryingToPatch, "update:user", targetUser)) {
    throw new ForbiddenError({
      message: "Você não possui autorização para editar outros usuários.",
      action:
        "Verifique se você possui as features necessárias para atualizar outro usuário.",
    });
  }

  const updatedUser = await user.update(username, userInputValues);
  const secureOutputValues = authorization.filterOutput(
    userTryingToPatch,
    "read:user",
    updatedUser,
  );
  response.status(200).json(secureOutputValues);
}
