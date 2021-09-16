import React from "reactn";
import dynamic from "next/dynamic";
import { spinLoader } from "../../src/components/common/loader";
import { PrivateRoutes } from "../../src/routes/PrivateRoutes";
import { SEOMeta } from "../../src/components/common/seo";

const UserLayout = dynamic(() => import("../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const Reports = (props) => (
  <PrivateRoutes>
    <SEOMeta {...props} />
    <UserLayout {...props}>Reports</UserLayout>
  </PrivateRoutes>
);

export default Reports;
