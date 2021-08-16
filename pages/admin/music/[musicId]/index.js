import dynamic from "next/dynamic";
import { spinLoader } from "../../../../src/components/common/loader";
import { PrivateRoutes } from "../../../../src/routes/PrivateRoutes";
import { Song } from "../../../../src/pages/admin/music/_musicId";

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
        <Song {...props} />
      </UserLayout>
    </PrivateRoutes>
  );
};

export default Game;
