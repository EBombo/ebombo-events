import React from "reactn";
import { SEOMeta } from "../../../../src/components/common/seo";
import { PrivateRoutes } from "../../../../src/routes/PrivateRoutes";
import { Event } from "../../../../src/pages/library/events/_eventId";
import { useRouter } from "next/router";
import { EventContainer } from "../../../../src/pages/events/eventId";
import { Navbar } from "../../../../src/components/Navbar";

const Game = (props) => {
  const router = useRouter();
  const { eventId, manageBy } = router.query;

  return (
    <PrivateRoutes>
      <SEOMeta {...props} />
      {manageBy === "ebombo" ? (
        <Navbar>
          <EventContainer {...props} />
        </Navbar>
      ) : (
        <Event {...props} />
      )}
    </PrivateRoutes>
  );
};

export default Game;
