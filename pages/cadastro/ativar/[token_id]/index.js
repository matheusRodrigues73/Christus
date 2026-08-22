import { Heading, Text } from "@primer/react";
import { SkeletonText } from "@primer/react/experimental";
import DefaultLayout from "interface/DefaultLayout";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function ActivationPage() {
  const router = useRouter();
  const tokenId = router.query.token_id;
  const { isLoading, data } = useSWR(
    `api/v1/activations/${tokenId}`,
    async (key) => await fetch(key),
  );
  let activationResponse;
  if (!isLoading) {
    console.log(data.status);
    if (data.status === 200) {
      activationResponse =
        "Conta ativada com sucesso! Agora você pode realizar o login para ter acesso à novas funcionalidades!";
    } else if (data.status === 404) {
      activationResponse =
        "Este link de ativação não esta válido! peça para reenviar o email de ativação com um novo link!";
    } else {
      activationResponse =
        "Sua conta não pôde ser ativada! Entre em contato com o suporte!";
    }
  }

  return (
    <DefaultLayout
      metadata={{
        title: "Ativação de conta",
        description: "Ative o cadastro para entrar em uma sessão",
      }}
    >
      <Heading>Ativação de conta</Heading>
      {isLoading ? <SkeletonText /> : <Text>{activationResponse}</Text>}
    </DefaultLayout>
  );
}
