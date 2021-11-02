import React from "reactn";
import { HeldEvents } from "../../src/pages/held-events";
import { SEOMeta } from "../../src/components/common/seo";

const Init = (props) => (
  <>
    <SEOMeta {...props} />
    <HeldEvents {...props} />
  </>
);

export default Init;
