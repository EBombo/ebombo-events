import React, { useGlobal, useState } from "reactn";
import { lazy, Suspense } from "react";
import styled from "styled-components";
import { mediaQuery } from "../../styles/constants";
import { config, firestore } from "../../firebase";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import { Image } from "../../components/common/Image";
import { spinLoader } from "../../utils";
import { Icon } from "../../components/common/Icons";
import { Anchor } from "../../components/common/Anchor";
import { ButtonBombo } from "../../components";
import { ModalContainer } from "../../components/common/ModalContainer";

const EditBusinessExamples = lazy(() => import("./EditBusinessExamples"));

export const BusinessExamples = (props) => {
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [currentExample, setCurrentExample] = useState(null);
  const [authUser] = useGlobal("user");

  return (
    <ExamplesSections>
      {isVisibleModal && get(authUser, "isAdmin") && (
        <ModalContainer
          footer={null}
          visible={isVisibleModal}
          onCancel={() => setIsVisibleModal(!isVisibleModal)}
        >
          <Suspense fallback={spinLoader()}>
            <EditBusinessExamples
              setIsVisibleModal={setIsVisibleModal}
              isVisibleModal={isVisibleModal}
              currentExample={currentExample}
              {...props}
            />
          </Suspense>
        </ModalContainer>
      )}
      <div className="main-container">
        <div className="title">Ejemplos para algunas empresas</div>
        <div className="business-examples">
          <div className="examples-container">
            {defaultTo(get(props, "events.businessExamples"), []).map(
              (example) => (
                <ExampleContent key={example.id}>
                  <div className="example-title">{example.title}</div>
                  <div className="description">
                    {example.description}

                    <Anchor className="video-content" href={example.link}>
                      <Image
                        src={`${config.storageUrl}/resources/b2bLanding/play.svg`}
                        width="70px"
                        height="70px"
                        borderRadius="50%"
                        margin="0 0 0.5rem 0"
                      />
                      Play
                    </Anchor>
                  </div>
                  {get(authUser, "isAdmin") && (
                    <div className="container-edit">
                      <Icon
                        className="icon"
                        type="edit"
                        onClick={() => {
                          setCurrentExample(example);
                          setIsVisibleModal(true);
                        }}
                      />
                      <Icon
                        className="icon-delete"
                        type="delete"
                        onClick={() => {
                          props.deleteElement(example, "businessExamples");
                        }}
                      />
                    </div>
                  )}
                </ExampleContent>
              )
            )}
            {get(authUser, "isAdmin") && (
              <ButtonBombo
                type="action"
                onClick={() => {
                  setCurrentExample({
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
      </div>
    </ExamplesSections>
  );
};

const ExampleContent = styled.div`
  width: 220px;
  height: 320px;
  border: 3px solid #1b3b72;
  margin: 1rem;
  position: relative;

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

  .example-title {
    height: 50px;
    background: linear-gradient(
      180deg,
      rgba(244, 70, 175, 0.32) 0%,
      rgba(255, 0, 153, 0.32) 0.01%,
      rgba(171, 7, 249, 0.32) 100%
    );
    border-bottom: 3px solid #1b3b72;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 0.5rem;
    font-weight: 500;
    font-size: 24px;
    line-height: 30px;
    color: ${(props) => props.theme.basic.white};
  }

  .description {
    padding: 0.5rem;
    height: 260px;
    color: ${(props) => props.theme.basic.white};
    font-weight: normal;
    font-size: 15px;
    line-height: 19px;
    position: relative;

    .video-content {
      position: absolute;
      padding: 0.5rem;
      border: 1px solid ${(props) => props.theme.basic.white};
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      left: 10px;
      right: 10px;
      bottom: 5px;

      font-weight: 500;
      font-size: 18px;
      line-height: 22px;
    }
  }
`;

const ExamplesSections = styled.div`
  width: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  background-image: url(${config.storageUrl + "/resources/b2bLanding/6.png"});
  padding: 1rem;

  ${mediaQuery.afterTablet} {
    padding: 2rem;
  }
  .main-container {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    text-align: center;
    .title {
      font-weight: bold;
      color: ${(props) => props.theme.basic.white};
      font-size: 15px;
      line-height: 19px;
      display: flex;
      align-items: center;
      ${mediaQuery.afterTablet} {
        font-size: 24px;
        line-height: 30px;
      }
    }

    .business-examples {
      max-width: 100%;
      overflow: auto;
      .examples-container {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 1rem 0;
      }
    }
  }
`;
