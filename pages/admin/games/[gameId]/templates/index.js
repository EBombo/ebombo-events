import dynamic from "next/dynamic";
import { PrivateRoutes } from "../../../../../src/routes/PrivateRoutes";
import { spinLoader } from "../../../../../src/components/common/loader";
import { TemplatesGames } from "../../../../../src/pages/admin/games/_gameId/templates";

const UserLayout = dynamic(() => import("../../../../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const TemplatesGamesPage = (props) => {
  return (
    <PrivateRoutes>
      <UserLayout {...props}>
        <TemplatesGames {...props} />
      </UserLayout>
    </PrivateRoutes>
  );
};

export default TemplatesGamesPage;
