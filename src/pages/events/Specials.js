import React, {useGlobal, useState} from "reactn";
import styled from "styled-components";
import {Desktop, Tablet} from "../../styles/utils";
import {mediaQuery} from "../../styles/constants";
import {config, firestore} from "../../firebase";
import {ButtonBombo, Carousel} from "../../components";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import {Image} from "../../components/common/Image";
import {Icon} from "../../components/common/Icons";
import {lazy, Suspense} from "react";
import {spinLoader} from "../../utils";
import {ModalContainer} from "../../components/common/ModalContainer";

const EditSpecials = lazy(() => import("./EditSpecials"));

export const Specials = (props) => {
  const [authUser] = useGlobal("user");
  const [currentElement, setCurrentElement] = useState(null);
  const [currentField, setCurrentField] = useState(null);
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  const carouselContent = (element, type) => (
    <ContentCarousel>
      <div className="content">
        <Desktop>
          <Image
            width="200px"
            height="200px"
            src={element.imageUrl}
            size="cover"
            margin="0"
            borderRadius="10px"
          />
        </Desktop>
        <Tablet>
          <Image
            width="150px"
            height="150px"
            src={element.imageUrl}
            size="cover"
            margin="0 auto"
            borderRadius="10px"
          />
        </Tablet>
        <div className="description">{element.description}</div>
        {get(authUser, "isAdmin") && (
          <div className="container-edit">
            <Icon
              className="icon-edit"
              type="edit"
              onClick={() => {
                setCurrentElement(element);
                if (type === "gift") {
                  setCurrentField("specialGifts");
                } else {
                  setCurrentField("specialGuests");
                }
                setIsVisibleModal(true);
              }}
            />
            <Icon
              className="icon-delete"
              type="delete"
              onClick={() => {
                deleteElement(type, element);
              }}
            />
          </div>
        )}
      </div>
    </ContentCarousel>
  );

  const deleteElement = async (type, element) => {
    if (type === "guest") {
      const newSpecialGuests = get(props, "events.specialGuests", []).filter(
        (guest) => guest.id !== element.id
      );
      return await firestore.doc(`landings/events`).update({
        specialGuests: newSpecialGuests,
      });
    }

    const newSpecialGifts = get(props, "events.specialGifts", []).filter(
      (guest) => guest.id !== element.id
    );
    await firestore.doc(`landings/events`).update({
      specialGifts: newSpecialGifts,
    });
  };

  return (
    <SpecialsSection>
      {isVisibleModal && get(authUser, "isAdmin") && (
        <ModalContainer
          footer={null}
          visible={isVisibleModal}
          onCancel={() => setIsVisibleModal(!isVisibleModal)}
        >
          <Suspense fallback={spinLoader()}>
            <EditSpecials
              setIsVisibleModal={setIsVisibleModal}
              isVisibleModal={isVisibleModal}
              currentField={currentField}
              currentElement={currentElement}
              {...props}
            />
          </Suspense>
        </ModalContainer>
      )}
      <div className="main-container">
        <div className="gifts-container">
          <div className="title">Regalos Especiales</div>
          <div className="carousel-container">
            <Carousel
              components={defaultTo(
                get(props, "events.specialGifts"),
                []
              ).map((gift) => carouselContent(gift, "gift"))}
            />
          </div>
          {get(authUser, "isAdmin") && (
            <ButtonBombo
              type="action"
              onClick={() => {
                setCurrentField("specialGifts");
                setCurrentElement({
                  id: firestore.collection("events").doc().id,
                });
                setIsVisibleModal(true);
              }}
            >
              Añadir
            </ButtonBombo>
          )}
        </div>
        <Desktop>
          <div className="divider">
            <Line />
          </div>
        </Desktop>
        <div className="guests-container">
          <div className="title">Invitados Especiales</div>
          <div className="carousel-container">
            <Carousel
              components={defaultTo(
                get(props, "events.specialGuests"),
                []
              ).map((guest) => carouselContent(guest, "guest"))}
            />
          </div>
          {get(authUser, "isAdmin") && (
            <ButtonBombo
              type="action"
              onClick={() => {
                setCurrentField("specialGuests");
                setCurrentElement({
                  id: firestore.collection("events").doc().id,
                });
                setIsVisibleModal(true);
              }}
            >
              Añadir
            </ButtonBombo>
          )}
        </div>
      </div>
    </SpecialsSection>
  );
};

const ContentCarousel = styled.div`
  max-width: 100%;
  .content {
    display: inline-flex;
    position: relative;
    .description {
      margin-left: 10px;
      font-weight: normal;
      font-size: 12px;
      line-height: 15px;
      max-width: 50%;
      color: ${(props) => props.theme.basic.white};
      ${mediaQuery.afterTablet} {
        font-size: 14px;
        line-height: 17px;
      }
    }
    .container-edit {
      position: absolute;
      height: 15px;
      cursor: pointer;
      bottom: -10px;
      right: 0;
      display: flex;
      svg {
        width: 15px;
        height: 15px;
        color: ${(props) => props.theme.basic.white};
      }
      .icon-delete {
        margin-left: 5px;
        svg {
          color: ${(props) => props.theme.basic.danger};
        }
      }
    }
  }
`;

const SpecialsSection = styled.section`
  width: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url(${config.storageUrl + "/resources/b2bLanding/5.png"});

  .gifts-container,
  .guests-container {
    .carousel-container {
      ${mediaQuery.afterTablet} {
        max-width: 80%;
        margin: 0 auto;
      }
    }
    .title {
      font-weight: bold;
      font-size: 15px;
      line-height: 19px;
      color: ${(props) => props.theme.basic.white};
      position: relative;
      padding: 0.5rem;
      ${mediaQuery.afterTablet} {
        text-align: center;
      }
      &:before {
        content: "";
        position: absolute;
        height: 1px;
        background: ${(props) => props.theme.basic.white};
        left: 0;
        right: 0;
        bottom: 0;
      }
      ${mediaQuery.afterTablet} {
        font-size: 24px;
        line-height: 30px;
        &:before {
          width: 60%;
          transform: translateX(30%);
        }
      }
    }
  }

  ${mediaQuery.afterTablet} {
    padding: 2rem;

    .main-container {
      display: grid;
      grid-template-columns: 48% 4% 48%;

      .divider {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
`;

const Line = styled.div`
  width: 1px;
  background: ${(props) => props.theme.basic.white};
  height: 80%;
`;
