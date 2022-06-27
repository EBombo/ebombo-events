import React from "reactn";
import dynamic from "next/dynamic";
import { spinLoader } from "../../src/components/common/loader";
import { PrivateRoutes } from "../../src/routes/PrivateRoutes";
import { SEOMeta } from "../../src/components/common/seo";
import { Reports } from "../../src/pages/reports";

const UserLayout = dynamic(() => import("../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const ReportsContainer = (props) => (
  <PrivateRoutes>
    <SEOMeta {...props} />
    <UserLayout {...props}>
      <Reports {...props} />
    </UserLayout>
  </PrivateRoutes>
);

export default ReportsContainer;
