import React from "reactn";
import { SEOMeta } from "../../../../src/components/common/seo";
import { PrivateRoutes } from "../../../../src/routes/PrivateRoutes";
import { Event } from "../../../../src/pages/library/events/_eventId";

const Game = (props) => (
  <PrivateRoutes>
    <SEOMeta {...props} />
    <Event {...props} />
  </PrivateRoutes>
);

export default Game;
