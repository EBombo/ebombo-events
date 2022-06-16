import React from "reactn";
import dynamic from "next/dynamic";
import { spinLoader } from "../../../src/components/common/loader";
import { PrivateRoutes } from "../../../src/routes/PrivateRoutes";
import { Contacts } from "../../../src/pages/admin/contacts";

const UserLayout = dynamic(() => import("../../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const ContactsPage = (props) => {
  return (
    <PrivateRoutes>
      <UserLayout {...props}>
        <Contacts {...props} />
      </UserLayout>
    </PrivateRoutes>
  );
};

export default ContactsPage;
