import React, { useEffect, useGlobal, useState } from "reactn";
import { HeaderLanding } from "./HeaderLanding";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Products } from "./Products";
import { EventsInformation } from "./EventsInformation";
import { EbomboStyle } from "./EbomboStyled";
import { Options } from "./Options";
import { Companies } from "./Companies";
import { EbomboMessage } from "../../components/EbomboMessage";
import { Comments } from "./Comments";
import { ModalNewEvent } from "../library/events/ModalNewEvent";

export const Home = (props) => {
  const router = useRouter();

  const [authUser] = useGlobal("user");

  const [isVisibleModalEvents, setIsVisibleModalEvents] = useState(false);

  useEffect(() => {
    router.prefetch("/library");
    router.prefetch("/library/events");
    router.prefetch("/events/[eventId]");
  }, []);

  useEffect(() => {
    if (!authUser) return;

    router.push("/");
  }, [authUser]);

  const createEvent = () => {
    if (authUser) return router.push("/library/events");

    return router.push("/events/new");

    // TODO: Allow creating event without account and managed by user.
    //setIsVisibleModalEvents((prev) => !prev);
  };

  return (
    <LandingContainer>
      {isVisibleModalEvents && (
        <ModalNewEvent
          {...props}
          hiddeMySelfOption
          isVisibleModalEvents={isVisibleModalEvents}
          setIsVisibleModalEvents={setIsVisibleModalEvents}
        />
      )}

      <HeaderLanding createEvent={createEvent} />

      <Products createEvent={createEvent} />

      <EventsInformation {...props} />

      <EbomboStyle {...props} />

      <Options {...props} createEvent={createEvent} />

      <Companies {...props} />

      <Comments {...props} />

      <EbomboMessage {...props} />
    </LandingContainer>
  );
};

const LandingContainer = styled.div`
  width: 100%;
  max-width: 100vw;
  font-family: Lato;
`;
