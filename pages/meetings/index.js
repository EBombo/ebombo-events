import React from "reactn";
import { SEOMeta } from "../../src/components/common/seo";
import { Navbar } from "../../src/components/Navbar";
import { Meetings } from "../../src/pages/meetings";

const OnBoardingContainer = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <Meetings {...props} />
    </Navbar>
  </>
);

export default OnBoardingContainer;
