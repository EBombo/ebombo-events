import React from "reactn";
import { SEOMeta } from "../../src/components/common/seo";
import { Navbar } from "../../src/components/Navbar";
import { CorporateEvents } from "../../src/pages/corporate-events";

const CorporateEventsContainer = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <CorporateEvents {...props} />
    </Navbar>
  </>
);

export default CorporateEventsContainer;
