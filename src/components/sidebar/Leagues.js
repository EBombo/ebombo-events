import React, {useGlobal, useState} from "reactn";
import styled from "styled-components";
import {gaLeague} from "../../utils";
import isEmpty from "lodash/isEmpty";
import {useHistory} from "react-router";
import moment from "moment";
import {Anchor} from "../common/Anchor";

export const Leagues = (props) => {
  const [authUser] = useGlobal("user");
  const [leagues] = useGlobal("leagues");
  const [, setCurrentTournament] = useGlobal("currentTournament");
  const [, setOpenSidebarMenuLeft] = useGlobal("openSidebarMenuLeft");
  const [updating, setUpdating] = useState(false);
  const history = useHistory();

  return (
    <LeagueContent>
      <h4>Ligas:</h4>
      <div className="container-league">
        {leagues.map((league) => (
          <Anchor
            type="secondary"
            className="league-item"
            key={league.id}
            onClick={async () => {
              await setCurrentTournament(league);

              authUser && gaLeague(`1 Starting League Clicked ${league.name}`);

              if (!isEmpty(league.password)) return;

              setOpenSidebarMenuLeft(false);

              moment().isBefore(league.inscriptionDate.toDate())
                ? history.push(
                    `/games/${league.game.id}/consoles/${league.console.id}/tournaments/${league.id}`
                  )
                : history.push(
                    `/games/${league.game.id}/consoles/${league.console.id}/leagues/${league.id}/matches`
                  );
            }}
          >
            <span>- {league.name}</span>
          </Anchor>
        ))}
      </div>

      {/*
        <div>
          <span>SCRIPT USER BIRTHDATE</span>
          <ButtonBombo
            margin="20px 0px"
            padding="0px 12px"
            fontWeight="500"
            fontSize="10px"
            width="5rem"
            onClick={async () => {
              setUpdating(true);
              await updateCollections();
              setUpdating(false);
            }}
            loading={updating}
            disabled={updating}
          >
            Ver
          </ButtonBombo>
        </div>
      */}
    </LeagueContent>
  );
};

const LeagueContent = styled.div`
  margin: 20px;

  h4 {
    color: ${(props) => props.theme.basic.white};
  }

  .container-league {
    margin: 10px 0;

    .league-item {
      margin: 10px 0;
      display: grid;
      grid-template-columns: 3fr 1fr;

      img {
        text-align: start;
        font-size: 10px;
      }

      span {
        font-size: 14px;
        cursor: pointer;
        text-align: left;
      }
    }
  }
`;
