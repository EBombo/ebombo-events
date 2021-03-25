import React, { useEffect, useGlobal, useRef, useState } from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { config, firestore } from "../../../../../../firebase";
import { useHistory, useParams } from "react-router";
import { snapshotToArray, spinLoader } from "../../../../../../utils";
import { ButtonBombo } from "../../../../../../components";
import { Icon } from "../../../../../../components/common/Icons";
import { ChallengeCard } from "./ChallengeCard";
import { Desktop, Tablet } from "../../../../../../styles/utils";
import { ModalChallengeInfo } from "./ModalChallengeInfo";
import { mediaQuery } from "../../../../../../styles/constants";
import { Anchor } from "../../../../../../components/common/Anchor";
import moment from "moment";

const limit = 4;

export const ChallengesResults = (props) => {
  const history = useHistory();

  const { gameId, consoleId } = useParams();

  const [games] = useGlobal("games");
  const [loadingSearchRoom] = useGlobal("loadingSearchRoom");
  const [gameRuleId] = useGlobal("gameRuleId");

  const [challenges, setChallenges] = useState([]);
  const [challengesLimit, setChallengesLimit] = useState(limit);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [
    isVisibleModalChallengeInfo,
    setIsVisibleModalChallengeInfo,
  ] = useState(false);

  let unSubScribeChallenges = useRef(null);

  useEffect(() => {
    setChallengesLimit(limit);
  }, [gameId]);

  useEffect(() => {
    setLoadingChallenges(true);
    !isEmpty(unSubScribeChallenges.current) && unSubScribeChallenges.current();
    unSubScribeChallenges = fetchChallenges();

    return () =>
      !isEmpty(unSubScribeChallenges.current) &&
      unSubScribeChallenges.current();
  }, [gameId, challengesLimit]);

  const fetchChallenges = () =>
    firestore
      .collection("challenges")
      .where("deleted", "==", false)
      .where("challenged", "==", null)
      .where("challengedReady", "==", false)
      .where("game.id", "==", gameId)
      .where("createAt", ">", moment().subtract(1, "days").toDate())
      .orderBy("createAt", "desc")
      .limit(challengesLimit)
      .onSnapshot((snapshot) => {
        setChallenges(snapshotToArray(snapshot));
        setLoadingChallenges(false);
      });

  return (
    <ContainerMatchesResult>
      {isVisibleModalChallengeInfo && (
        <ModalChallengeInfo
          setIsVisibleModalChallengeInfo={setIsVisibleModalChallengeInfo}
          isVisibleModalChallengeInfo={isVisibleModalChallengeInfo}
        />
      )}
      <div className="title-container" key={`key-title2-${gameId}`}>
        <div className="challenges-header">
          <h3>Desafíos</h3>
        </div>
        <div className="right-content">
          <div className="publish-button-container">
            <img
              src={`${config.storageUrl}/resources/square-info.svg`}
              alt=""
              onClick={() => setIsVisibleModalChallengeInfo(true)}
              style={{ cursor: "pointer" }}
            />
            <ButtonBombo
              disabled={
                !gameId || !consoleId || !gameRuleId || loadingSearchRoom
              }
              onClick={() =>
                history.push({
                  pathname: `${window.location.pathname}/new`,
                })
              }
              fontSize="0.9rem"
              margin="0"
            >
              Publicar Desafio
            </ButtonBombo>
          </div>
        </div>
      </div>
      <div className="title-container header" key={`key-title1-${gameId}`}>
        <div className="game-name">
          {get(
            games.find((game) => game.id === gameId),
            "name",
            " del juego"
          )}
        </div>
        <div className="winner">ganador:</div>
      </div>
      {loadingChallenges ? (
        spinLoader()
      ) : (
        <>
          {isEmpty(challenges) ? (
            <div className="empty-challenges">
              <p>
                No hay desafíos recientes por el momento :( <br />
                Intenta buscar en desafíos pasados o ingresa más tarde a la
                plataforma
              </p>
              <img
                src={`${config.storageUrl}/resources/challenges-empty.svg`}
                alt=""
              />
            </div>
          ) : (
            <>
              {challenges.map((challenge) => (
                <div key={challenge.id}>
                  <Desktop>
                    <div className="challenge-card-container">
                      <ChallengeCard challenge={challenge} />
                    </div>
                  </Desktop>
                  <Tablet>
                    <div className="challenge-card-container">
                      <ChallengeCard challenge={challenge} />
                    </div>
                  </Tablet>
                </div>
              ))}
              {challengesLimit <= challenges.length && (
                <Anchor
                  type="primary"
                  onClick={() => {
                    setLoadingChallenges(true);
                    setChallengesLimit(challengesLimit + 4);
                  }}
                  fontSize={"12px"}
                  margin={"10px auto"}
                  display={"block"}
                  disabled={loadingChallenges}
                  loading={loadingChallenges}
                >
                  Ver más
                </Anchor>
              )}
            </>
          )}
        </>
      )}
    </ContainerMatchesResult>
  );
};

const ContainerMatchesResult = styled.div`
  padding-bottom: 2rem;
  border-bottom: 2px solid ${(props) => props.theme.basic.primaryDark};

  ${mediaQuery.afterTablet} {
    padding-bottom: 0;
    border-bottom: 0;
  }

  .winner {
    margin-right: 10px;
    ${mediaQuery.afterTablet} {
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
      color: ${(props) => props.theme.basic.whiteDarken};
    }
  }

  .title-container {
    padding: 6px 15px 3px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${mediaQuery.afterTablet} {
      height: auto;
      display: grid;
      grid-template-columns: 63% 1fr;
      padding: 10px 20px 6px 20px;
    }

    .challenges-header {
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;

      ${mediaQuery.afterTablet} {
        padding-top: 4px;
      }

      h3 {
        font-size: 16px;
        font-weight: bold;
        color: ${(props) => props.theme.basic.primary};
      }
    }

    .right-content {
      display: flex;
      position: relative;
      align-items: flex-start;
      justify-content: flex-end;
      height: 100%;
    }

    .publish-button-container {
      display: flex;
      justify-content: flex-end;

      img {
        margin-right: 10px;
      }
    }

    ${mediaQuery.afterTablet} {
      padding-bottom: 0;
    }
  }

  .header {
    color: ${(props) => props.theme.basic.whiteDarken};
    border-bottom: 2px solid ${(props) => props.theme.basic.primaryDark};
    padding: 0 20px 2px 20px;
    height: auto;

    .game-name {
      white-space: nowrap;
      font-weight: bold;
      font-size: 14px;
      padding-top: 11px;
    }
  }

  .container-tips {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .challenge-card-container {
    margin: 0 20px 2px 20px;
    border-bottom: 0.3px solid ${(props) => props.theme.basic.whiteDarken};

    ${mediaQuery.afterTablet} {
      margin: 0 38px 2px 20px;
    }
  }

  .result-tittle {
    font-weight: bold;
    margin: 0.5rem 0;
    color: ${(props) => props.theme.basic.white};

    .filters-container {
      display: flex;
      width: 100%;
      overflow-x: auto;

      .open-rooms {
        color: ${(props) => props.theme.basic.primary};
        margin: 10px 0;
      }

      .filter-name {
        color: ${(props) => props.theme.basic.white};
        margin: 10px 0;
      }

      .filter-container {
        font-size: 12px;
        color: gray;
        width: 100%;

        .filters {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }

  .empty-challenges {
    padding: 1rem 2rem;

    p {
      color: ${(props) => props.theme.basic.white};
      font-size: 12px;
      line-height: 15px;
    }

    img {
      display: flex;
      margin: 2rem auto;
    }
  }
`;
