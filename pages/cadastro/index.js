import DefaultLayout from "interface/DefaultLayout";
import { Heading, Stack } from "@primer/react";
import UserForm from "interface/UserForm";

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
        <UserForm
          username
          email
          password
          urlToSubmit={"api/v1/users"}
          redirect="/cadastro/confirmar"
        />
      </Stack>
    </DefaultLayout>
  );
}
