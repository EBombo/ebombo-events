import React from "reactn";
import { Navbar } from "../../src/components/Navbar";
import { SEOMeta } from "../../src/components/common/seo";
import { Experience } from "../../src/pages/experience";

const FoundersContainer = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <Experience {...props} />
    </Navbar>
  </>
);

export default FoundersContainer;
