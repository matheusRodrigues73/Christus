import DefaultLayout from "interface/DefaultLayout";
import { Button, FormControl, Heading, Stack, TextInput } from "@primer/react";
import { useState } from "react";

export default function RegisterPage() {
  return (
    <DefaultLayout
      contentWidth="small"
      contentFullScreen
      metadata={{
        title: "Cadastro",
        description: "Crie sua conta de forma gratuita",
      }}
    >
      <Stack>
        <Heading as="h1">Cadastro</Heading>
        <RegisterForm></RegisterForm>
      </Stack>
    </DefaultLayout>
  );
}

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const newUser = { username, email, password };

    const response = await fetch("/api/v1/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    if (response.status === 201) {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      location.href = "/cadastro/confirmar";
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="spacious">
        <FormControl>
          <FormControl.Label>Nome de Usuário: </FormControl.Label>
          <TextInput
            type="text"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            block
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>Email: </FormControl.Label>
          <TextInput
            type="text"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            block
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>Senha: </FormControl.Label>
          <TextInput
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            block
          />
        </FormControl>
        <FormControl>
          <Button type="submit" variant="primary">
            Enviar
          </Button>
        </FormControl>
      </Stack>
    </form>
  );
}
