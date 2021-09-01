import React from "reactn";
import dynamic from "next/dynamic";
import { spinLoader } from "../../../../../src/components/common/loader";
import { SEOMeta } from "../../../../../src/components/common/seo";
import { PrivateRoutes } from "../../../../../src/routes/PrivateRoutes";
import { GameView } from "../../../../../src/pages/library/games/_gameId/view";

const UserLayout = dynamic(
  () => import("../../../../../src/components/UserLayout"),
  {
    ssr: false,
    loading: () => spinLoader(),
  }
);

const GameViewContainer = (props) => (
  <PrivateRoutes>
    <SEOMeta {...props} />
    <UserLayout {...props}>
      <GameView {...props} />
    </UserLayout>
  </PrivateRoutes>
);

export default GameViewContainer;
