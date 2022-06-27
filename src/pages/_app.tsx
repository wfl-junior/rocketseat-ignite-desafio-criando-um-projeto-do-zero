import { NextPage } from "next";
import { AppProps } from "next/app";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { Fragment } from "react";
import "../styles/globals.scss";

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
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

      <Component {...pageProps} />
    </Fragment>
  );
};

export default App;
