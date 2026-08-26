import { Heading, Label, Stack, Text } from "@primer/react";
import DefaultLayout from "interface/DefaultLayout";
import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <DefaultLayout
      contentWidth="medium"
      metadata={{
        title: "Status",
        description: "Pagina de status das dependências do Glorificat",
      }}
    >
      <Stack gap="spacious">
        <Stack gap="none">
          <Heading as="h1">Status do sistema</Heading>
          <Stack.Item>
            <UpdatedAt />
          </Stack.Item>
        </Stack>
        <Dependencies />
      </Stack>
    </DefaultLayout>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  let updatedAtResponse = "Carregando...";
  if (!isLoading && data) {
    updatedAtResponse = new Date(data.updated_at).toLocaleString("pt-BR");
  }
  return (
    <LabelLoading
      variant="secondary"
      content={"Última atualização: " + updatedAtResponse}
    />
  );
}

function Dependencies() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  let versionResponse;
  let maxConnectionsResponse;
  let openedConnectionsResponse;
  if (!isLoading && data) {
    versionResponse = data.dependencies.database.version;
    maxConnectionsResponse = data.dependencies.database.max_connections;
    openedConnectionsResponse = data.dependencies.database.opened_connections;
  }
  return (
    <Stack gap="none">
      <Heading as="h2">Banco de dados</Heading>
      {versionResponse && (
        <LabelLoading
          variant="success"
          text="Verção atual:"
          content={versionResponse}
        />
      )}
      <LabelLoading
        variant="success"
        text="Conexões disponíveis:"
        content={maxConnectionsResponse}
      />
      <LabelLoading
        variant="success"
        text="Conexões ativas:"
        content={openedConnectionsResponse}
      />
    </Stack>
  );
}

function LabelLoading({ variant = "", text = "", content = "" }) {
  function labelComponent() {
    return content ? (
      <Label variant={variant}>{content}</Label>
    ) : (
      <Label variant="secondary">Carregando...</Label>
    );
  }
  return (
    <>
      {text ? (
        <Text>
          {text} {labelComponent()}
        </Text>
      ) : (
        labelComponent()
      )}
    </>
  );
}
