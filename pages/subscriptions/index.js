import React from "reactn";
import { SEOMeta } from "../../src/components/common/seo";
import { Subscriptions } from "../../src/pages/subscriptions";

const Library = (props) => (
  <>
    <SEOMeta {...props} />
    <Subscriptions {...props} />
  </>
);

export default Library;
