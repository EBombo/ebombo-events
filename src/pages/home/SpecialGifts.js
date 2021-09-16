import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Tablet, mediaQuery } from "../../constants";
import { firestore } from "../../firebase";
import { Carousel } from "../../components/common/Carousel";
import { ButtonAnt } from "../../components/form";
import { Icon } from "../../components/common/Icons";
import { Image } from "../../components/common/Image";
import { ModalContainer } from "../../components/common/ModalContainer";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import EditSpecials from "./EditSpecials";
import { Divider } from "../../components/common/Divider";

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
          <EditSpecials
            setIsVisibleModal={setIsVisibleModal}
            isVisibleModal={isVisibleModal}
            currentField={currentField}
            currentElement={currentElement}
            {...props}
          />
        </ModalContainer>
      )}

      <Divider>
        <div className="title">Reconocimientos y Premiaciones</div>
      </Divider>
      <div className="description">
        ¡Deliciosas combinaciones de cervezas, tragos, piqueos, dulces y mucho
        más! Regalos personalizados para sus colaboradores. Nos encargamos del
        empaquetado, logística y envío en todo el Perú.
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
            <ButtonAnt
              variant="outlined"
              color="warning"
              onClick={() => {
                setCurrentField("specialGifts");
                setCurrentElement({
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
      <div className="btn-container">
        <ButtonAnt
          variant="contained"
          color="secondary"
          onClick={() => props.executeScroll("contact")}
        >
          ¡Cuéntanos que necesitas!
        </ButtonAnt>
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
