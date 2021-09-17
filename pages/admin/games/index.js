import { GamesContainer } from "../../../src/pages/admin/games";
import dynamic from "next/dynamic";
import { spinLoader } from "../../../src/components/common/loader";
import { PrivateRoutes } from "../../../src/routes/PrivateRoutes";

const UserLayout = dynamic(() => import("../../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const Games = (props) => {
  return (
    <PrivateRoutes>
      <UserLayout {...props}>
        <GamesContainer {...props} />
      </UserLayout>
    </PrivateRoutes>
  );
};

export default Games;
