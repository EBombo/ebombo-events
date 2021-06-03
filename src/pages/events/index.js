import React, { useEffect, useState, useRef } from "reactn";
import styled, { ThemeProvider } from "styled-components";
import { HeaderLanding } from "./HeaderLanding";
import { Services } from "./Services";
import { firestore } from "../../firebase";
import { HeldEvents } from "./HeldEvents";
import { Comments } from "./Comments";
import { Contact } from "./Contact";
import { Companies } from "./Companies";
import get from "lodash/get";
import { spinLoader } from "../../utils";
import { SpecialGifts } from "./SpecialGifts";
import { SpecialGuests } from "./SpecialGuests";
import { Games } from "./Games";
import { Footer } from "./Footer";
import { SpecialWorkshops } from "./SpecialWorkshops";
import { SpecialShows } from "./SpecialShows";

export default (props) => {
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);

  const servicesRef = useRef(null);
  const gamesRef = useRef(null);
  const eventsRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    fetchLandingEvents();
  }, []);

  const fetchLandingEvents = () =>
    firestore
      .collection("landings")
      .doc("events")
      .onSnapshot((snapshot) => {
        setEvents(snapshot.data());
        setLoading(false);
      });

  const deleteElement = async (element, field) => {
    const newElements = get(events, `${field}`, []).filter(
      (ele) => ele.id !== element.id
    );

    await firestore.doc(`landings/events`).update({
      [field]: newElements,
    });
  };

  const executeScroll = (section) =>
    section === "services"
      ? servicesRef.current.scrollIntoView()
      : section === "games"
      ? gamesRef.current.scrollIntoView()
      : section === "events"
      ? eventsRef.current.scrollIntoView()
      : contactRef.current.scrollIntoView();

  if (loading) return spinLoader();

  return (
    <LandingContainer>
      <div className="landing-container">
        <HeaderLanding executeScroll={executeScroll} />
        <Companies events={events} deleteElement={deleteElement} />
        <Services refProp={servicesRef} />
        <Games
          refProp={gamesRef}
          events={events}
          deleteElement={deleteElement}
        />
        <SpecialGuests deleteElement={deleteElement} events={events} />
        <SpecialGifts
          deleteElement={deleteElement}
          events={events}
          executeScroll={executeScroll}
        />
        <SpecialShows deleteElement={deleteElement} events={events} />
        <SpecialWorkshops deleteElement={deleteElement} events={events} />
        <HeldEvents
          refProp={eventsRef}
          events={events}
          deleteElement={deleteElement}
        />
        <Comments events={events} deleteElement={deleteElement} />
        <Contact refProp={contactRef} />
        <Footer />
      </div>
    </LandingContainer>
  );
};

const LandingContainer = styled.div`
  width: 100%;

  .landing-container {
    position: relative;
    z-index: 1;
  }
`;

const FooterSection = styled.section`
  width: 100%;
`;
