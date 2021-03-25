import React, { useState } from "reactn";
import styled from "styled-components";
import { BackButton } from "../../../../../../../../../../components/common";
import { LeagueDescription } from "../../../LeagueDescription";
import { useParams } from "react-router";
import get from "lodash/get";
import { UserImageProfile } from "../../../../../../../../../../components/users/UserImageProfile";
import { mediaQuery } from "../../../../../../../../../../styles/constants";

export const TeamDetails = (props) => {
  const { teamId } = useParams();
  const [team] = useState(
    get(props, "teams", []).find((team) => team.id === teamId)
  );

  return !team ? null : (
    <TeamDetailsCss>
      <BackButton />
      <br />
      <br />
      <div className="team-content">
        <LeagueDescription requirements={get(team, "description", "")} />
        <UserImageProfile
          size="superBig"
          url={team.teamImageUrlThumb}
          className={"img-team"}
        />
      </div>
    </TeamDetailsCss>
  );
};

const TeamDetailsCss = styled.div`
  padding: 10px;
  height: 100%;
  width: 100%;
  .team-content {
    display: flex;
    flex-direction: column-reverse;
    ${mediaQuery.afterTablet} {
      display: grid;
      grid-template-columns: 70% auto;
    }
  }
`;
