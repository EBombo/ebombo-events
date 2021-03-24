import React, {useEffect, useGlobal, useState} from "reactn";
import {firestore} from "../firebase";
import {useLocation, useSettings, withConfiguration} from "../hoc";
import App from "../App";
import get from "lodash/get";
import UpdateVersion from "../components/versions/UpdateVersion";

const version = "0.1";

const CheckVersion = () => {
    const [settings, setSettings] = useGlobal("settings");
    const [location, setLocation] = useGlobal("location");
    const [, setSettingsLocalStorage] = useSettings();
    const [, setLocationLocalStorage] = useLocation();
    const [loadingVersion, setLoadingVersion] = useState(true);

    useEffect(() => {
        const unsubscribeVersion = fetchVersion();
        !get(location, "country_code") && fetchCountryCode();
        return () => unsubscribeVersion();
    }, []);

    let pageLoaded = false;

    const fetchVersion = () =>
        firestore
            .doc("settings/default")
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

    return version === get(settings, "version", version)
        ? <App version={version}
               serverVersion={get(settings, "version", "")}
               loadingVersion={loadingVersion}/>
        : <UpdateVersion/>;
};

export default withConfiguration(CheckVersion);
