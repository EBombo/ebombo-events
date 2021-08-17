import dynamic from "next/dynamic";
import { spinLoader } from "../../../../src/components/common/loader";
import { PrivateRoutes } from "../../../../src/routes/PrivateRoutes";
import { Audio } from "../../../../src/pages/admin/audios/_audioId";

const UserLayout = dynamic(
  () => import("../../../../src/components/UserLayout"),
  {
    ssr: false,
    loading: () => spinLoader(),
  }
);

const AudioContainer = (props) => {
  return (
    <PrivateRoutes>
      <UserLayout {...props}>
        <Audio {...props} />
      </UserLayout>
    </PrivateRoutes>
  );
};

export default AudioContainer;
