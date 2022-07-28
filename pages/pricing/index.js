import React from "reactn";
import { SEOMeta } from "../../src/components/common/seo";
import { Navbar } from "../../src/components/Navbar";
import { Pricing } from "../../src/pages/pricing";

const PricingContainer = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <Pricing {...props} />
    </Navbar>
  </>
);

export default PricingContainer;
