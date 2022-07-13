import React from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Desktop, mediaQuery, Tablet } from "../../constants";
import { Image } from "../../components/common/Image";
import { heldEventsData } from "../../components/common/DataList";
import { Carousel } from "../../components/common/Carousel";
import { config } from "../../firebase";

export const HeldEvents = (props) => {
  const router = useRouter();

  const carouselContent = (event, index) => (
    <EventContent
      key={index}
      onClick={(e) => {
        e.preventDefault();
        router.push(`/held-events/${event.id}`);
      }}
    >
      <Image src={event.imageUrl} height="162px" width="100%" borderRadius="8px 8px 0 0" margin="0" size="cover" />

      <div className="bottom-section">
        <div className="title">{event.title}</div>
        <div className="date">{event.date}</div>
      </div>
    </EventContent>
  );

  return (
    <EventsContainer ref={props.refProp}>
      <div className="title">Échale un vistazo a los eventos que hemos organizado</div>

      <div className="video-container">
        <video src={`${config.storageUrl}/resources/event-video.mp4`} />
      </div>

      <Tablet>
        <Carousel components={heldEventsData.slice(0, 3).map((event, index) => carouselContent(event, index))} />
      </Tablet>

      <Desktop>
        <div className="held-events">
          {heldEventsData.slice(0, 3).map((event, index) => carouselContent(event, index))}
        </div>
      </Desktop>
    </EventsContainer>
  );
};

const EventsContainer = styled.section`
  width: 100%;
  padding: 1rem;
  background: ${(props) => props.theme.basic.blackDarken};

  .video-container {
    width: 100%;
    height: 295px;
    margin: 2rem 0;

    video {
      object-fit: contain;
      width: 100% !important;
      height: 100% !important;
    }
  }

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 26px;
    text-align: center;
    letter-spacing: 0.03em;
    margin: 1rem 0;
    color: ${(props) => props.theme.basic.whiteLight};
  }

  .held-events {
    display: flex;
    align-items: center;
    overflow: auto;
    gap: 1rem;
  }

  ${mediaQuery.afterTablet} {
    padding: 3rem 2rem;

    .title {
      font-size: 34px;
      line-height: 41px;
      margin: 2rem 0;
    }

    .held-events {
      display: flex;
      align-items: center;
      justify-content: space-evenly;

      .event {
        width: 33%;
      }
    }

    .video-container {
      height: 395px;
    }
  }
`;

const EventContent = styled.div`
  width: 100%;
  height: 295px;
  max-width: 330px;
  background: ${(props) => props.theme.basic.whiteLight};
  border-radius: 8px;
  margin: 0 auto;
  cursor: pointer;

  .bottom-section {
    padding: 0.5rem;
    position: relative;
    height: 133px;
    border-radius: 0 0 8px 8px;

    .title {
      font-family: Lato;
      font-style: normal;
      font-weight: 800;
      font-size: 24px;
      line-height: 29px;
      letter-spacing: 0.03em;
      color: ${(props) => props.theme.basic.blackDarken};
    }

    .date {
      position: absolute;
      left: 0.5rem;
      bottom: 10px;
      font-family: Lato;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 22px;
      letter-spacing: 0.03em;
      color: ${(props) => props.theme.basic.blackDarken};
    }
  }
`;
