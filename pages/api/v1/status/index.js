import { createRouter } from "next-connect";
import controller from "infra/controller";
import getInfrastructureStatus from "infra/infrastructureStatus";
import authorization from "models/authorization";

export default createRouter()
  .use(controller.injectAnonymousOrUser)
  .get(getHandler)
  .handler(controller.errorHandlers);

async function getHandler(request, response) {
  const userTryingToGet = request.context.user;
  const currentStatus = await getInfrastructureStatus();

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:status",
    currentStatus,
  );

  return response.status(200).json(secureOutputValues);
}
