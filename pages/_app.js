import { ErrorFallback } from "../src/components/error-fallback/ErrorFallback";
import { WithAuthentication } from "../src/session/withAuthentication";
import { WithConfiguration } from "../src/session/WithConfiguration";
import { darkTheme, GlobalStyle, lightTheme } from "../src/theme";
import React, { useEffect, useGlobal, useState } from "reactn";
import { ErrorBoundary } from "react-error-boundary";
import { config, firestore } from "../src/firebase";
import { ThemeProvider } from "styled-components";
import { snapshotToArray } from "../src/utils";
import { useRouter } from "next/router";
import { useUser } from "../src/hooks";
import { notification } from "antd";
import get from "lodash/get";
import Head from "next/head";
import "antd/dist/antd.css";

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const [authUserLS] = useUser();
  const { folderId } = router.query;
  const [authUser] = useGlobal("user");
  const [games, setGames] = useState([]);
  const [parent, setParent] = useState(null);
  const [folders, setFolders] = useState([]);
  const [isBack, setIsBack] = useState(true);

  const fetchFolders = async () => {
    let folderRef = firestore
      .collection("folders")
      .where("usersIds", "array-contains", authUser?.id)
      .where("deleted", "==", false);

    folderRef = folderId
      ? folderRef.where("parent.id", "==", folderId)
      : folderRef.where("parent", "==", null);

    folderRef.onSnapshot((foldersQuery) =>
      setFolders(snapshotToArray(foldersQuery))
    );
  };

  const fetchGames = async () => {
    let gamesRef = firestore
      .collection("gamesToPlay")
      .where("usersIds", "array-contains", authUser?.id)
      .where("deleted", "==", false);

    gamesRef = folderId
      ? gamesRef.where("parent.id", "==", folderId)
      : gamesRef.where("parent", "==", null);

    gamesRef.onSnapshot((gamesQuery) => setGames(snapshotToArray(gamesQuery)));
  };

  useEffect(() => {
    if (router.asPath === "/library" || isBack) return;

    fetchFolders();
    fetchGames();
  }, [folderId]);

  useEffect(() => {
    if (!folderId || isBack) return;

    const fetchParent = async () => {
      const parentRef = await firestore
        .collection("folders")
        .doc(folderId)
        .get();

      setParent(parentRef.data());
    };

    fetchParent();
  }, [folderId]);

  useEffect(() => {
    setIsBack(false);
  }, []);

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
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href={`${config.serverUrl}/api/manifest`} />
      </Head>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <WithConfiguration>
          <WithAuthentication>
            <Component
              {...pageProps}
              games={games}
              parent={parent}
              folders={folders}
              fetchGames={fetchGames}
              fetchFolders={fetchFolders}
              showNotification={showNotificationAnt}
            />
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
