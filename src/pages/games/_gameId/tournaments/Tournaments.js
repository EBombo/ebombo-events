import React, {useEffect, useState} from "reactn";
import styled from "styled-components";
import {useParams} from "react-router";
import {firestore} from "../../../../firebase";
import isEmpty from "lodash/isEmpty";
import {snapshotToArray, spinLoader} from "../../../../utils";
import {ItemCardTournament} from "../../../../components/tournaments/ItemCardTournament";
import {EmptyTournaments} from "../consoles/_consoleId/challenges/emptyTournament";
import {ButtonBombo} from "../../../../components";
import {mediaQuery} from "../../../../styles/constants";

const initLimit = 5;

export const TournamentsContainer = () => {
  const {gameId} = useParams();
  const [tournaments, setTournaments] = useState([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [limit, setLimit] = useState(initLimit);
  const [loadingLimit, setLoadingLimit] = useState(false);

  useEffect(() => {
    const fetchTournaments = () => {
      let tournamentRef = firestore
        .collection("tournaments")
        .where("deleted", "==", false)
        .where("isClosed", "==", false);

      if (gameId !== "all")
        tournamentRef = tournamentRef.where("game.id", "==", gameId);

      return tournamentRef
        .where("eventType", "==", "tournament")
        .where("inscriptionDate", ">", new Date())
        .limit(limit)
        .onSnapshot((snapshot) => {
          setTournaments(snapshotToArray(snapshot));
          setLoadingTournaments(false);
          setLoadingLimit(false);
        });
    };

    const unSubScribeTournaments = fetchTournaments();
    return () => unSubScribeTournaments && unSubScribeTournaments();
  }, [gameId, limit]);

  useEffect(() => {
    setLimit(initLimit);
  }, [gameId]);

  if (loadingTournaments) return spinLoader();

  if (isEmpty(tournaments)) return <EmptyTournaments/>;

  return (
      <TournamentsContainerCss>
        <div className="container-tournaments">
          {tournaments.map((tournament) => (
              <ItemCardTournament
                  tournament={tournament}
                  key={`key-tournament-${tournament.id}`}
              />
          ))}
        </div>
        {limit <= tournaments.length && (
            <ButtonBombo
                loading={loadingLimit}
                disabled={loadingLimit}
                margin={"1rem auto"}
                onClick={() => {
                  setLoadingLimit(true);
                  setLimit(limit + initLimit);
                }}
            >
              VER MÁS
            </ButtonBombo>
        )}
      </TournamentsContainerCss>
  );
};

const TournamentsContainerCss = styled.div`

  ${mediaQuery.afterTablet} {
    .container-tournaments {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      justify-content: center;
      padding: 1rem;
    }
  }
`;
