export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Ocorreu um erro interno no servidor!", { cause });
    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte";
    this.statusCode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ValidationError extends Error {
  constructor({ message, action }) {
    super(message || "Ocorreu um erro de validação!");
    this.name = "ValidationError";
    this.action = action || "Ajuste os dados enviados e tente novamente!";
    this.statusCode = 400;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class NotFoundError extends Error {
  constructor({ message, action }) {
    super(message || "Não foi possível encontrar este recurso no sistema");
    this.name = "NotFoundError";
    this.action =
      action ||
      "Verifique se os parametros enviados na conssulta estão corretos";
    this.statusCode = 404;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class UnauthorizedError extends Error {
  constructor({ message, action, cause }) {
    super(message || "Usuário não autenticado", { cause });
    this.name = "UnauthorizedError";
    this.action = action || "Faça novamente o login para continuar";
    this.statusCode = 401;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ForbiddenError extends Error {
  constructor({ message, action, cause }) {
    super(message || "Acesso negado!", { cause });
    this.name = "ForbiddenError";
    this.action =
      action || "Verifique as features necessárias antes de continuar.";
    this.statusCode = 403;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class NotAllowedMethodError extends Error {
  constructor() {
    super("O método é invalido nesse endpoint");
    this.name = "NotAllowedMethodError";
    this.action = "Verifique os métodos que o endpoint suporta";
    this.statusCode = 405;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServerError extends Error {
  constructor(message) {
    super(message || "Ocorreu um erro no Banco de dados");
    this.name = "ServerError";
    this.action =
      "Verifique se foi conectado corretamente com o Banco ou se a Query está correta";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
