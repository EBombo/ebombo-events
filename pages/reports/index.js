import React, { useEffect, useState } from "reactn";
import dynamic from "next/dynamic";
import { spinLoader } from "../../src/components/common/loader";
import { PrivateRoutes } from "../../src/routes/PrivateRoutes";
import { SEOMeta } from "../../src/components/common/seo";
import { CompanyReport } from "../../src/pages/companies/_companyId/CompanyReport";
import { firestore } from "../../src/firebase";
import { snapshotToArray } from "../../src/utils";

const UserLayout = dynamic(() => import("../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const Reports = (props) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const userQuery = await firestore.collection("users").get();

      let users_ = snapshotToArray(userQuery);
      users_ = users_.map((user) => ({ ...user, userName: user.email?.split("@")?.[0] }));
      setUsers(users_);
    };

    fetchUsers();
  }, []);

  return (
    <PrivateRoutes>
      <SEOMeta {...props} />
      <UserLayout {...props}>
        <CompanyReport usersAdmin={users} />
      </UserLayout>
    </PrivateRoutes>
  );
};

export default Reports;
