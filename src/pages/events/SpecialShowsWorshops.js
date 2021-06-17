import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Divider } from "antd";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import { ButtonBombo, Icon, Image, ModalContainer } from "../../components";
import { mediaQuery } from "../../styles/constants";
import { lazy, Suspense } from "react";
import { spinLoader, Tablet, Desktop } from "../../utils";
import { firestore } from "../../firebase";
import { Carousel } from "../../components";
import chunk from "lodash/chunk";

const EditSpecials = lazy(() => import("./EditSpecials"));

export const SpecialShowsWorshops = (props) => {
  const [authUser] = useGlobal("user");
  const [currentElement, setCurrentElement] = useState(null);
  const [currentField, setCurrentField] = useState(null);
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  const showContent = (show) => (
    <ShowContainer backgroundImage={show.imageUrl}>
      <div className="thumb">
        <div className="mask" />
      </div>
      <div className="details">
        <div className="name">{show.name}</div>
        <div className="description">{show.description}</div>
      </div>
      {get(authUser, "isAdmin") && (
        <div className="container-edit">
          <Icon
            className="icon-edit"
            type="edit"
            onClick={() => {
              setCurrentElement(show);
              setCurrentField("specialShows");
              setIsVisibleModal(true);
            }}
          />
          <Icon
            className="icon-delete"
            type="delete"
            onClick={() => {
              props.deleteElement(show, "specialShows");
            }}
          />
        </div>
      )}
    </ShowContainer>
  );

  const carouselContent = (arrShows) => (
    <div>{arrShows.map((show) => showContent(show))}</div>
  );

  return (
    <GuestsContainer>
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
              sizes={"250x300"}
              {...props}
            />
          </Suspense>
        </ModalContainer>
      )}
      <Divider>
        <div className="title">Shows y Talleres Ebombo</div>
      </Divider>
      <Desktop>
        <div className="wrapper">
          {defaultTo(get(props, "events.specialShows"), []).map((show) =>
            showContent(show)
          )}
        </div>
      </Desktop>
      <Tablet>
        <Carousel
          components={chunk(
            defaultTo(get(props, "events.specialShows"), []),
            2
          ).map((arrShows) => carouselContent(arrShows))}
        />
      </Tablet>
      {get(authUser, "isAdmin") && (
        <div className="btn-container">
          <ButtonBombo
            variant="outlined"
            color="action"
            onClick={() => {
              setCurrentField("specialShows");
              setCurrentElement({
                id: firestore.collection("events").doc().id,
              });
              setIsVisibleModal(true);
            }}
          >
            Añadir
          </ButtonBombo>
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

const ShowContainer = styled.div`
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
