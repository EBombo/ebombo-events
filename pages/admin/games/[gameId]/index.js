import { GameContainer } from "../../../../src/pages/admin/games/_gameId";
import dynamic from "next/dynamic";
import { spinLoader } from "../../../../src/components/common/loader";
import { PrivateRoutes } from "../../../../src/routes/PrivateRoutes";

const UserLayout = dynamic(
  () => import("../../../../src/components/UserLayout"),
  {
    ssr: false,
    loading: () => spinLoader(),
  }
);

const Game = (props) => {
  return (
    <PrivateRoutes>
      <UserLayout {...props}>
        <GameContainer {...props} />
      </UserLayout>
    </PrivateRoutes>
  );
};

export default Game;
