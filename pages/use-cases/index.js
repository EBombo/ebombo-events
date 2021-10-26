import React from "reactn";
import { UseCases } from "../../src/pages/use-cases";
import { SEOMeta } from "../../src/components/common/seo";

const Init = (props) => (
  <>
    <SEOMeta {...props} />
    <UseCases {...props} />
  </>
);

export default Init;
