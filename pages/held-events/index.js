import React from "reactn";
// TODO: It should export HeldEvents [as the route] from "../../src/pages/held-events" not useCases.
import { UseCases } from "../../src/pages/held-events";
import { SEOMeta } from "../../src/components/common/seo";

const Init = (props) => (
  <>
    <SEOMeta {...props} />
    {/*TODO: It should be called HeldEvents.*/}
    <UseCases {...props} />
  </>
);

export default Init;
