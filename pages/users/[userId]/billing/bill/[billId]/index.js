import React from "reactn";
import { BillId } from "../../../../../../src/pages/users/_userId/billing/_billId";
import dynamic from "next/dynamic";
import { spinLoader } from "../../../../../../src/components/common/loader";
import { UserPrivateRoute } from "../../../../../../src/routes/UserPrivateRoute";

const UserLayout = dynamic(() => import("../../../../../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const BillIdContainer = (props) => (
  <UserPrivateRoute>
    <UserLayout {...props}>
      <BillId {...props} />
    </UserLayout>
  </UserPrivateRoute>
);

export default BillIdContainer;

