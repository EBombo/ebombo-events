import { ErrorFallback } from "../src/components/error-fallback/ErrorFallback";
import { WithAuthentication } from "../src/session/WithAuthentication";
import { WithConfiguration } from "../src/session/WithConfiguration";
import { darkTheme, GlobalStyle, lightTheme } from "../src/theme";
import React, { useEffect, useGlobal, useState } from "reactn";
import { ErrorBoundary } from "react-error-boundary";
import { config, firestore } from "../src/firebase";
import { ThemeProvider } from "styled-components";
import { useFetch } from "../src/hooks/useFetch";
import { snapshotToArray } from "../src/utils";
import { useRouter } from "next/router";
import { useUser } from "../src/hooks";
import { notification } from "antd";
import "../src/theme/globals.css";
import Script from "next/script";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import Head from "next/head";
import "antd/dist/antd.css";
import "aos/dist/aos.css";
import AOS from "aos";

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const { folderId } = router.query;

  const { Fetch } = useFetch();

  const [authUserLS] = useUser();

  const [authUser] = useGlobal("user");
  const [games, setGames] = useGlobal("userGames");
  const [events, setEvents] = useGlobal("userEvents");
  const [, setLoadingGames] = useGlobal("loadingGames");

  const [parent, setParent] = useState(null);
  const [folders, setFolders] = useState([]);
  const [isBack, setIsBack] = useState(true);

  const fetchFolders = async () => {
    let folderRef = firestore
      .collection("folders")
      .where("usersIds", "array-contains", authUser?.id ?? null)
      .where("deleted", "==", false);

    folderRef = folderId ? folderRef.where("parentId", "==", folderId) : folderRef.where("parentId", "==", null);

    folderRef.onSnapshot((foldersQuery) => {
      setFolders(snapshotToArray(foldersQuery));
    });
  };

  const fetchEvents = () =>
    firestore
      .collection("events")
      .where("userId", "==", authUser?.id ?? null)
      .where("deleted", "==", false)
      .onSnapshot((eventsQuery) => {
        setEvents(snapshotToArray(eventsQuery));
      });

  const fetchGames = async () => {
    try {
      await setLoadingGames(true);
      await setGames([]);

      let url = `${config.serverUrl}/api/games/users/${authUser?.id}`;

      if (folderId) url = url + `?folderId=${folderId}`;

      const { response, error } = await Fetch(url);

      if (error) throw Error(error);

      let games_ = orderBy(response?.games ?? [], [({ createAt }) => new Date(createAt)], ["desc"]);

      if (folderId) games_ = games_.filter((game) => game.parentId === folderId);

      await setGames(games_);
      await setLoadingGames(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isBack || !authUser) return;

    fetchFolders();
    fetchGames();
    fetchEvents();
  }, [folderId, isBack, authUser]);

  useEffect(() => {
    if (!folderId || isBack) return setParent({});

    const fetchParent = async () => {
      const parentRef = await firestore.collection("folders").doc(folderId).get();

      setParent(parentRef.data());
    };

    fetchParent();
  }, [folderId, isBack]);

  useEffect(() => {
    setIsBack(false);
  }, []);

  useEffect(() => {
    AOS.init({
      once: true,
      mirror: true,
      duration: 500,
    });
  }, []);

  const showNotificationAnt = (message, description, type = "error") => notification[type]({ message, description });

  return (
    <ThemeProvider theme={get(authUserLS, "theme") === "lightTheme" ? lightTheme : darkTheme}>
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
        <meta name="format-detection" content="telephone=no" />
        <link rel="shortcut icon" href={`${config.storageUrl}/resources/icons/icon-72x72.png`} />
        <link rel="shortcut icon" href={`${config.storageUrl}/resources/icons/icon-512x512.png`} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${config.storageUrl}/resources/icons/ios-icon-512x512.png`}
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="144x144"
          href={`${config.storageUrl}/resources/icons/ios-icon-512x512.png`}
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="114x114"
          href={`${config.storageUrl}/resources/icons/ios-icon-512x512.png`}
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="72x72"
          href={`${config.storageUrl}/resources/icons/ios-icon-512x512.png`}
        />
        <link rel="apple-touch-icon-precomposed" href={`${config.storageUrl}/resources/icons/icon-512x512.png`} />
        <meta property="og:image" content={`${config.storageUrl}/resources/icons/icon-512x512.png`} />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
        <link rel="manifest" href={`${config.serverUrl}/api/manifest`} />
      </Head>
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: ``,
        }}
      />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <WithConfiguration>
          <WithAuthentication>
            <Component
              {...pageProps}
              events={events}
              games={games}
              parent={parent}
              folders={folders}
              fetchGames={fetchGames}
              fetchFolders={fetchFolders}
              fetchEvents={fetchEvents}
              showNotification={showNotificationAnt}
            />
          </WithAuthentication>
        </WithConfiguration>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default MyApp;
