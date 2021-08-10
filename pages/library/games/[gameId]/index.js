import React from "reactn";
import dynamic from "next/dynamic";
import { spinLoader } from "../../../../src/components/common/loader";
import { SEOMeta } from "../../../../src/components/common/seo";
import { PrivateRoutes } from "../../../../src/routes/PrivateRoutes";
import { GameContainer } from "../../../../src/pages/library/games/_gameId";

const UserLayout = dynamic(
  () => import("../../../../src/components/UserLayout"),
  {
    ssr: false,
    loading: () => spinLoader(),
  }
);

const Game = (props) => (
  <PrivateRoutes>
    <SEOMeta {...props} />
    <UserLayout {...props}>
      <GameContainer {...props} />
    </UserLayout>
  </PrivateRoutes>
);

export default Game;
