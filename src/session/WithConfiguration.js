import { useFetch } from "../hooks/useFetch";
import React, { setGlobal, useEffect, useGlobal, useState } from "reactn";
import {
  collectionToDate,
  useEnvironment,
  useIsBdev,
  useLanguageCode,
  useLocation,
  useSettings,
  useUser,
} from "../hooks";
import { config, firestore, version } from "../firebase";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import { darkTheme, lightTheme } from "../theme";
import moment from "moment";
import { setLocale } from "yup";
import { yup } from "../config";
import { register } from "next-offline/runtime";
import { spinLoader } from "../components/common/loader";
import dynamic from "next/dynamic";
import { initializeReactGA, snapshotToArray } from "../utils";
import { useRouter } from "next/router";
import "moment/locale/es-us";

const UpdateVersion = dynamic(() => import("../components/versions/UpdateVersion"), {
  loading: () => spinLoader(),
});

export const WithConfiguration = (props) => {
  const router = useRouter();

  const { Fetch } = useFetch();

  const [, setIsBdev] = useGlobal("isBdev");
  const [, setLocation] = useGlobal("location");
  const [, setAdminGames] = useGlobal("adminGames");
  const [settings, setSettings] = useGlobal("settings");

  const [authUserLS] = useUser();
  const [languageCode] = useLanguageCode();
  const [isBdevLS, setIsBdevLS] = useIsBdev();
  const [environment, setEnvironment] = useEnvironment();
  const [location, setLocationLocalStorage] = useLocation();
  const [settingsLS, setSettingsLocalStorage] = useSettings();

  const isDevelopment = process.env.NODE_ENV === "development";
  const [isLoadingConfig, setIsLoadingConfig] = useState(isDevelopment);

  let pageLoaded = false;

  useEffect(() => {
    const initializeConfig = async () => {
      environment !== config.firebase.projectId && localStorage.clear();
      setEnvironment(config.firebase.projectId);

      await setGlobal({
        user: authUserLS ? collectionToDate(authUserLS) : null,
        settings: collectionToDate({ ...settingsLS, version }),
        location,
        userGames: [],
        userEvents: [],
        adminGames: [],
        languageCode,
        register: null,
        isBdev: isBdevLS,
        loadingGames: true,
        isLoadingUser: true,
        isLoadingCreateUser: true,
        isVisibleModalConfirm: false,
        openRightDrawer: false,
        openLeftDrawer: false,
        serverTime: new Date(),
        currentCurrency: "s/.",
        theme: get(authUserLS, "theme") === "lightTheme" ? lightTheme : darkTheme,
      });

      moment.locale(languageCode);
      setLocale(yup[languageCode]);
    };

    const fetchCountryCode = async () => {
      try {
        const { response, error } = await Fetch("https://ipapi.co/json", "GET");
        if (error) return;

        await setLocation(response);
        setLocationLocalStorage(response);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchVersion = () =>
      firestore.doc("settings/default").onSnapshot(async (snapshot) => {
        if (!snapshot.exists) return;

        const newSettings = snapshot.data();

        await setSettings(newSettings);
        setSettingsLocalStorage(newSettings);

        if (version !== newSettings.version && pageLoaded) {
          localStorage.clear();
          document.location.reload(true);
        }

        pageLoaded = true;
      });

    const fetchGame = async () => {
      const gamesRef = await firestore
        .collection("games")
        .where("deleted", "==", false)
        .where("isGameToPlay", "==", true)
        .get();

      const adminGames_ = snapshotToArray(gamesRef);
      await setAdminGames(orderBy(adminGames_, ["updateAt"], ["desc"]));
    };

    initializeConfig();
    const unsubscribeVersion = fetchVersion();
    !get(location, "country_code") && fetchCountryCode();
    fetchGame();

    setIsLoadingConfig(false);

    return () => unsubscribeVersion();
  }, []);

  useEffect(() => {
    register("/sw.js", { scope: "/" });
  }, []);

  useEffect(() => {
    if (!router.asPath) return;

    initializeReactGA(router.asPath);
  }, []);

  useEffect(() => {
    // If the isBdev is true.
    if (isBdevLS) return;
    // If the env is defined, is not neccesary update isBdev.
    if (environment) return;
    // If the router is not ready.
    if (!router?.asPath) return;

    const isBdev_ = router.asPath.includes("/bdev");

    setIsBdev(isBdev_);
    setIsBdevLS(isBdev_);
  }, [router]);

  return version === get(settings, "version", version) ? (
    isLoadingConfig ? (
      spinLoader()
    ) : (
      props.children
    )
  ) : (
    <UpdateVersion />
  );
};
