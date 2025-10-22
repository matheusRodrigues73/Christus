import { InternalServerError, NotAllowedMethodError } from "infra/errors";

function onNoMatchHandler(request, response) {
  const publicErrorObject = new NotAllowedMethodError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  console.log(error);
  const publicErrorObject = new InternalServerError(error.statusCode, {
    cause: error,
  });
  console.error(publicErrorObject);
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
