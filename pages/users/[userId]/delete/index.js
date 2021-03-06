import React from "reactn";
import dynamic from "next/dynamic";
import { spinLoader } from "../../../../src/components/common/loader";
import { UserPrivateRoute } from "../../../../src/routes/UserPrivateRoute";
import { DeleteUser } from "../../../../src/pages/users/_userId/delete";

const UserLayout = dynamic(() => import("../../../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const UserProfileContainer = (props) => (
  <UserPrivateRoute>
    <UserLayout {...props}>
      <DeleteUser {...props} />
    </UserLayout>
  </UserPrivateRoute>
);

export default UserProfileContainer;
