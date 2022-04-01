import React from "reactn";
import { SEOMeta } from "../../../src/components/common/seo";
import { Navbar } from "../../../src/components/Navbar";
import { EventContainer } from "../../../src/pages/events/eventId";

const EventPage = (props) => (
  <>
    <SEOMeta {...props} />
    <Navbar>
      <EventContainer {...props} />
    </Navbar>
  </>
);

export default EventPage;
