import React from "reactn";
import { LibraryContainer } from "../../../../src/pages/library";
import dynamic from "next/dynamic";
import { spinLoader } from "../../../../src/components/common/loader";
import { SEOMeta } from "../../../../src/components/common/seo";
import { PrivateRoutes } from "../../../../src/routes/PrivateRoutes";

const UserLayout = dynamic(
  () => import("../../../../src/components/UserLayout"),
  {
    ssr: false,
    loading: () => spinLoader(),
  }
);

const Folder = (props) => (
  <PrivateRoutes>
    <SEOMeta {...props} />
    <UserLayout {...props}>
      <LibraryContainer {...props} />
    </UserLayout>
  </PrivateRoutes>
);

export default Folder;
