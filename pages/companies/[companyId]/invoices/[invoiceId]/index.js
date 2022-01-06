import React from "reactn";
import { InvoiceDetail } from "../../../../../src/pages/companies/_companyId/invoices/_invoiceId";
import dynamic from "next/dynamic";
import { spinLoader } from "../../../../../src/components/common/loader";
import { UserPrivateRoute } from "../../../../../src/routes/UserPrivateRoute";

const UserLayout = dynamic(() => import("../../../../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const InvoiceIdView = (props) => (
  <UserPrivateRoute>
    <UserLayout {...props}>
      <InvoiceDetail {...props} />
    </UserLayout>
  </UserPrivateRoute>
);

export default InvoiceIdView;


