import {
  Button,
  FormControl,
  Heading,
  Link,
  Stack,
  Text,
  TextInput,
} from "@primer/react";
import DefaultLayout from "interface/DefaultLayout";
import { useState } from "react";

export default function LoginPage() {
  return (
    <DefaultLayout
      metadata={{
        title: "Login",
        description: "Faça login no Glorificat para acessar sua conta",
      }}
      contentWidth="small"
      contentFullScreen
    >
      <Stack>
        <Heading as="h1">Login</Heading>
        <LoginForm />

        <Stack align="center">
          <Text>
            Novo no Glorificat?{" "}
            <Link href="/cadastro">Crie sua conta aqui.</Link>
          </Text>
        </Stack>
      </Stack>
    </DefaultLayout>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const newUser = { email, password };

    const response = await fetch("/api/v1/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    if (response.status === 201) {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      location.href = "/";
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="spacious">
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
