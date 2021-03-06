import React, { useEffect, useGlobal, useState } from "reactn";
import { DesktopLeftMenu } from "../../components/common/DesktopLeftMenu";
import { Anchor, Input } from "../../components/form";
import { Desktop } from "../../constants";
import { useRouter } from "next/router";
import moment from "moment";
import orderBy from "lodash/orderBy";
import { Image } from "../../components/common/Image";
import { config, firestoreGames } from "../../firebase";
import { snapshotToArray } from "../../utils";
import capitalize from "lodash/capitalize";
import defaultTo from "lodash/defaultTo";
import { spinLoader } from "../../components/common/loader";
import { darkTheme } from "../../theme";
import { Tooltip } from "antd";
import { useTranslation } from "../../hooks";

export const Reports = (props) => {
  const router = useRouter();

  const { t, locale, locales } = useTranslation("pages.reports");

  const { gameId } = router.query;

  const [authUser] = useGlobal("user");
  const [adminGames] = useGlobal("adminGames");

  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(1);
  const [lobbies, setLobbies] = useState([]);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    router.prefetch("/reports/lobbies/[lobbyId]");
  }, []);

  useEffect(() => {
    if (!authUser) router.push("/");
  }, [authUser]);

  useEffect(() => {
    const fetchLobbies = () =>
      firestoreGames
        .collection("lobbies")
        .where("isClosed", "==", true)
        .where("deleted", "==", false)
        .where("game.usersIds", "array-contains", authUser.id)
        .onSnapshot((lobbiesSnapshot) => {
          const _lobbies = snapshotToArray(lobbiesSnapshot);

          setLobbies(orderBy(_lobbies, ["createAt"], ["desc"]));
          setLoading(false);
        });

    const unSub = fetchLobbies();
    return () => unSub();
  }, [gameId]);

  const filterTable = (event) => {
    event.preventDefault();
  };

  const calculateDurationTime = (startAt, endAt) => {
    const startTime = moment(startAt.toDate(), "DD-MM-YYYY hh:mm:ss");
    const endTime = moment(endAt.toDate(), "DD-MM-YYYY hh:mm:ss");

    const hoursDiff = endTime.diff(startTime, "hours");

    const minutesDiff = endTime.diff(startTime, "minutes");

    const secondsDiff = endTime.diff(startTime, "seconds");

    if (hoursDiff <= 0)
      return `${minutesDiff < 10 ? `0${minutesDiff}` : minutesDiff}:${
        secondsDiff % 60 < 10 ? `0${secondsDiff % 60}` : secondsDiff % 60
      } minutes`;

    return `${hoursDiff}:${minutesDiff < 10 ? `0${minutesDiff}` : minutesDiff}:${
      secondsDiff % 60 < 10 ? `0${secondsDiff % 60}` : secondsDiff % 60
    } hours`;
  };

  const deleteLobby = async (lobby) => {
    await firestoreGames.collection("lobbies").doc(lobby.id).set({ deleted: true }, { merge: true });
  };

  return (
    <div className="w-full grid h-[calc(100vh-50px)] lg:grid-cols-[250px_auto]">
      <Desktop>
        <DesktopLeftMenu />
      </Desktop>

      <div className="p-8">
        <div className="flex items-center justify-between">
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
              {t("games")}
            </div>
          </div>
          <table className="w-full rounded-br-[10px] rounded-bl-[10px] overflow-hidden">
            <thead className="w-full">
              <tr className="w-full grid items-center grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_1fr_15px] h-[60px] bg-whiteDark border-y-[1px] border-grayLighten px-4">
                <th className="font-[900] text-[16px] leading-[18px] text-blackDarken">{t("event-name")}</th>
                <th className="font-[900] text-[16px] leading-[18px] text-blackDarken">{t("date")}</th>
                <th className="font-[900] text-[16px] leading-[18px] text-blackDarken">{t("game")}</th>
                <th className="font-[900] text-[16px] leading-[18px] text-blackDarken">{t("duration")}</th>
                <th className="font-[900] text-[16px] leading-[18px] text-blackDarken">{t("players-number")}</th>
                <th className="font-[900] text-[16px] leading-[18px] text-blackDarken"></th>
              </tr>
            </thead>
            <tbody className="">
              {loading
                ? spinLoader()
                : lobbies.map((lobby, index) => (
                    <tr
                      key={`lobby-${index}`}
                      className="w-full grid items-center grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_1fr_15px] h-[60px] bg-whiteLight border-b-[1px] border-whiteDark px-4"
                    >
                      <td
                        className="cursor-pointer text-blackDarken font-[600] text-[16px] leading-[18px] no-wrap"
                        onClick={() => router.push(`/reports/lobbies/${lobby.id}`)}
                      >
                        {lobby.game?.name}
                      </td>
                      <td
                        className="cursor-pointer flex items-center justify-center text-blackDarken font-[600] text-[16px] leading-[18px]"
                        onClick={() => router.push(`/reports/lobbies/${lobby.id}`)}
                      >
                        {capitalize(
                          moment(lobby.startAt?.toDate())
                            .locale(locale === locales[1] ? "es" : "en")
                            .format("MMM Do YYYY, h:mm a")
                        )}
                      </td>
                      <td className="cursor-pointer " onClick={() => router.push(`/reports/lobbies/${lobby.id}`)}>
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
                      <td
                        className="cursor-pointer flex items-center justify-center text-blackDarken font-[600] text-[16px] leading-[18px]"
                        onClick={() => router.push(`/reports/lobbies/${lobby.id}`)}
                      >
                        {calculateDurationTime(lobby.startAt, lobby.updateAt)}
                      </td>
                      <td
                        className="cursor-pointer flex items-center justify-center text-blackDarken font-[600] text-[16px] leading-[18px]"
                        onClick={() => router.push(`/reports/lobbies/${lobby.id}`)}
                      >
                        {lobby.countPlayers || 0}
                      </td>
                      <td className="flex items-center justify-center">
                        <Anchor
                          underlined
                          fontSize="16px"
                          fontWeight="600"
                          color="dark"
                          onClick={() => router.push(`/reports/lobbies/${lobby.id}`)}
                        >
                          Ver
                        </Anchor>
                      </td>
                      <td className="cursor-pointer">
                        <Tooltip
                          placement="bottomRight"
                          trigger="click"
                          title={
                            <div className="flex flex-col gap-[5px] w-[180px]">
                              <div
                                className="w-full bg-[#F1F0F0] p-2 flex items-center text-grayLight rounded-[4px] cursor-pointer gap-[10px]"
                                onClick={() => router.push(`/reports/lobbies/${lobby.id}`)}
                              >
                                <Image
                                  src={`${config.storageUrl}/resources/reports-icon.svg`}
                                  width={"16px"}
                                  height={"16px"}
                                  size={"contain"}
                                  margin="0"
                                  filter="invert(33%) sepia(83%) saturate(4%) hue-rotate(326deg) brightness(93%) contrast(76%)"
                                />
                                {t("open")}
                              </div>
                              <div
                                className="w-full bg-[#F1F0F0] p-2 flex items-center text-grayLight rounded-[4px] cursor-pointer gap-[10px]"
                                onClick={() => deleteLobby(lobby)}
                              >
                                <Image
                                  src={`${config.storageUrl}/resources/delete.svg`}
                                  width={"16px"}
                                  height={"16px"}
                                  size={"contain"}
                                  margin="0"
                                  filter="invert(33%) sepia(83%) saturate(4%) hue-rotate(326deg) brightness(93%) contrast(76%)"
                                />
                                {t("delete")}
                              </div>
                            </div>
                          }
                          color={darkTheme.basic.whiteLight}
                        >
                          <div className="w-[10px] flex flex-col justify-between h-[20px]">
                            <div className="w-[5px] h-[5px] rounded-[50%] bg-blackDarken" />
                            <div className="w-[5px] h-[5px] rounded-[50%] bg-blackDarken" />
                            <div className="w-[5px] h-[5px] rounded-[50%] bg-blackDarken" />
                          </div>
                        </Tooltip>
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
