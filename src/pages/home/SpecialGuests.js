import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Divider } from "../../components/common/Divider";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import { ButtonAnt } from "../../components/form";
import { Carousel } from "../../components/common/Carousel";
import { ModalContainer } from "../../components/common/ModalContainer";
import { Icon } from "../../components/common/Icons";
import { mediaQuery } from "../../constants";
import { Desktop, Tablet } from "../../constants";
import { firestore } from "../../firebase";
import chunk from "lodash/chunk";
import EditSpecials from "./EditSpecials";

export const SpecialGuests = (props) => {
  const [authUser] = useGlobal("user");
  const [currentElement, setCurrentElement] = useState(null);
  const [currentField, setCurrentField] = useState(null);
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  const guestContent = (guest) => (
    <GuestContainer backgroundImage={guest.imageUrl} key={guest.id}>
      <div className="thumb">
        <div className="mask" />
      </div>
      <div className="details">
        <div className="name">{guest.name}</div>
        <div className="description">{guest.description}</div>
      </div>
      {get(authUser, "isAdmin") && (
        <div className="container-edit">
          <Icon
            className="icon-edit"
            type="edit"
            onClick={() => {
              setCurrentElement(guest);
              setCurrentField("specialGuests");
              setIsVisibleModal(true);
            }}
          />
          <Icon
            className="icon-delete"
            type="delete"
            onClick={() => {
              props.deleteElement(guest, "specialGuests");
            }}
          />
        </div>
      )}
    </GuestContainer>
  );

  const carouselContent = (arrGuests) => (
    <div>{arrGuests.map((guest) => guestContent(guest))}</div>
  );

  return (
    <GuestsContainer>
      {isVisibleModal && get(authUser, "isAdmin") && (
        <ModalContainer
          footer={null}
          visible={isVisibleModal}
          onCancel={() => setIsVisibleModal(!isVisibleModal)}
        >
          <EditSpecials
            setIsVisibleModal={setIsVisibleModal}
            isVisibleModal={isVisibleModal}
            currentField={currentField}
            currentElement={currentElement}
            sizes={"250x300"}
            {...props}
          />
        </ModalContainer>
      )}
      <Divider>
        <div className="title">Time to Talk</div>
      </Divider>
      <div className="subtitle">Dínos a quién necesitas y lo trameos :)</div>
      <Desktop>
        <div className="wrapper">
          {defaultTo(get(props, "events.specialGuests"), []).map((guest) =>
            guestContent(guest)
          )}
        </div>
      </Desktop>
      <Tablet>
        <Carousel
          components={chunk(
            defaultTo(get(props, "home.specialGuests"), []),
            2
          ).map((arrGuests) => carouselContent(arrGuests))}
        />
      </Tablet>
      {get(authUser, "isAdmin") && (
        <div className="btn-container">
          <ButtonAnt
            variant="outlined"
            color="warning"
            onClick={() => {
              setCurrentField("specialGuests");
              setCurrentElement({
                id: firestore.collection("events").doc().id,
              });
              setIsVisibleModal(true);
            }}
          >
            Añadir
          </ButtonAnt>
        </div>
      )}
    </GuestsContainer>
  );
};

const GuestsContainer = styled.div`
  width: 100%;
  background: ${(props) => props.theme.basic.white};
  padding: 1rem 0;

  .btn-container {
    margin: 1rem auto;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .title {
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 25px;
    text-align: center;
    color: ${(props) => props.theme.basic.black};
  }

  .subtitle {
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 19px;
    text-align: center;
    margin-bottom: 1rem;
  }

  .wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  ${mediaQuery.afterTablet} {
    .title {
      font-size: 30px;
      line-height: 37px;
    }

    .subtitle {
      font-size: 20px;
      line-height: 25px;
    }
  }
`;

const GuestContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 350px;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  .thumb {
    overflow: hidden;

    img {
      display: block;
      width: 100%;
      height: 100%;
    }

    .mask {
      background: rgba(75, 191, 135, 0.67);
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      height: 100%;
      width: 100%;
      transition: all 0.3s ease-in-out;
    }
  }

  .details {
    color: ${(props) => props.theme.basic.white};
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .name {
      text-align: center;
      font-style: normal;
      font-weight: bold;
      font-size: 40px;
      line-height: 50px;
    }

    .description {
      padding: 0.5rem;
      font-style: normal;
      font-weight: normal;
      font-size: 17px;
      line-height: 21px;
      text-align: center;
      opacity: 0;
    }
  }

  &:hover {
    .mask {
      opacity: 1;
    }

    .description {
      opacity: 1;
    }
  }

  .container-edit {
    position: absolute;
    height: 15px;
    cursor: pointer;
    top: 0;
    right: 0;
    display: flex;
    z-index: 3;

    svg {
      width: 15px;
      height: 15px;
      color: ${(props) => props.theme.basic.action};
    }

    .icon-delete {
      margin-left: 5px;

      svg {
        color: ${(props) => props.theme.basic.danger};
      }
    }
  }

  ${mediaQuery.afterTablet} {
    height: 300px;
  }
`;
