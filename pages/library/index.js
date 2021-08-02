import React from "reactn";
import { Library } from "../../src/pages/library";
import dynamic from "next/dynamic";
import { spinLoader } from "../../src/components/common/loader";
import { SEOMeta } from "../../src/components/common/seo";
import { UserPrivateRoute } from "../../src/routes/UserPrivateRoute";

const UserLayout = dynamic(() => import("../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const HomePage = (props) => (
  <UserPrivateRoute>
    <SEOMeta {...props} />
    <UserLayout {...props}>
      <Library {...props} />
    </UserLayout>
  </UserPrivateRoute>
);

export default HomePage;
