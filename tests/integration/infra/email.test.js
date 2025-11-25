import email from "infra/email.js";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "Glorificat <contato@glorificat.com.br>",
      to: "theus.marinorodrigues@gmail.com",
      subject: "Teste de assunto",
      text: "Corpo do Teste",
    });
    await email.send({
      from: "Glorificat <contato@glorificat.com.br>",
      to: "theus.marinorodrigues@gmail.com",
      subject: "Teste de Ultimo Email",
      text: "Ultimo Email Enviado",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<contato@glorificat.com.br>");
    expect(lastEmail.recipients[0]).toBe("<theus.marinorodrigues@gmail.com>");
    expect(lastEmail.subject).toBe("Teste de Ultimo Email");
    expect(lastEmail.text).toBe("Ultimo Email Enviado\n");
  });
});
