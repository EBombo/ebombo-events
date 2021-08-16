import dynamic from "next/dynamic";
import { spinLoader } from "../../../src/components/common/loader";
import { PrivateRoutes } from "../../../src/routes/PrivateRoutes";
import { Music } from "../../../src/pages/admin/music";

const UserLayout = dynamic(() => import("../../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const Games = (props) => {
  return (
    <PrivateRoutes>
      <UserLayout {...props}>
        <Music {...props} />;
      </UserLayout>
    </PrivateRoutes>
  );
};

export default Games;
