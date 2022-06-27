import { NextPage } from "next";
import { AppProps } from "next/app";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { Fragment } from "react";
import { Header } from "../components/Header";
import commonStyles from "../styles/common.module.scss";
import "../styles/globals.scss";

const App: NextPage<AppProps> = ({ Component, pageProps }) => (
  <Fragment>
    <Head>
      <title>spacetraveling</title>
    </Head>

    <NextNProgress
      height={2}
      color="var(--color-highlight)"
      options={{ showSpinner: false }}
      stopDelayMs={50}
    />

    <Header />

    <main className={commonStyles.container}>
      <Component {...pageProps} />
    </main>
  </Fragment>
);

export default App;
