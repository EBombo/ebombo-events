import React, { useEffect, useGlobal, useState } from "reactn";
import { withConfiguration } from "../hoc/withConfiguration";
import { UpdateVersion } from "../components";
import { logoSpin } from "../utils/loader";
import { firestore } from "../firebase";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import App from "../App";
import { useSettings, useLocation } from "../hoc/useLocalStorageState";

const version = "0.23";

const CheckVersion = () => {
  const [settings, setSettings] = useGlobal("settings");
  const [location, setLocation] = useGlobal("location");
  const [, setSettingsLocalStorage] = useSettings();
  const [, setLocationLocalStorage] = useLocation();
  const [loadingVersion, setLoadingVersion] = useState(isEmpty(settings));

  useEffect(() => {
    const unsubscribeVersion = fetchVersion();
    !get(location, "country_code") && fetchCountryCode();
    return () => unsubscribeVersion();
  }, []);

  let pageLoaded = false;

  const fetchVersion = () =>
    firestore
      .collection("settings")
      .doc("default")
      .onSnapshot(async (snapshot) => {
        if (!snapshot.exists) return;

        const newSettings = snapshot.data();

        await setSettings(newSettings);
        setSettingsLocalStorage(newSettings);

        if (version !== newSettings.version && pageLoaded) {
          localStorage.clear();
          document.location.reload(true);
        }

        pageLoaded = true;
        setLoadingVersion(false);
      });

  const fetchCountryCode = async () => {
    try {
      const responseCountry = await fetch("https://ipapi.co/json", {
        method: "GET",
      });
      const userLocation = await responseCountry.json();
      await setLocation(userLocation);
      setLocationLocalStorage(userLocation);
    } catch (error) {
      console.error(error);
    }
  };

  if (loadingVersion) return <div className="bg-spin-bombo">{logoSpin()}</div>;

  return version !== get(settings, "version", version) ? (
    <UpdateVersion />
  ) : (
    <App
      version={version}
      serverVersion={get(settings, "version", version)}
      loadingVersion={loadingVersion}
    />
  );
};

export default withConfiguration(CheckVersion);
