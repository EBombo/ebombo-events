import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Desktop, Tablet } from "../../styles/utils";
import { mediaQuery } from "../../styles/constants";
import { config, firestore } from "../../firebase";
import {
  ButtonBombo,
  Carousel,
  Image,
  Icon,
  ModalContainer,
} from "../../components";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import { lazy, Suspense } from "react";
import { spinLoader } from "../../utils";
import { Divider } from "antd";

const EditSpecials = lazy(() => import("./EditSpecials"));

export const SpecialGifts = (props) => {
  const [authUser] = useGlobal("user");
  const [currentElement, setCurrentElement] = useState(null);
  const [currentField, setCurrentField] = useState(null);
  const [isVisibleModal, setIsVisibleModal] = useState(false);

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

      <Divider>
        <div className="title">Reconocimientos y Premiaciones</div>
      </Divider>
      <div className="description">
        ¡Deliciosas combinaciones de cervezas, tragos, piqueos, dulces y mucho
        más! Regalos personalizados para sus colaboradores. Nos encargamos del
        empaquetado logística y envío en todo el Perú.
      </div>
      <div className="gifts">
        <div className="gifts-container">
          {defaultTo(get(props, "events.specialGifts"), []).map(
            (gift, index) => (
              <GiftContent backgroundImage={gift.imageUrl} key={index}>
                {get(authUser, "isAdmin") && (
                  <div className="container-edit">
                    <Icon
                      className="icon-edit"
                      type="edit"
                      onClick={() => {
                        setCurrentElement(gift);
                        setCurrentField("specialGifts");
                        setIsVisibleModal(true);
                      }}
                    />
                    <Icon
                      className="icon-delete"
                      type="delete"
                      onClick={() => {
                        props.deleteElement(gift, "specialGifts");
                      }}
                    />
                  </div>
                )}
              </GiftContent>
            )
          )}

          {get(authUser, "isAdmin") && (
            <ButtonBombo
              variant="outlined"
              color="action"
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
      </div>
      <div className="btn-container">
        <ButtonBombo
          variant="contained"
          color="secondary"
          onClick={() => props.executeScroll("contact")}
        >
          ¡Cuéntanos que necesitas!
        </ButtonBombo>
      </div>
    </SpecialsSection>
  );
};

const SpecialsSection = styled.section`
  width: 100%;
  padding: 1rem 0;
  background: ${(props) => props.theme.basic.white};

  .title {
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 25px;
    text-align: center;
    color: ${(props) => props.theme.basic.black};
  }

  .description {
    width: 100%;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 15px;
    text-align: center;
    padding: 1rem;
  }

  .gifts {
    max-width: 100%;
    overflow: auto;
    text-align: center;
    .gifts-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    ::-webkit-scrollbar {
      display: none;
    }
  }

  .btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
  }

  ${mediaQuery.afterTablet} {
    .title {
      font-size: 30px;
      line-height: 37px;
    }

    .description {
      font-size: 20px;
      line-height: 25px;
      max-width: 900px;
      margin: 0 auto;
    }
    .gifts {
      ::-webkit-scrollbar {
        display: block;
      }
    }
  }
`;

const GiftContent = styled.div`
  width: 200px;
  height: 140px;
  position: relative;
  margin-right: 1rem;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  ${mediaQuery.afterTablet} {
    width: 320px;
    height: 215px;
  }

  .container-edit {
    position: absolute;
    height: 15px;
    cursor: pointer;
    top: 0;
    right: 0;
    display: flex;

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
`;
