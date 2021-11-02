import React from "reactn";
import { UseCases } from "../../src/pages/held-events";
import { SEOMeta } from "../../src/components/common/seo";

const Init = (props) => (
  <>
    <SEOMeta {...props} />
    <UseCases {...props} />
  </>
);

export default Init;
