import { Heading, Text } from "@primer/react";
import { SkeletonText } from "@primer/react/experimental";
import DefaultLayout from "interface/DefaultLayout";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function ActivationPage() {
  const router = useRouter();
  const tokenId = router.query.token_id;

  return (
    <DefaultLayout
      metadata={{
        title: "Ativação de conta",
        description: "Ative o cadastro para entrar em uma sessão",
      }}
    >
      <Heading as="h1">Ativação de conta</Heading>
      <ActivationResponse token_id={tokenId} />
    </DefaultLayout>
  );
}

function ActivationResponse({ token_id = "" }) {
  const { isLoading, data } = useSWR(
    `/api/v1/activations/${token_id}`,
    async (key) => await fetch(key, { method: "PATCH" }),
  );

  let activationResponse;
  if (!isLoading) {
    if (data.status === 200) {
      activationResponse =
        "Conta ativada com sucesso! Agora você pode realizar o login para ter acesso à novas funcionalidades!";
    } else if (data.status === 404) {
      activationResponse = "Ops... Este link de ativação não é válido!";
    } else if (data.status === 405) {
      activationResponse = "Ação invalidada pelo sistema!";
    } else {
      activationResponse =
        "Algo deu errado! tente novamente ou contate o suporte.";
    }
  }

  return isLoading ? <SkeletonText /> : <Text>{activationResponse}</Text>;
}
