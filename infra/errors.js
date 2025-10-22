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
