import { ErrorFallback } from "../src/components/error-fallback/ErrorFallback";
import { WithAuthentication } from "../src/session/WithAuthentication";
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
import { useFetch } from "../src/hooks/useFetch";

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const [authUserLS] = useUser();
  const { folderId } = router.query;
  const { Fetch } = useFetch();
  const [authUser] = useGlobal("user");
  const [, setLoadingGames] = useGlobal("loadingGames");
  const [games, setGames] = useGlobal("games");
  const [parent, setParent] = useState(null);
  const [folders, setFolders] = useState([]);
  const [isBack, setIsBack] = useState(true);

  const fetchFolders = async () => {
    let folderRef = firestore
      .collection("folders")
      .where("usersIds", "array-contains", authUser?.id ?? null)
      .where("deleted", "==", false);

    folderRef = folderId
      ? folderRef.where("parentId", "==", folderId)
      : folderRef.where("parentId", "==", null);

    folderRef.onSnapshot((foldersQuery) => {
      setFolders(snapshotToArray(foldersQuery));
    });
  };

  const fetchGames = async () => {
    try {
      await setLoadingGames(true);
      setGames([]);

      let url = `${config.serverUrl}/api/games/users/${authUser?.id}`;

      if (folderId) url = url + `?folderId=${folderId}`;

      const { response, error } = await Fetch(url);

      if (error) throw Error(error);

      let games_ = response?.games ?? [];

      if (folderId)
        games_ = games_.filter((game) => game.parentId === folderId);

      setGames(games_);
      await setLoadingGames(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isBack || !authUser) return;

    fetchFolders();
    fetchGames();
  }, [folderId, isBack, authUser]);

  useEffect(() => {
    if (!folderId || isBack) return setParent({});

    const fetchParent = async () => {
      const parentRef = await firestore
        .collection("folders")
        .doc(folderId)
        .get();

      setParent(parentRef.data());
    };

    fetchParent();
  }, [folderId, isBack]);

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
        <meta
          name="keywords"
          content="Esports, Fifa21, videogames, videojuegos, ganar dinero real, juegos que te hacen ganar dinero, fifa 21 precio, fifa 21 pro clubs, Esports Tournament Platform, fifa 21 pro clubes, ganar dinero con videojuegos, juega online y gana dinero"
        />
        <meta
          name="description"
          content="Le damos la posibilidad a empresas de crear eventos virtuales con el objetivo de potenciar el clima laboral."
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

//considerar eliminar por el API url del juego
