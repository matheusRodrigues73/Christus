import { Banner } from "@primer/react";
import DefaultLayout from "interface/DefaultLayout";

export default function ConfirmPage() {
  return (
    <DefaultLayout
      contentWidth="small"
      metadata={{ title: "Confirme seu email" }}
    >
      <Banner
        title="Agora falta pouco..."
        variant="warning"
        description="Para completar seu cadastro, confira o email que te enviamos para ativar sua conta."
      />
    </DefaultLayout>
  );
}
