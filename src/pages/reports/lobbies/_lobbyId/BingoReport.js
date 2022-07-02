import React, { useEffect, useGlobal, useMemo, useState } from "reactn";
import moment from "moment";
import styled from "styled-components";
import capitalize from "lodash/capitalize";
import { useTranslation } from "../../../../hooks";
import { config, firestoreGames, firestoreBingo } from "../../../../firebase";
import { Image } from "../../../../components/common/Image";
import { useRouter } from "next/router";
import { snapshotToArray } from "../../../../utils";
import { mediaQuery } from "../../../../constants";
import { BingoResume } from "./BingoResume";
import { BingoUsers } from "./BingoUsers";
import LobbyFeedbacks from "./LobbyFeedbacks";
import { Anchor } from "../../../../components/form";
import { Icon } from "../../../../components/common/Icons";
import { Tooltip } from "antd";
import { darkTheme } from "../../../../theme";

export const BingoReport = (props) => {
  const router = useRouter();

  const { lobbyId } = router.query;

  const { t } = useTranslation("pages.reports.bingo");

  const [authUser] = useGlobal("user");

  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    router.prefetch("/reports");
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = await firestoreBingo.collection("lobbies").doc(lobbyId).collection("users").get();

      const _users = snapshotToArray(usersRef);

      await setUsers(_users);
    };

    const fetchFeedbacks = () =>
      firestoreBingo
        .collection("feedbacks")
        .where("lobbyId", "==", lobbyId)
        .onSnapshot((feedbacksSnapshot) => {
          const _feedbacks = snapshotToArray(feedbacksSnapshot);
          const mappedFeedbacks = _feedbacks.map((feedback) => ({ ...feedback, user: JSON.parse(feedback.user) }));
          setFeedbacks(mappedFeedbacks);
        });


    const fetchLobbyData = async () => {
      const promiseUsers = fetchUsers();
      const promiseFeedbacks = fetchFeedbacks();

      await Promise.all([promiseUsers, promiseFeedbacks]);
    };

    fetchLobbyData();
  }, [lobbyId]);

  const contentTab = useMemo(() => {
    switch (tab) {
      case 0:
        return (
          <BingoResume
            {...props}
            users={users}
            feedbacks={feedbacks}
          />
        );
      case 1:
        return (
          <BingoUsers
            {...props}
            users={users}
            feedbacks={feedbacks}
          />
        );
      case 2:
        return (
          <LobbyFeedbacks
            {...props}
            users={users}
            feedbacks={feedbacks}
          />
        );

      default:
        return (
          <BingoResume
            {...props}
            users={users}
            feedbacks={feedbacks}
          />
        );
    }
  });

  const deleteLobby = async () => {
    await firestoreGames.collection("lobbies").doc(lobbyId).set({ deleted: true }, { merge: true });
  };

  return (
    <div>
      <div className="grid lg:gap-8 lg:grid-cols-[3fr_1fr]">
        <div className="relative h-[170px]">
          <div className="absolute top-0 left-0 right-0 bottom-0 z-10 px-4 pt-4 lg:pt-6 lg:px-8 flex flex-col justify-between">
            <Anchor className="flex items-center gap-2" variant="primary" onClick={() => router.back()}>
              <Icon type="arrow-left" onClick={() => router.push("/reports")} />
              Volver
            </Anchor>
            <div className="flex items-center justify-between">
              <div className="text-blackDarken text-[18px] leading-[22px] font-[600]">{t("title")}</div>

              <Tooltip
                placement="bottomRight"
                trigger="click"
                title={
                  <div className="flex flex-col gap-[5px] w-[180px]">
                    <div
                      className="w-full bg-[#F1F0F0] p-2 flex items-center text-grayLight rounded-[4px] cursor-pointer gap-[10px]"
                      onClick={() => deleteLobby()}
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
                <div className="h-[18px] flex flex-col justify-between md:mr-[50px] cursor-pointer">
                  <div className="w-[5px] h-[5px] rounded-[50%] bg-blackDarken" />
                  <div className="w-[5px] h-[5px] rounded-[50%] bg-blackDarken" />
                  <div className="w-[5px] h-[5px] rounded-[50%] bg-blackDarken" />
                </div>
              </Tooltip>
            </div>
            <div className="text-[36px] leading-[40px] lg:text-[48px] lg:leading-[58px] text-blackDarken font-[600]">
              {props.lobby?.game?.name}
            </div>

            <div className="flex items-center">
              <div
                className={`cursor-pointer font-[900] p-2 md:py-2 md:px-4 text-[16px] leading-[18px] lg:text-[18px] lg:leading-[22px] ${
                  tab === 0 ? "text-secondary border-b-[2px] border-secondary" : "text-grayLight"
                }`}
                onClick={() => setTab(0)}
              >
                {t("resume")}
              </div>
              <div
                className={`cursor-pointer font-[900] p-2 md:py-2 md:px-4 text-[16px] leading-[18px] lg:text-[18px] lg:leading-[22px] ${
                  tab === 1 ? "text-secondary border-b-[2px] border-secondary" : "text-grayLight"
                }`}
                onClick={() => setTab(1)}
              >
                {`${t("players")} (${users?.length})`}
              </div>
              <div
                className={`cursor-pointer font-[900] p-2 md:py-2 md:px-4 text-[16px] leading-[18px] lg:text-[18px] lg:leading-[22px] ${
                  tab === 2 ? "text-secondary border-b-[2px] border-secondary" : "text-grayLight"
                }`}
                onClick={() => setTab(2)}
              >
                {t("feedback")}
              </div>
            </div>
          </div>
          <SyledDiv />
        </div>

        <div className="flex flex-col p-4 lg:p-8">
          <div className="flex items-center gap-[10px] lg:mx-auto max-w-[254px] w-full border-grayLighten border-b-[1px] p-2">
            <div className="text-[16px] leading-[19px] font-[400] text-blackDarken">{t("live")}</div>
            <Image
              src={`${config.storageUrl}/resources/trivia-icon.svg`}
              width="22px"
              height="22px"
              margin="0"
              size="contain"
            />
          </div>
          <div className="flex items-center gap-[10px] lg:mx-auto max-w-[254px] w-full border-grayLighten border-b-[1px] p-2">
            {capitalize(moment(props.lobby?.startAt.toDate()).format("MMMM Do YYYY, h:mm a"))}
          </div>
          <div className="flex items-center gap-[10px] lg:mx-auto max-w-[254px] w-full border-grayLighten border-b-[1px] p-2">
            <div className="text-[16px] leading-[19px] font-[400] text-blackDarken">
              {`${t("organize-by")} ${authUser?.name}`}
            </div>
          </div>
        </div>
      </div>

      {contentTab}
    </div>
  );
};

const SyledDiv = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 0;
  position: absolute;
  border-top: 170px solid ${(props) => props.theme.basic.whiteLight};
  z-index: 0;

  ${mediaQuery.afterTablet} {
    border-right: 170px solid transparent;
    border-top: 170px solid ${(props) => props.theme.basic.whiteLight};
  }
`;
