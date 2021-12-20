import React from "reactn";
import { GamesDetail } from "../../src/pages/games";
import { SEOMeta } from "../../src/components/common/seo";
import { Navbar } from "../../src/components/Navbar";

const Games = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <GamesDetail {...props} />
    </Navbar>
  </>
);

export default Games;
