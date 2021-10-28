import React from "reactn";
import { SEOMeta } from "../../../src/components/common/seo";
import { UseCaseDetail } from "../../../src/pages/held-events/_heldEventId";

const Init = (props) => (
  <>
    <SEOMeta {...props} />
    <UseCaseDetail {...props} />
  </>
);

export default Init;

