import React from "reactn";
import { SEOMeta } from "../../src/components/common/seo";
import { Navbar } from "../../src/components/Navbar";
import { Activities } from "../../src/pages/activities";

const ActivitiesContainer = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <Activities {...props} />
    </Navbar>
  </>
);

export default ActivitiesContainer;
