import { Heading, Link, Stack, Text } from "@primer/react";
import DefaultLayout from "interface/DefaultLayout";
import UserForm from "interface/UserForm";

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
        <UserForm email password urlToSubmit="api/v1/sessions" redirect="/" />

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
