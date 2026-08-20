import Head from "next/head";
import { PageLayout, Header, Text } from "@primer/react";

export default function DefaultLayout({ children, metadata = {} }) {
  return (
    <>
      <Head>
        <title>
          {metadata.title ? `${metadata.title} · Glorificat` : "Glorificat"}
        </title>

        {metadata.description && (
          <meta name="description" value={`${metadata.description}`} />
        )}
      </Head>

      <Header>
        <Header.Item full>
          <Header.Link href="/">Glorificat</Header.Link>
        </Header.Item>
        <Header.Item>
          <Header.Link href="/login">Login</Header.Link>
        </Header.Item>
        <Header.Item>
          <Header.Link href="/cadastro">Cadastro</Header.Link>
        </Header.Item>
      </Header>
      <PageLayout>
        <PageLayout.Content>{children}</PageLayout.Content>
        <PageLayout.Footer divider="line">
          <Text size="small">₢ {new Date().getFullYear()} Glorificat</Text>
        </PageLayout.Footer>
      </PageLayout>
    </>
  );
}
