import Head from "next/head";
import { PageLayout, Header, Text } from "@primer/react";
import styles from "./index.module.css";

const contentWidthClasses = {
  small: styles.smallContent,
};
const contentHeightClasses = {
  large: styles.largeVerticalContent,
};
const footerHeightClasses = {
  small: styles.smallVerticalFooter,
};

export default function DefaultLayout({
  children,
  metadata = {},
  contentWidth,
  contentFullScreen,
}) {
  let extraContentClassName = contentWidthClasses[contentWidth];
  let extraFooterClassName;
  if (contentFullScreen) {
    extraContentClassName += ` ${contentHeightClasses.large}`;
    extraFooterClassName = footerHeightClasses.small;
  }

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
        <PageLayout.Content
          width={contentWidth}
          className={extraContentClassName}
        >
          {children}
        </PageLayout.Content>
        <PageLayout.Footer divider="line" className={extraFooterClassName}>
          <Text size="small">₢ {new Date().getFullYear()} Glorificat</Text>
        </PageLayout.Footer>
      </PageLayout>
    </>
  );
}
