import React, {useEffect, useGlobal} from "reactn";
import {useHistory, useParams} from "react-router";
import get from "lodash/get";

export const Dispatcher = () => {
  const { influencer } = useParams();
  const history = useHistory();

  const [authUser] = useGlobal("user");
  const [, setInfluencer] = useGlobal("influencer");

  useEffect(() => {
    influencer && setInfluencer(influencer);
    history.push(
      get(authUser, "isAdmin", false) ? "/admin/leagues" : "/leagues"
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div />;
};
