import React from "reactn";
import { SEOMeta } from "../../../src/components/common/seo";
import { UseCaseDetail } from "../../../src/pages/use-cases/_caseId";

const Init = (props) => (
  <>
    <SEOMeta {...props} />
    <UseCaseDetail {...props} />
  </>
);

export default Init;

