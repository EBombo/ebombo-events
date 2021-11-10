import React from "reactn";
import { GameDetail } from "../../../src/pages/games/_gameId";
import { SEOMeta } from "../../../src/components/common/seo";
import { Navbar } from "../../../src/components/Navbar";

const Games = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <GameDetail {...props} />
    </Navbar>
  </>
);

export default Games;
