import React from "reactn";
import { SEOMeta } from "../../src/components/common/seo";
import { Navbar } from "../../src/components/Navbar";
import { HolidaysParties } from "../../src/pages/holidays-parties";

const HolidaysPartiesContainer = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <HolidaysParties {...props} />
    </Navbar>
  </>
);

export default HolidaysPartiesContainer;
