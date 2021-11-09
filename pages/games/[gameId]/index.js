import React from "reactn";
import { GameDetail } from "../../../src/pages/games/_gameId";
import { SEOMeta } from "../../../src/components/common/seo";

const Init = (props) => (
  <>
    <SEOMeta {...props} />
    <GameDetail {...props} />
  </>
);

export default Init;
