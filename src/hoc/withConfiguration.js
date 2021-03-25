import React, {setGlobal, useEffect, useState} from "reactn";
import {setLocale} from "yup";
import {config, yup} from "../firebase";
import moment from "moment";
import "moment/locale/es";
import {logoSpin} from "../utils/loader";
import {initializeFacebookPixel} from "../utils/facebookPixel";
import {initializeGoogleTM, initializeReactGA} from "../utils";
import {GlobalStyle} from "../styles/globalStyle";
import {ThemeProvider} from "styled-components";
import {darkTheme} from "../styles/theme";
import {
    collectionToDate,
    useCharacteristics,
    useConsoles,
    useEbomboRules,
    useEnvironment,
    useGames,
    useHowItWorks,
    useLanding,
    useLocation,
    useMatchInstructions,
    useRules,
    useSettings,
    useSocialNetworks,
    useUser,
    useUserAccounts,
} from "./useLocalStorageState";
import {initializeManifest} from "../utils/manifest";

export const withConfiguration = (Component) => {
  return () => {
    const [isLoadingConfig, setIsLoadingConfig] = useState(true);
    const [authUser] = useUser();
    const [games] = useGames();
    const [consoles] = useConsoles();
    const [rules] = useRules();
    const [userAccounts] = useUserAccounts();
    const [settings] = useSettings();
    const [ebomboRules] = useEbomboRules();
    const [environment, setEnvironment] = useEnvironment();
    const [location] = useLocation();
    const [landing] = useLanding();
    const [matchInstructions] = useMatchInstructions();
    const [characteristic] = useCharacteristics();
    const [howItWorks] = useHowItWorks();
    const [socialNetworks] = useSocialNetworks();

    useEffect(() => {
      const initializeConfig = async () => {
        environment !== config.firebase.projectId && localStorage.clear();
        setEnvironment(config.firebase.projectId);

        await setGlobal({
          user: authUser ? collectionToDate(authUser) : null,
          location,
          register: null,
          realMoney: true,
          isLoadingCreateUser: false,
          isLoadingUser: false,
          currentGame: { id: "all" },
          currentLeague: null,
          currentTournament: null,
          activeGameWeeks: null,
          isVisibleLoginModal: false,
          isVisiblePasswordModal: false,
          selectedFavorites: null,
          openSidebarMobile: false,
          openSidebarMenuLeft: false,
          rankingUsers: [],
          gameRule: null,
          ebomboRules: ebomboRules,
          serverTime: moment(),
          gameEntryCost: 0,
          socialNetworks: socialNetworks,
          matchInstructions: matchInstructions,
          howItWorks: howItWorks,
          characteristic: characteristic,
          settings: collectionToDate(settings),
          games: collectionToDate(games),
          consoles: collectionToDate(consoles),
          rules: collectionToDate(rules),
          userAccounts: collectionToDate(userAccounts),
          landing: collectionToDate(landing),
          leagues: [],
          loadingSearchMatches: false,
          currentCurrency: config.currency,
          isVisibleModalUserAccount: false,
          isVisibleEditProfilePicture: false,
          matches: [],
          challenges: [],
          loadingVerifyExistMatch: true,
          loadingSearchRoom: false,
          advertisements: [],
          tournamentTeams: [],
          showGuide: false,
          stepIndex: 0,
          runGuide: true,
          banners: [],
        });

        setLocale(yup["es"]);
      };

      initializeConfig();
      initializeGoogleTM();
      initializeReactGA();
      initializeFacebookPixel();
      initializeManifest();
      setIsLoadingConfig(false);
    }, []);

    return (
      <ThemeProvider theme={darkTheme}>
        <GlobalStyle />
        {isLoadingConfig ? (
          <div className="bg-spin-bombo">{logoSpin()}</div>
        ) : (
          <Component />
        )}
      </ThemeProvider>
    );
  };
};
