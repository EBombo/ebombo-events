import React from "reactn";
import { BillingOverview } from "../../../../src/pages/users/_userId/billing/BillingOverview";
import dynamic from "next/dynamic";
import { spinLoader } from "../../../../src/components/common/loader";
import { UserPrivateRoute } from "../../../../src/routes/UserPrivateRoute";

const UserLayout = dynamic(() => import("../../../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const BillingDetailContainer = (props) => (
  <UserPrivateRoute>
    <UserLayout {...props}>
      <BillingOverview {...props} />
    </UserLayout>
  </UserPrivateRoute>
);

export default BillingDetailContainer;
