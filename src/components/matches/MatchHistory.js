import React from "reactn";
import {Levels} from "../common";
import get from "lodash/get";
import defaultTo from "lodash/defaultTo";
import {MatchDetails} from "./MatchDetails";
import styled from "styled-components";
import {userAccounts} from "../common/DataList";
import {UserImageProfile} from "../users/UserImageProfile";
import {config} from "../../firebase";

export const MatchHistory = (props) => {
  const { match } = props;

  const reducePoints = (points) =>
    defaultTo(points, []).reduce((a, b) => a + b, 0);

  const accountType = (match) => {
    let accountType_ = userAccounts.find((userAccount) =>
      match.console.name.includes(userAccount.abbreviation)
    );
    if (match.game.name.toLowerCase().includes("call"))
      accountType_ = userAccounts.find(
        (userAccount) => userAccount.abbreviation === "ACTIVISION"
      );
    return accountType_;
  };

  const totalPlayers = () => get(match, "rule.totalPlayers", 1);

  return (
    <Container>
      <div className="score">
        <User
          isVictory={
            reducePoints(match.challengedPoints) >
            reducePoints(match.challengerPoints)
          }
        >
          <UserImageProfile
            size={"big"}
            url={get(
              match,
              "challenged[0].profileImageUrlThumb",
              `${config.storageUrl}/resources/perfil-icon.svg`
            )}
          />
          <Levels
            gamesStatistics={get(match, "challenged[0].gamesStatistics", [])}
            gameId={get(match, "game.id", "")}
          />
          <label className="nickname">
            {" "}
            {get(match, "challenged[0].nickname", "-")}{" "}
          </label>
          <label className="points">
            {" "}
            {reducePoints(get(match, "challengedPoints", "-"))}{" "}
          </label>
        </User>
        <div className="score-separator">-</div>
        <User
          isVictory={
            reducePoints(match.challengerPoints) >
            reducePoints(match.challengedPoints)
          }
        >
          <UserImageProfile
            size={"big"}
            url={get(
              match,
              "challenger[0].profileImageUrlThumb",
              `${config.storageUrl}/resources/perfil-icon.svg`
            )}
          />
          <Levels
            gamesStatistics={get(match, "challenger[0].gamesStatistics", [])}
            gameId={get(match, "game.id", "")}
          />
          <label className="nickname">
            {" "}
            {get(match, "challenger[0].nickname", "-")}{" "}
          </label>
          <label className="points">
            {" "}
            {reducePoints(get(match, "challengerPoints", []))}{" "}
          </label>
        </User>
      </div>
      <br />
      {!match.tournamentId && <MatchDetails {...match} />}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  color: ${(props) => props.theme.basic.white};
  min-width: 350px;
  .score {
    display: flex;
    justify-content: space-around;
    align-items: baseline;

    &-separator {
      font-weight: 900;
      font-size: 1.2rem;
    }

    .user {
    }
  }
`;

const User = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;

  .level {
    color: ${(props) => props.theme.basic.primary};
    font-size: 12px;
  }

  .nickname {
    font-weight: 500;
    font-size: 15px;
  }

  .points {
    margin: 0.7rem 0;
    color: ${(props) =>
      props.isVictory ? props.theme.basic.primary : props.theme.basic.danger};
    font-weight: 500;
    font-size: 30px;
  }
`;
