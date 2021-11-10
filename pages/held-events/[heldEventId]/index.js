import React from "reactn";
import { SEOMeta } from "../../../src/components/common/seo";
import { HeldEventDetails } from "../../../src/pages/held-events/_heldEventId";

const HeldEventContainer = (props) => (
  <>
    <SEOMeta {...props} />
    <HeldEventDetails {...props} />
  </>
);

export default HeldEventContainer;
