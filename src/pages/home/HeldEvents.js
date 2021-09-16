import React, { useGlobal, useState } from "reactn";
import { lazy, Suspense } from "react";
import styled from "styled-components";
import get from "lodash/get";
import defaultTo from "lodash/defaultTo";
import { mediaQuery } from "../../constants";
import { firestore } from "../../firebase";
import { Divider } from "antd";
import { spinLoader } from "../../components/common/loader";
import { ModalContainer } from "../../components/common/ModalContainer";
import { Icon } from "../../components/common/Icons";
import { ButtonAnt } from "../../components/form";

const EditHeldEvent = lazy(() => import("./EditHeldEvent"));

export const HeldEvents = (props) => {
  const [authUser] = useGlobal("user");
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  return (
    <EventsContainer ref={props.refProp}>
      {isVisibleModal && get(authUser, "isAdmin") && (
        <ModalContainer
          footer={null}
          visible={isVisibleModal}
          onCancel={() => setIsVisibleModal(!isVisibleModal)}
        >
          <Suspense fallback={spinLoader()}>
            <EditHeldEvent
              setIsVisibleModal={setIsVisibleModal}
              isVisibleModal={isVisibleModal}
              currentEvent={currentEvent}
              {...props}
            />
          </Suspense>
        </ModalContainer>
      )}
      <Divider>
        <div className="title">Algunos eventos realizados</div>
      </Divider>
      <div className="held-events">
        <div className="events-container">
          {defaultTo(get(props, "events.heldEvents"), []).map((event) => (
            <EventContent
              backgroundImage={event.backgroundImageUrl}
              key={event.id}
            >
              <div className="the-card">
                <div className="front">
                  <div className="cover" />
                </div>
                <div className="back">
                  <div className="description">{event.description}</div>
                </div>
              </div>
              {get(authUser, "isAdmin") && (
                <div className="container-edit">
                  <Icon
                    className="icon"
                    type="edit"
                    onClick={() => {
                      setCurrentEvent(event);
                      setIsVisibleModal(true);
                    }}
                  />
                  <Icon
                    className="icon-delete"
                    type="delete"
                    onClick={() => {
                      props.deleteElement(event, "heldEvents");
                    }}
                  />
                </div>
              )}
            </EventContent>
          ))}
          {get(authUser, "isAdmin") && (
            <ButtonAnt
              variant="outlined"
              color="warning"
              onClick={() => {
                setCurrentEvent({
                  id: firestore.collection("events").doc().id,
                });
                setIsVisibleModal(true);
              }}
            >
              Añadir
            </ButtonAnt>
          )}
        </div>
      </div>
    </EventsContainer>
  );
};

const EventsContainer = styled.section`
  width: 100%;
  margin: 0 auto;
  background: ${(props) => props.theme.basic.white};
  position: relative;
  padding: 1rem 0;

  .title {
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 25px;
    text-align: center;
    color: ${(props) => props.theme.basic.black};
  }

  .held-events {
    max-width: 100%;
    overflow: auto;
    text-align: center;

    ::-webkit-scrollbar {
      display: none;
    }

    .events-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 1rem 0;
    }
  }

  ${mediaQuery.afterTablet} {
    padding: 2rem 0;
    .title {
      font-size: 30px;
      line-height: 37px;
    }

    .held-events {
      ::-webkit-scrollbar {
        height: 4px;
      }
    }
  }
`;

const EventContent = styled.div`
  position: relative;
  width: 230px;
  height: 340px;
  margin: 0;

  ${mediaQuery.afterTablet} {
    width: 260px;
    height: 380px;
  }

  .the-card {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: all 0.5s ease;

    .cover {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      background-repeat: no-repeat;
      background-position: center;
      background: rgba(0, 0, 0, 0.5);
      z-index: 3;
    }

    .front {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      background-image: url(${(props) => props.backgroundImage});
      color: ${(props) => props.theme.basic.white};
      box-shadow: 0px 0px 13px 3px rgba(255, 255, 255, 0.25);
      z-index: 2;
    }

    .back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      background: #1d2447;
      color: ${(props) => props.theme.basic.white};
      transform: rotateY(180deg);
      padding: 0.5rem;

      .description {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-weight: normal;
        font-size: 15px;
        line-height: 19px;
      }
    }
  }

  .the-card:hover {
    transform: rotateY(180deg);
  }

  .container-edit {
    position: absolute;
    width: auto;
    height: 25px;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    display: flex;
    align-items: center;

    svg {
      width: 20px;
      height: 20px;
      color: ${(props) => props.theme.basic.action};
      margin: 0 1rem;
    }

    .icon-delete {
      svg {
        color: ${(props) => props.theme.basic.danger};
      }
    }
  }
`;
