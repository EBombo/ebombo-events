import React from "reactn";
import { Register } from "../../src/pages/register";
import { SEOMeta } from "../../src/components/common/seo";
import { Navbar } from "../../src/components/Navbar";

const Registration = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <Register {...props} />
    </Navbar>
  </>
);

export default Registration;
