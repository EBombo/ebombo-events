import React, { useEffect, useGlobal, useState } from "reactn";
import { DesktopLeftMenu } from "../../components/common/DesktopLeftMenu";
import { Anchor, Input } from "../../components/form";
import { Desktop } from "../../constants";
import { useRouter } from "next/router";
import moment from "moment";
import { Image } from "../../components/common/Image";
import { config, firestoreBingo, firestoreHanged, firestoreRoulette, firestoreTrivia } from "../../firebase";
import { snapshotToArray } from "../../utils";
import capitalize from "lodash/capitalize";
import defaultTo from "lodash/defaultTo";
import { spinLoader } from "../../components/common/loader";
import orderBy from "lodash/orderBy";
import { ModalWinners } from "./ModalWinners";

export const Reports = (props) => {
  const router = useRouter();

  const { gameId } = router.query;

  const [authUser] = useGlobal("user");
  const [adminGames] = useGlobal("adminGames");

  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(1);
  const [lobbies, setLobbies] = useState([]);
  const [currentLobby, setCurrentLobby] = useState(null);
  const [isVisibleModalWinners, setIsVisibleModalWinners] = useState(false);

  useEffect(() => {
    if (!authUser) router.push("/");
  }, [authUser]);

  useEffect(() => {
    fetchLobbies();
  }, [gameId]);

  const fetchLobbies = async () => {
    const bingoLobbies = await fetchBingoLobbies();
    const hangedLobbies = await fetchHangedLobbies();
    const rouletteLobbies = await fetchRouletteLobbies();
    const triviaLobbies = await fetchTriviaLobbies();

    const allLobbies = bingoLobbies.concat(hangedLobbies).concat(rouletteLobbies).concat(triviaLobbies);

    setLobbies(orderBy(allLobbies, ["startAt"], ["desc"]));
    setLoading(false);
  };

  const fetchBingoLobbies = async () => {
    const _lobbiesQuery = await firestoreBingo.collection("lobbies").where("isClosed", "==", true).get();

    const _lobbies = snapshotToArray(_lobbiesQuery);

    const filterLobbies = _lobbies.filter((lobby) => defaultTo(lobby.game?.usersIds, []).includes(authUser.id));

    return filterLobbies;
  };

  const fetchHangedLobbies = async () => {
    const _lobbiesQuery = await firestoreHanged.collection("lobbies").where("isClosed", "==", true).get();

    const _lobbies = snapshotToArray(_lobbiesQuery);

    const filterLobbies = _lobbies.filter((lobby) => defaultTo(lobby.game?.usersIds, []).includes(authUser.id));

    return filterLobbies;
  };

  const fetchRouletteLobbies = async () => {
    const _lobbiesQuery = await firestoreRoulette.collection("lobbies").where("isClosed", "==", true).get();

    const _lobbies = snapshotToArray(_lobbiesQuery);

    const filterLobbies = _lobbies.filter((lobby) => defaultTo(lobby.game?.usersIds, []).includes(authUser.id));

    return filterLobbies;
  };

  const fetchTriviaLobbies = async () => {
    const _lobbiesQuery = await firestoreTrivia.collection("lobbies").where("isClosed", "==", true).get();

    const _lobbies = snapshotToArray(_lobbiesQuery);

    const filterLobbies = _lobbies.filter((lobby) => defaultTo(lobby.game?.usersIds, []).includes(authUser.id));

    return filterLobbies;
  };

  const filterTable = (event) => {
    event.preventDefault();
  };

  return (
    <div className="w-full grid h-[calc(100vh-50px)] lg:grid-cols-[250px_auto]">
      {isVisibleModalWinners && (
        <ModalWinners
          lobby={currentLobby}
          isVisibleModalWinners={isVisibleModalWinners}
          setIsVisibleModalWinners={setIsVisibleModalWinners}
          {...props}
        />
      )}
      <Desktop>
        <DesktopLeftMenu />
      </Desktop>

      <div className="p-8">
        <div className="flex items-center justify-end">
          <div className="w-full max-w-[250px]">
            <Input type="search" placeholder="Search..." onChange={(e) => filterTable(e)} />
          </div>
        </div>

        <div className="my-8 w-full">
          <div className="flex items-center gap-4 h-[60px] bg-whiteLight rounded-tl-[10px] rounded-tr-[10px] px-4">
            {/*<div*/}
            {/*  className={`px-4 h-full flex items-center font-[700] text-[16px] leading-[18px] cursor-pointer ${*/}
            {/*    tab === 0 ? "text-secondary border-b-[3px] border-secondary" : "text-blackDarken"*/}
            {/*  }`}*/}
            {/*  onClick={() => setTab(0)}*/}
            {/*>*/}
            {/*  Jugadores*/}
            {/*</div>*/}
            <div
              className={`px-4 h-full flex items-center font-[700] text-[16px] leading-[18px] cursor-pointer ${
                tab === 1 ? "text-secondary border-b-[3px] border-secondary" : "text-blackDarken"
              }`}
              onClick={() => setTab(1)}
            >
              Juegos
            </div>
          </div>
          <table className="w-full rounded-br-[10px] rounded-bl-[10px] overflow-hidden">
            <thead className="w-full">
              <tr className="w-full grid items-center grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr] h-[60px] bg-whiteDark border-y-[1px] border-grayLighten px-4">
                <th className="font-[900] text-[16px] leading-[18px] text-blackDarken">Nombre del evento</th>
                <th className="font-[900] text-[16px] leading-[18px] text-blackDarken">Fecha</th>
                <th className="font-[900] text-[16px] leading-[18px] text-blackDarken">Juego</th>
                <th className="font-[900] text-[16px] leading-[18px] text-blackDarken">Duración</th>
                <th className="font-[900] text-[16px] leading-[18px] text-blackDarken">Ganadores</th>
              </tr>
            </thead>
            <tbody className="">
              {loading
                ? spinLoader()
                : lobbies.map((lobby, index) => (
                    <tr
                      key={`lobby-${index}`}
                      className="w-full grid items-center grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr] h-[60px] bg-whiteLight border-b-[1px] border-whiteDark px-4"
                    >
                      <td className="text-blackDarken font-[600] text-[16px] leading-[18px]">{lobby.game?.name}</td>
                      <td className="flex items-center justify-center text-blackDarken font-[600] text-[16px] leading-[18px]">
                        {capitalize(moment(lobby.startAt?.toDate()).locale("es").format("MMM Do YYYY, h:mm a"))}
                      </td>
                      <td>
                        <span className="bg-gray rounded-[6px] flex items-center p-2 w-[100px] mx-auto">
                          <Image
                            src={`${config.storageUrl}/resources/games/${lobby.game?.adminGame?.name}-icon.svg`}
                            height={"20px"}
                            width={"20px"}
                            borderRadius={lobby.game?.adminGame.name === "hanged" ? "0" : "50%"}
                            margin={"0 5px 0 0"}
                            size="contain"
                          />

                          <p className="text-['Lato'] font-[400] text-[14px] leading-[16px] text-grayLight no-wrap m-0">
                            {capitalize(lobby.game?.adminGame?.title)}
                          </p>
                        </span>
                      </td>
                      <td className="flex items-center justify-center text-blackDarken font-[600] text-[16px] leading-[18px]">
                        {moment(moment(lobby.startAt?.toDate())?.diff(moment(lobby.updateAt?.toDate()))).format(
                          "h[h] m[m]"
                        )}
                      </td>
                      <td className="flex items-center justify-center">
                        <Anchor
                          underlined
                          onClick={() => {
                            setCurrentLobby(lobby);
                            setIsVisibleModalWinners(true);
                          }}
                        >
                          Ver
                        </Anchor>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
