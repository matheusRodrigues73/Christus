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
  const username = request.query.username;
  const userFound = await user.findOneByUsername(username);
  response.status(200).json(userFound);
}

async function patchHandler(request, response) {
  const username = request.query.username;
  const userInputValues = request.body;

  const userTryingToPatch = request.context.user;
  const targetUser = await user.findOneByUsername(username);
  console.log(username);

  if (!authorization.can(userTryingToPatch, "update:user", targetUser)) {
    throw new ForbiddenError({
      message: "Você não possui autorização para editar outros usuários.",
      action:
        "Verifique se você possui as features necessárias para atualizar outro usuário.",
    });
  }

  const userUpdated = await user.update(username, userInputValues);
  response.status(200).json(userUpdated);
}
