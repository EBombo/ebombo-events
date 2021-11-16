import React from "reactn";
import { SEOMeta } from "../../src/components/common/seo";
import { Navbar } from "../../src/components/Navbar";
import { Founders } from "../../src/pages/founders";

const FoundersContainer = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <Founders {...props} />
    </Navbar>
  </>
);

export default FoundersContainer;
