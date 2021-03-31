import React, {useGlobal, useState} from "reactn";
import {lazy, Suspense} from "react";
import styled from "styled-components";
import get from "lodash/get";
import defaultTo from "lodash/defaultTo";
import {mediaQuery} from "../../styles/constants";
import {config, firestore} from "../../firebase";
import {Icon} from "../../components/common/Icons";
import {spinLoader} from "../../utils";
import {ButtonBombo} from "../../components";
import {ModalContainer} from "../../components/common/ModalContainer";

const EditHeldEvent = lazy(() => import("./EditHeldEvent"));

export const HeldEvents = (props) => {
    const [authUser] = useGlobal("user");
    const [currentEvent, setCurrentEvent] = useState(null);
    const [isVisibleModal, setIsVisibleModal] = useState(false);

    return <EventsContainer id="events">
        {isVisibleModal && get(authUser, "isAdmin") && <ModalContainer
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
        </ModalContainer>}
        <div className="main-container">
            <div className="title">EVENTOS REALIZADOS</div>
            <div className="held-events">
                <div className="events-container">
                    {defaultTo(get(props, "events.heldEvents"), []).map((event) => <EventContent
                        backgroundImage={event.backgroundImageUrl}
                        key={event.id}
                    >
                        <div className="the-card">
                            <div className="front"/>
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
                    </EventContent>)}
                    {get(authUser, "isAdmin") && <ButtonBombo
                        type="action"
                        onClick={() => {
                            setCurrentEvent({
                                id: firestore.collection("events").doc().id,
                            });
                            setIsVisibleModal(true);
                        }}
                    >
                        Añadir
                    </ButtonBombo>}
                </div>
            </div>
        </div>
    </EventsContainer>;
};

const EventsContainer = styled.section`
  width: 100%;
  padding: 1rem;
  margin: 0 auto;
  background: transparent;

  .main-container {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;

    .title {
      font-weight: bold;
      font-size: 15px;
      line-height: 19px;
      text-align: center;
      color: ${(props) => props.theme.basic.white};
      margin-bottom: 1rem;
    }

    ${mediaQuery.afterTablet} {
      .title {
        font-size: 33px;
        line-height: 41px;
      }
    }

    .held-events {
      max-width: 100%;
      overflow: auto;
      text-align: center;

      .events-container {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 1rem 0;
      }
    }
  }

  ${mediaQuery.afterTablet} {
    padding: 2rem;
  }
`;

const EventContent = styled.div`
  position: relative;
  width: 161px;
  height: 288px;
  border-radius: 13px;
  margin: 0 1rem;
  box-shadow: 0px 0px 13px 3px rgba(255, 255, 255, 0.25);

  ${mediaQuery.afterTablet} {
    width: 250px;
    height: 450px;
  }

  .the-card {
    position: absolute;
    border-radius: 13px;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: all 0.5s ease;

    .front {
      position: absolute;
      border-radius: 13px;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      background-image: url(${(props) => props.backgroundImage});
      color: ${(props) => props.theme.basic.white};
      box-shadow: 0px 0px 13px 3px rgba(255, 255, 255, 0.25);
    }

    .back {
      position: absolute;
      border-radius: 13px;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      background: rgba(1, 19, 53, 0.96);
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
    width: 25px;
    height: 25px;
    cursor: pointer;
    top: 0;
    right: -11px;

    svg {
      width: 20px;
      height: 20px;
      color: ${(props) => props.theme.basic.white};
    }

    .icon-delete {
      margin-top: 5px;

      svg {
        color: ${(props) => props.theme.basic.danger};
      }
    }
  }
`;
