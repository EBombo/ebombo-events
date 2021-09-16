import React from "reactn";
import { Home } from "../src/pages/home";
import { SEOMeta } from "../src/components/common/seo";

const Init = (props) => (
  <>
    <SEOMeta {...props} />
    <Home {...props} />
  </>
);

export default Init;
