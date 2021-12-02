import React from "reactn";
import { BillingDetail } from "../../../../../src/pages/users/_userId/BillingDetail";
import dynamic from "next/dynamic";
import { spinLoader } from "../../../../../src/components/common/loader";
import { UserPrivateRoute } from "../../../../../src/routes/UserPrivateRoute";

const UserLayout = dynamic(() => import("../../../../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const BillingDetailContainer = (props) => (
  <UserPrivateRoute>
    <UserLayout {...props}>
      <BillingDetail {...props} />
    </UserLayout>
  </UserPrivateRoute>
);

export default BillingDetailContainer;
