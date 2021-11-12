import React from "reactn";
import { HeldEvents } from "../../src/pages/held-events";
import { SEOMeta } from "../../src/components/common/seo";
import { Navbar } from "../../src/components/Navbar";

const HeldEventsContainer = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <HeldEvents {...props} />
    </Navbar>
  </>
);

export default HeldEventsContainer;
