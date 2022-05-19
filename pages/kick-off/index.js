import React from "reactn";
import { KickOff } from "../../src/pages/kick-off";
import { SEOMeta } from "../../src/components/common/seo";
import { Navbar } from "../../src/components/Navbar";

const KickoffContainer = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <KickOff {...props} />
    </Navbar>
  </>
);

export default KickoffContainer;
