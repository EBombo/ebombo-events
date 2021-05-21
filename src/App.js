import React, {useEffect, useGlobal, useRef, useState} from "reactn";
import {withAuthentication} from "./session/withAuthentication";
import {BrowserRouter} from "react-router-dom";
import {Routes} from "./routes";
import {firestore} from "./firebase";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import defaultTo from "lodash/defaultTo";
import orderBy from "lodash/orderBy";
import moment from "moment";
import {logoSpin} from "./utils/loader";
import {snapshotToArray} from "./utils";
import {ScrollTop} from "./ScrollTop";
import {notification as notificationAnt} from "antd";
import {
    useCharacteristics,
    useConsoles,
    useEbomboRules,
    useGames,
    useHowItWorks,
    useLanding,
    useMatchInstructions,
    useRules,
    useSocialNetworks,
    useUserAccounts,
} from "./hoc/useLocalStorageState";
import {ErrorBoundary} from "react-error-boundary";
import {ErrorFallback} from "./components/error-fallback/ErrorFallback";

const App = (props) => {
    const [authUser] = useGlobal("user");
    const [games, setGames] = useGlobal("games");
    const [consoles, setConsoles] = useGlobal("consoles");
    const [, setRules] = useGlobal("rules");
    const [userAccounts, setUserAccounts] = useGlobal("userAccounts");

    const [, setMatches] = useGlobal("matches");
    const [, setChallenges] = useGlobal("challenges");
    const [, setTournamentTeams] = useGlobal("tournamentTeams");
    const [, setLeagues] = useGlobal("leagues");

    const [, setLanding] = useGlobal("landing");
    const [, setMatchInstructions] = useGlobal("matchInstructions");
    const [, setSocialNetworks] = useGlobal("socialNetworks");
    const [, setCharacteristics] = useGlobal("characteristics");
    const [, setBanners] = useGlobal("banners");

    const [requiredUserAccount, setRequiredUserAccount] = useState(
        userAccounts[0]
    );

    const [, setConsolesLocalStorage] = useConsoles();
    const [, setRulesLocalStorage] = useRules();
    const [, setUserAccountsLocalStorage] = useUserAccounts();
    const [, setLandingLocalStorage] = useLanding();
    const [, setMatchInstructionsLocalStorage] = useMatchInstructions();
    const [, setCharacteristicsLocalStorage] = useCharacteristics();
    const [, setSocialNetWorksLocalStorage] = useSocialNetworks();

    let unSubScribeMatches = useRef(null);
    let unSubScribeChallenge = useRef(null);
    let unSubScribeOnTournamentsSnapshot = useRef(null);

    useEffect(() => {
        initialize();
    }, []);

    useEffect(() => {
        if (!authUser) return;
        fetchMatches();
        fetchChallenges();
        fetchTournamentTeams();
    }, [authUser]);

    const initialize = () => {
        fetchGames();
        fetchConsoles();
        fetchRules();
        fetchUserAccounts();
        fetchLeagues();
        fetchLanding();
        fetchMatchInstructions();
        fetchCharacteristics();
        fetchSocialNetworks();
    };

    const orderByUpdate = (collection_) =>
        orderBy(
            collection_,
            [(document_) => document_.updateAt.toDate()],
            ["desc"]
        );

    const fetchGames = async () => {
        const gamesQuerySnapShot = await firestore
            .collection("games")
            .where("deleted", "==", false)
            .get();

        const _games = snapshotToArray(gamesQuerySnapShot).filter(
            (game_) => !isEmpty(game_.consoleIds)
        );

        setGames(orderByUpdate(_games));
    };

    const fetchConsoles = async () => {
        const consoleQuerySnapShot = await firestore
            .collection("consoles")
            .where("deleted", "==", false)
            .get();

        const newConsoles = orderByUpdate(snapshotToArray(consoleQuerySnapShot));
        await setConsoles(newConsoles);
        setConsolesLocalStorage(newConsoles);
    };

    const fetchRules = async () => {
        const rulesQuerySnapShot = await firestore
            .collection("rules")
            .where("deleted", "==", false)
            .get();

        const newRules = orderByUpdate(snapshotToArray(rulesQuerySnapShot));
        await setRules(newRules);
        setRulesLocalStorage(newRules);
    };

    const fetchUserAccounts = async () => {
        const userAccountsQuerySnapShot = await firestore
            .collection("userAccounts")
            .where("deleted", "==", false)
            .get();

        const newUserAccounts = orderByUpdate(
            snapshotToArray(userAccountsQuerySnapShot)
        );
        await setUserAccounts(newUserAccounts);
        setUserAccountsLocalStorage(newUserAccounts);
    };

    const fetchMatches = () => {
        if (!authUser) return;

        unSubScribeMatches.current && unSubScribeMatches.current();
        unSubScribeMatches.current = firestore
            .collection("matches")
            .where("isCanceled", "==", false)
            .where("isClosed", "==", false)
            .where("playersIds", "array-contains", get(authUser, "id"))
            .where("finishAt", ">=", new Date())
            .onSnapshot((matchesOnSnapShot) =>
                setMatches(snapshotToArray(matchesOnSnapShot))
            );
    };

    const fetchChallenges = () => {
        if (!authUser) return;

        unSubScribeChallenge.current && unSubScribeChallenge.current();
        unSubScribeChallenge.current = firestore
            .collection("challenges")
            .where("deleted", "==", false)
            .where("isClosed", "==", false)
            .where("playersIds", "array-contains", get(authUser, "id", null))
            .where("createAt", ">", moment().subtract(30, "minutes").toDate())
            .onSnapshot((challengesOnSnapShot) =>
                setChallenges(snapshotToArray(challengesOnSnapShot))
            );
    };

    const fetchTournamentTeams = () => {
        if (!authUser) return;

        unSubScribeOnTournamentsSnapshot.current &&
        unSubScribeOnTournamentsSnapshot.current();
        unSubScribeOnTournamentsSnapshot.current = firestore
            .collection("tournamentTeams")
            .where("playerIds", "array-contains", get(authUser, "id"))
            .where("deleted", "==", false)
            .where("tournament.endDate", ">", new Date())
            .onSnapshot((tournamentTeamsOnSnapShot) =>
                setTournamentTeams(snapshotToArray(tournamentTeamsOnSnapShot))
            );
    };

    const fetchLeagues = async () => {
        const leaguesQuerySnapShot = await firestore
            .collection("tournaments")
            .where("deleted", "==", false)
            .where("eventType", "==", "league")
            .orderBy("createAt", "desc")
            .limit(30)
            .get();
        const _leagues = snapshotToArray(leaguesQuerySnapShot);
        await setLeagues(_leagues);
    };

    const findRequiredUserAccount = (gameId, consoleId) => {
        if (!gameId || !consoleId) return;

        let requiredUserAccount_ = userAccounts.find((userAccount) =>
            userAccount.gameIds.includes(gameId)
        );

        if (!requiredUserAccount_)
            requiredUserAccount_ = userAccounts.find((userAccount) =>
                userAccount.consoleIds.includes(consoleId)
            );

        setRequiredUserAccount(defaultTo(requiredUserAccount_, userAccounts[0]));

        return defaultTo(requiredUserAccount_, userAccounts[0]);
    };

    const fetchLanding = async () => {
        const landingQuerySnapShot = await firestore
            .collection("landing")
            .where("deleted", "==", false)
            .get();

        const newLanding = snapshotToArray(landingQuerySnapShot);
        await setLanding(newLanding);
        setLandingLocalStorage(newLanding);
    };

    const fetchSocialNetworks = async () => {
        const socialNetworksQuerySnapShot = await firestore
            .doc("settings/socialNetworks")
            .get();

        const newSocialNetworks = get(
            socialNetworksQuerySnapShot.data(),
            "items",
            []
        );
        await setSocialNetworks(newSocialNetworks);
        setSocialNetWorksLocalStorage(newSocialNetworks);
    };

    const fetchMatchInstructions = async () => {
        const matchInstructionsgQuerySnapShot = await firestore
            .doc("settings/matchInstructions")
            .get();

        const newMatchInstructions = get(
            matchInstructionsgQuerySnapShot.data(),
            "items",
            []
        );
        await setMatchInstructions(newMatchInstructions);
        setMatchInstructionsLocalStorage(newMatchInstructions);
    };

    const fetchCharacteristics = async () => {
        const characteristicsQuerySnapShot = await firestore
            .doc("settings/characteristics")
            .get();

        const newCharacteristics = get(
            characteristicsQuerySnapShot.data(),
            "items",
            []
        );
        await setCharacteristics(newCharacteristics);
        setCharacteristicsLocalStorage(newCharacteristics);
    };

    const showNotification = (title, description, type = "error") =>
        notificationAnt[type]({title, description});

    const filterConsoles = (game_) =>
        consoles.filter((console_) =>
            get(game_, "consoleIds", []).includes(console_.id)
        );

    if (isEmpty(games)) return <div className="bg-spin-bombo">{logoSpin()}</div>;

    return (
        <BrowserRouter>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <ScrollTop>
                    <Routes
                        {...props}
                        filterConsoles={filterConsoles}
                        requiredUserAccount={requiredUserAccount}
                        showNotification={showNotification}
                        findRequiredUserAccount={findRequiredUserAccount}
                    />
                </ScrollTop>
            </ErrorBoundary>
        </BrowserRouter>
    );
};

export default withAuthentication(App);
