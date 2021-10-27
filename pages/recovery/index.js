import React from "reactn";
import dynamic from "next/dynamic";
import { spinLoader } from "../../src/components/common/loader";
import { SEOMeta } from "../../src/components/common/seo";
import ForgotPassword from "../../src/pages/forgot-password";

const UserLayout = dynamic(() => import("../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const Registration = (props) => (
  <>
    <SEOMeta {...props} />
    <UserLayout {...props}>
      <ForgotPassword {...props} />
    </UserLayout>
  </>
);

export default Registration;
