import React, { useEffect, useGlobal, useState } from "reactn";
import { useHistory, useParams } from "react-router";
import get from "lodash/get";
import { Consoles } from "../../../../../../../components/common/Consoles";
import { BackButton, Games, Levels } from "../../../../../../../components";
import { Desktop, spinLoader, Tablet } from "../../../../../../../utils";
import styled from "styled-components";
import { mediaQuery } from "../../../../../../../styles/constants";
import { ChallengeSearchOptions } from "./ChallengeSearchOptions";
import { Chat } from "../../../../../../../components/chat/Chat";
import { config, firestore } from "../../../../../../../firebase";
import defaultTo from "lodash/defaultTo";
import { UserImageProfile } from "../../../../../../../components/users/UserImageProfile";
import { showMoney } from "../../../../../../../utils/showMoney";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import { useOwnFetch } from "../../../../../../../utils/useFetch/useFetch";
import { Anchor } from "../../../../../../../components/common/Anchor";

export const ChallengeCreate = (props) => {
  const history = useHistory();
  const { gameId, consoleId, userId } = useParams();

  const [authUser] = useGlobal("user");
  const [, setIsVisibleLoginModal] = useGlobal("isVisibleLoginModal");
  const [games] = useGlobal("games");
  const [matches] = useGlobal("matches");
  const [gameEntryCost] = useGlobal("gameEntryCost");
  const [gameRuleId, setRuleId] = useGlobal("gameRuleId");
  const [rules] = useGlobal("rules");
  const [realMoney] = useGlobal("realMoney");
  const [, setIsVisibleModalUserAccount] = useGlobal(
    "isVisibleModalUserAccount"
  );

  const [challenged, setChallenged] = useState(null);
  const [loading, setLoading] = useState(true);

  const { ownFetch } = useOwnFetch();

  useEffect(() => {
    if (userId) {
      fetchChallenged();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const currentRules = defaultTo(rules, []).filter(
      (rule) => get(rule, "gameId", "") === gameId
    );
    setRuleId(get(currentRules, "[0].id"));
  }, [gameId]);

  const [creatingChallenge, setCreatingChallenge] = useState(false);

  const onClickConsole = (console_) =>
    userId
      ? history.push(
          `/games/${gameId}/consoles/${console_.id}/challenges/new/users/${userId}`
        )
      : history.push(`/games/${gameId}/consoles/${console_.id}/challenges/new`);

  const currentGame = () => games.find((game) => game.id === gameId);

  const fetchChallenged = async () => {
    const userRef = await firestore.doc(`users/${userId}`).get();
    setChallenged(userRef.data());
    setLoading(false);
  };

  const createChallenge = async () => {
    if (!authUser) return setIsVisibleLoginModal(true);

    const requiredUserAccount = props.findRequiredUserAccount(
      gameId,
      consoleId
    );

    if (!get(authUser, `userAccounts.${get(requiredUserAccount, "id")}`))
      return setIsVisibleModalUserAccount(true);

    if (realMoney) {
      if (showMoney(authUser) < gameEntryCost)
        return props.showNotification(
          "Dinero insufiente",
          "Para crear un desafio debes recargar"
        );

      if (gameEntryCost < 1)
        return props.showNotification("Apuesta mínima: $1");
    }

    if (
      !isEmpty(
        matches.filter((match) =>
          moment(match.createAt.toDate()).isBefore(new Date())
        )
      )
    )
      return props.showNotification(
        "Partida en juego.",
        "Solo puede jugar una partida a la vez."
      );

    setCreatingChallenge(true);
    await ownFetch(`${config.serverUrl}/challenges`, "POST", {
      userId: authUser.id,
      gameId: gameId,
      consoleId: consoleId,
      gameRuleId: gameRuleId,
      gameEntryCost: gameEntryCost,
      realMoney,
      challengedId: userId,
    });

    return userId
      ? history.push("/notifications/sent")
      : history.push("/notifications/my-challenges");

    setCreatingChallenge(false);
  };

  return loading ? (
    spinLoader()
  ) : (
    <Container>
      <div className="left-container">
        <div className="top-container">
          <BackButton
            onClick={() =>
              history.push(`/games/${gameId}/consoles/${consoleId}/challenges`)
            }
          />
          {challenged ? (
            <div className="title" key={`key-title-${gameId}-${userId}`}>
              <span className="action">Invitar a un rival</span>
              <div className="sub-title">
                Vas a invitar a {challenged.name} a jugar
              </div>

              <div className="challenged-profile">
                <div className="challenged-info">
                  <UserImageProfile
                    borderRadius="4px"
                    size="big"
                    url={
                      challenged.profileImageUrlThumb
                        ? challenged.profileImageUrlThumb
                        : `${config.storageUrl}/resources/perfil-icon.svg`
                    }
                  />
                  <div className="nickname-level">
                    {challenged.nickname}
                    <Levels
                      gamesStatistics={get(challenged, "gamesStatistics", [])}
                      gameId={gameId}
                      border={true}
                    />
                  </div>
                </div>
                <div>
                  <Anchor
                    type="primary"
                    onClick={() => history.push(`/users/${challenged.id}`)}
                  >
                    Ver Perfil >
                  </Anchor>
                </div>
              </div>
            </div>
          ) : (
            <div className="title" key={`key-title-${gameId}`}>
              PUBLICAR DESAFIO DE{" "}
              <span className="action">
                {get(currentGame(), "name", "").toUpperCase()}
              </span>
            </div>
          )}

          <Tablet>
            <div className="legend">Elige tu juego</div>
            <Games onClick={props.onClickGame} />
          </Tablet>
          <div className="legend">Elige la consola</div>
          <Consoles isDesktop onClick={onClickConsole} />
        </div>
        <ChallengeSearchOptions
          {...props}
          createChallenge={createChallenge}
          creatingChallenge={creatingChallenge}
          challenged={challenged}
        />
      </div>
      <Desktop>
        <div className="right-container">
          <Chat key={gameId} chatId={gameId} showGames />
        </div>
      </Desktop>
    </Container>
  );
};

const Container = styled.div`
  margin: auto;
  width: 100%;

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 70% 30%;
    min-height: 100vh;
  }

  .left-container {
    .top-container {
      margin: 1rem 0;
      padding: 0 1rem;
    }
    .title {
      align-items: center;
      font-size: 16px;
      font-weight: bold;
      color: ${(props) => props.theme.basic.white};
      margin: 1rem 0;
      margin-right: 5px;

      ${mediaQuery.afterTablet} {
        margin-bottom: 2rem;
      }

      .action {
        font-size: 16px;
        color: ${(props) => props.theme.basic.action};
      }

      .sub-title {
        font-size: 10px;
        color: ${(props) => props.theme.basic.white};
      }

      .challenged-profile {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 1rem 0;

        .challenged-info {
          display: flex;
          align-items: center;

          .nickname-level {
            font-weight: bold;
            font-size: 11px;
            line-height: 14px;
            margin-left: 1rem;
            ${mediaQuery.afterTablet} {
              font-size: 13px;
              line-height: 16px;
            }
          }
        }
      }
    }

    .legend {
      color: ${(props) => props.theme.basic.primary};
      font-size: 12px;
      margin: 5px 0;
    }

    .rules-container {
      margin: 2rem 0;
    }
  }

  .right-container {
    background: ${(props) => props.theme.basic.blackLighten};
  }
`;
