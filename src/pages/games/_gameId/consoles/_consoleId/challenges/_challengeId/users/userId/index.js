import React from "reactn";
import { Desktop, Tablet } from "../../../../../../../../../utils";
import { Games } from "../../../../../../../../../components";
import { ChallengeCreate } from "../../ChallengeCreate";
import { useHistory, useParams } from "react-router";

export const UserInvitation = (props) => {
  const { userId } = useParams();
  const history = useHistory();

  const onClickGame = (game) =>
    history.push(
      `/games/${game.id}/consoles/${game.consoleIds[0]}/challenges/new/users/${userId}`
    );

  return (
    <>
      <Desktop>
        <Games onClick={onClickGame} isDesktop>
          <ChallengeCreate {...props} />
        </Games>
      </Desktop>
      <Tablet>
        <ChallengeCreate onClickGame={onClickGame} {...props} />
      </Tablet>
    </>
  );
};
