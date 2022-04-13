import React from "reactn";
import { SEOMeta } from "../../src/components/common/seo";
import { Navbar } from "../../src/components/Navbar";
import { TeamBuilding } from "../../src/pages/team-building";

const TeamBuildingContainer = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <TeamBuilding {...props} />
    </Navbar>
  </>
);

export default TeamBuildingContainer;
