import React from "reactn";
import { InvoiceDetail } from "../../../../../src/pages/users/_userId/invoices/_invoiceId";
import dynamic from "next/dynamic";
import { spinLoader } from "../../../../../src/components/common/loader";
import { UserPrivateRoute } from "../../../../../src/routes/UserPrivateRoute";

const UserLayout = dynamic(() => import("../../../../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const InvoiceIdView = (props) => (
    <UserLayout {...props}>
      <InvoiceDetail {...props} />
    </UserLayout>

);
  // <UserPrivateRoute>
  // </UserPrivateRoute>

export default InvoiceIdView;


