import { createRouter } from "next-connect";
import controller from "infra/controller";
import getInfrastructureStatus from "infra/infrastructureStatus";
import authorization from "models/authorization";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.get(getHandler);

export default router.handler(controller.errorHandlers);

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
