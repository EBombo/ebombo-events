import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { mediaQuery } from "../../../../../../../styles/constants";
import moment from "moment";
import defaultTo from "lodash/defaultTo";
import { InscriptionIndividual } from "./InscriptionIndividual";
import { InscriptionTeam } from "./InscriptionTeam";
import { spinLoader } from "../../../../../../../utils";

export const Inscription = (props) => {
  const [authUser] = useGlobal("user");
  const [tournamentTeam, setTournamentTeam] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) setTournamentTeam(null);

    const myTournamentTeam_ = defaultTo(
      props.tournamentTeams,
      []
    ).find((tournamentTeam_) =>
      tournamentTeam_.playerIds.includes(get(authUser, "id", null))
    );
    setTournamentTeam(myTournamentTeam_);

    setLoading(false);
  }, [props.tournamentTeams, props.tournamentGroups, authUser]);

  if (loading) return spinLoader();

  return (
    <Container>
      {moment().isAfter(props.tournament.inscriptionDate.toDate()) &&
      (!tournamentTeam ||
        (get(tournamentTeam, "inscriptionUrl") &&
          !get(tournamentTeam, "isPayed"))) ? (
        <div />
      ) : props.tournament.rule.totalPlayers > 1 ? (
        <InscriptionTeam tournamentTeam={tournamentTeam} {...props} />
      ) : (
        <InscriptionIndividual tournamentTeam={tournamentTeam} {...props} />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;

  ${mediaQuery.afterTablet} {
    align-items: flex-start;
    text-align: left;
  }

  h1 {
    font-weight: bold;
    font-size: 15px;
    line-height: 15px;
    color: ${(props) => props.theme.basic.white};
    text-align: left;
    padding: 0.5rem 0;
  }

  .content-text-inscription {
    width: 100%;
    color: ${(props) => props.theme.basic.white};
    font-size: 10px;

    .text-primary {
      width: 100%;
      margin: 0.5rem 0;

      p {
        color: ${(props) => props.theme.basic.primary};
        padding: 0 0.3rem;

        i {
          margin-left: 5px;
        }
      }
    }

    .text-secondary {
      margin: 0.5rem 0;
      color: ${(props) => props.theme.basic.white};
      font-size: 12px;

      span {
        margin: 0 5px;
        color: ${(props) => props.theme.basic.danger};
      }

      .action {
        color: ${(props) => props.theme.basic.action};
      }
    }

    .text-tertiary {
      color: ${(props) => props.theme.basic.action};
      margin: 0;
      white-space: pre-line;
    }

    .stream-container {
      .input-stream-url {
        background: ${(props) => props.theme.basic.blackDarken};
        border-radius: 7px;
        border: none;
        color: ${(props) => props.theme.basic.white};
        padding: 10px;
        margin: 10px 0;
        width: 100%;
      }

      .logos-container {
        flex-grow: 1;
        display: flex;
        justify-content: flex-end;

        img {
          height: 25px;
          width: 25px;
          margin: 0 5px;
        }
      }

      ${mediaQuery.afterTablet} {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .input-stream-url {
          width: 70%;
        }
      }
    }
  }

  .btns-action {
    margin: 1rem 0;
    display: grid;
    grid-template-columns: 45% 45%;
    grid-gap: 1rem;
  }
`;
