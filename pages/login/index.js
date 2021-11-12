import React from "reactn";
import { SEOMeta } from "../../src/components/common/seo";
import Login from "../../src/pages/login";
import { Navbar } from "../../src/components/Navbar";

const Registration = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <Login {...props} />
    </Navbar>
  </>
);

export default Registration;
