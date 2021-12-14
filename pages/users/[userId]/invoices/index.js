import React from "reactn";
import { AllInvoices } from "../../../../src/pages/users/_userId/invoices/AllInvoices";
import dynamic from "next/dynamic";
import { spinLoader } from "../../../../src/components/common/loader";
import { UserPrivateRoute } from "../../../../src/routes/UserPrivateRoute";

const UserLayout = dynamic(() => import("../../../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const AllInvoicesContainer = (props) => (
  <UserPrivateRoute>
    <UserLayout {...props}>
      <AllInvoices {...props} />
    </UserLayout>
  </UserPrivateRoute>
);

export default AllInvoicesContainer;



