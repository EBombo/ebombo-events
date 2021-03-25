import React, {useEffect, useGlobal, useRef, useState} from "reactn";
import styled from "styled-components";
import {useParams} from "react-router";
import isEmpty from "lodash/isEmpty";
import {firestore} from "../../../../../../firebase";
import {snapshotToArray, spinLoader} from "../../../../../../utils";
import defaultTo from "lodash/defaultTo";
import moment from "moment";
import {ItemCardTournament} from "../../../../../../components/tournaments/ItemCardTournament";
import get from "lodash/get";
import {EmptyTournaments} from "./emptyTournament";
import {Anchor} from "../../../../../../components/common/Anchor";

export const TournamentsResults = (props) => {
  const {gameId} = useParams();

  const [games] = useGlobal("games");

  const [tab, setTab] = useState("open");
  const [tournamentsLimit, setTournamentsLimit] = useState(4);
  const [tournaments, setTournaments] = useState([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);

  let unSubScribeTournaments = useRef(null);

  useEffect(() => {
    setLoadingTournaments(true);
    !isEmpty(unSubScribeTournaments.current) &&
      unSubScribeTournaments.current();
    unSubScribeTournaments = fetchTournaments();

    return () =>
      !isEmpty(unSubScribeTournaments.current) &&
      unSubScribeTournaments.current();
  }, [gameId, tournamentsLimit]);

  const fetchTournaments = () =>
    firestore
      .collection("tournaments")
      .where("deleted", "==", false)
      .where("isClosed", "==", false)
      .where("game.id", "==", gameId)
      .where("eventType", "==", "tournament")
      .where("endDate", ">", new Date())
      .limit(tournamentsLimit)
      .onSnapshot((snapshot) => {
        setTournaments(snapshotToArray(snapshot));
        setLoadingTournaments(false);
      });

  return (
    <Container>
      <div className="container-tab" key={`key-title1-${gameId}`}>
        <h3>
          TORNEOS DE
          <span>
            {get(
              games.find((game) => game.id === gameId),
              "name",
              " del juego"
            ).toUpperCase()}
          </span>
        </h3>

        <div className="tabs-options">
          <div
            className={`tab ${tab === "open" ? "active" : ""}`}
            onClick={() => setTab("open")}
          >
            Abiertos
          </div>
          <div
            className={`tab ${tab === "participating" ? "active" : ""}`}
            onClick={() => setTab("participating")}
          >
            Participando
          </div>
        </div>
      </div>
      {loadingTournaments ? (
        spinLoader()
      ) : (
        <>
          {isEmpty(tournaments) ? (
            <EmptyTournaments />
          ) : (
            <>
              <div className="content-items-card">
                {defaultTo(tournaments, []).map((tournament) => (
                  <ItemCardTournament
                    tournament={tournament}
                    key={`key-match-${moment(
                      tournament.createAt.toDate()
                    ).format("DD/MM/YYYY HH:mm:ss a")}`}
                  />
                ))}
              </div>
              <Anchor
                onClick={() => {
                  setLoadingTournaments(true);
                  setTournamentsLimit(tournamentsLimit + 4);
                }}
                fontSize={"10px"}
                display={"block"}
                margin={"0 auto"}
                padding={"0"}
                disabled={loadingTournaments}
                loading={loadingTournaments}
              >
                Ver más
              </Anchor>
            </>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  .container-tab {
    margin: 0.5rem 0;
    display: flex;
    justify-content: space-between;
    background: ${(props) => props.theme.basic.blackLighten};
    border-radius: 3px;

    h3 {
      padding: 0.5rem;
      font-size: 16px;
      font-weight: bold;
      color: ${(props) => props.theme.basic.white};

      span {
        font-size: 16px;
        margin-left: 5px;
        color: ${(props) => props.theme.basic.action};
      }
    }

    .sub-title {
      font-size: 10px;
      color: ${(props) => props.theme.basic.action};
    }

    .tabs-options {
      display: flex;

      .tab {
        cursor: pointer;
        color: ${(props) => props.theme.basic.white};
        padding: 0.5rem;
        height: 100%;
      }

      .active {
        color: ${(props) => props.theme.basic.primary};
        border-bottom: 2px solid ${(props) => props.theme.basic.primary};
      }
    }
  }

  .empty-tournaments {
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
