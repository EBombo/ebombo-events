import React from "reactn";
import dynamic from "next/dynamic";
import { spinLoader } from "../../src/components/common/loader";
import { SEOMeta } from "../../src/components/common/seo";
import Login from "../../src/pages/login";
import { Navbar } from "../../src/components/Navbar";

const UserLayout = dynamic(() => import("../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const Registration = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <Login {...props} />
    </Navbar>
  </>
);

export default Registration;
