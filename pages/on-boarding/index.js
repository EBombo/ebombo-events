import React from "reactn";
import { SEOMeta } from "../../src/components/common/seo";
import { Navbar } from "../../src/components/Navbar";
import { OnBoarding } from "../../src/pages/on-boarding";

const OnBoardingContainer = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <OnBoarding {...props} />
    </Navbar>
  </>
);

export default OnBoardingContainer;

