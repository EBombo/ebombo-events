import dynamic from "next/dynamic";
import { spinLoader } from "../../../src/components/common/loader";
import { PrivateRoutes } from "../../../src/routes/PrivateRoutes";
import { Audios } from "../../../src/pages/admin/audios";

const UserLayout = dynamic(() => import("../../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const AudiosContainer = (props) => {
  return (
    <PrivateRoutes>
      <UserLayout {...props}>
        <Audios {...props} />;
      </UserLayout>
    </PrivateRoutes>
  );
};

export default AudiosContainer;
