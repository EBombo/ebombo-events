import React, {setGlobal, useEffect, useState} from "reactn";
import {setLocale} from "yup";
import {yup} from "../config";
import {config} from "../firebase";
import {spinLoader} from "../utils/loader";
import {GlobalStyle, themeDark, themeLight} from "../theme";
import {
    collectionToDate,
    useEnvironment,
    useLanguageCode,
    useLocation,
    useSettings,
    useUser
} from "./useLocalStorageState";
import get from "lodash/get";
import {ThemeProvider} from "styled-components";
import moment from "moment";
import "moment/locale/es";
import {initializeManifest} from "../utils/manifest";

export const withConfiguration = Component => () => {
    const [isLoadingConfig, setIsLoadingConfig] = useState(true);
    const [authUser] = useUser();
    const [settings] = useSettings();
    const [environment, setEnvironment] = useEnvironment();
    const [location] = useLocation();
    const [languageCode] = useLanguageCode();

    useEffect(() => {
        const initializeConfig = async () => {
            environment !== config.firebase.projectId && localStorage.clear();
            setEnvironment(config.firebase.projectId);

            await setGlobal({
                user: authUser ? collectionToDate(authUser) : null,
                settings: collectionToDate(settings),
                location,
                languageCode,
                register: null,
                isLoadingCreateUser: false,
                isLoadingUser: false,
                isVisibleLoginModal: false,
                isVisibleForgotPassword: false,
                isLoadingFacebookAuth: false,
                openRightDrawer: false,
                openLeftDrawer: false,
                serverTime: new Date(),
                currentCurrency: "s/.",
                theme: get(authUser, "theme") === "themeLight" ? themeLight : themeDark,
            });

            moment.locale(languageCode);
            setLocale(yup[languageCode]);
        };

        initializeConfig();
        initializeManifest();
        //initializeReactGA();
        setIsLoadingConfig(false);
    }, []);

    return <ThemeProvider theme={get(authUser, "theme") === "themeLight" ? themeLight : themeDark}>
        <GlobalStyle/>
        {
            isLoadingConfig
                ? spinLoader()
                : <Component/>
        }
    </ThemeProvider>
};
