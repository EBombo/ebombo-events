import React from "reactn";
import { SEOMeta } from "../../../../src/components/common/seo";
import { PrivateRoutes } from "../../../../src/routes/PrivateRoutes";
import { GameContainer } from "../../../../src/pages/library/games/_gameId";

const Game = (props) => (
  <PrivateRoutes>
    <SEOMeta {...props} />
    <GameContainer {...props} />
  </PrivateRoutes>
);

export default Game;
