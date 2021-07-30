import React from "reactn";
import "antd/dist/antd.css";
import { notification } from "antd";
import { useUser } from "../src/hooks";
import get from "lodash/get";
import { darkTheme, GlobalStyle, lightTheme } from "../src/theme";
import { ThemeProvider } from "styled-components";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../src/components/error-fallback/ErrorFallback";
import { WithAuthentication } from "../src/session/withAuthentication";
import { WithConfiguration } from "../src/session/WithConfiguration";
import { config } from "../src/firebase";
import Head from "next/head";

const MyApp = ({ Component, pageProps }) => {
  const [authUserLS] = useUser();

  const showNotificationAnt = (message, description, type = "error") =>
    notification[type]({ message, description });

  return (
    <ThemeProvider
      theme={get(authUserLS, "theme") === "lightTheme" ? lightTheme : darkTheme}
    >
      <GlobalStyle />
      <Head>
        <title>Aprendimos a romper barreras</title>
        <meta charSet="UTF-8" />
        <meta name="google" value="notranslate" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1.0,user-scalable=0, shrink-to-fit=no"
        />
        <link
          rel="shortcut icon"
          href={`${config.storageUrl}/resources/icons/icon-72x72.png`}
        />
        <link
          rel="shortcut icon"
          href={`${config.storageUrl}/resources/icons/icon-512x512.png`}
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="144x144"
          href={`${config.storageUrl}/resources/icons/icon-512x512.png`}
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="114x114"
          href={`${config.storageUrl}/resources/icons/icon-512x512.png`}
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="72x72"
          href={`${config.storageUrl}/resources/icons/icon-512x512.png`}
        />
        <link
          rel="apple-touch-icon-precomposed"
          href={`${config.storageUrl}/resources/icons/icon-512x512.png`}
        />
        <meta
          property="og:image"
          content={`${config.storageUrl}/resources/icons/icon-512x512.png`}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href={`${config.serverUrl}/api/manifest`} />
      </Head>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <WithConfiguration>
          <WithAuthentication>
            <Component {...pageProps} showNotification={showNotificationAnt} />
          </WithAuthentication>
        </WithConfiguration>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default MyApp;

//Optimizacion

//GA
//fb PIXEL
//roles[acls]
//PWA[SW] notifications
//Image
