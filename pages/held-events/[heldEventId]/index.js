import React from "reactn";
import { SEOMeta } from "../../../src/components/common/seo";
//TODO: It should be called HeldEventDetails as parent folder.
import { UseCaseDetail } from "../../../src/pages/held-events/_heldEventId";

const Init = (props) => (
  <>
    <SEOMeta {...props} />
    {/*TODO: It should be called HeldEventDetails as parent folder.*/}
    <UseCaseDetail {...props} />
  </>
);

export default Init;
