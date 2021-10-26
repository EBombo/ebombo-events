import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import { ButtonAnt } from "../../components/form";
import { Image } from "../../components/common/Image";
import { ModalContainer } from "../../components/common/ModalContainer";
import { Icon } from "../../components/common/Icons";
import { firestore } from "../../firebase";
import { mediaQuery } from "../../constants";

const UseCase = (props) => {
    return (
        <UseCaseStyled {...props}>
            <div className="image-wrapper">
                <Image src={props.useCase.imageUrl}/>
            </div>
            <h3>{props.useCase.title}</h3>
            <p>{props.useCase.date}</p>
        </UseCaseStyled>
    );
};

const UseCaseStyled = styled.div`
    background: ${(props) => props.theme.basic.white};
    border-radius: 8px;
    max-width: 293px;

    .image-wrapper {
        margin: 9px 9px 18px 9px;
    }
    h3 {
        font-family: Lato, sans-serif;
        font-style: normal;
        font-weight: 800;
        font-size: 22px;
        line-height: 26px;
        letter-spacing: 0.03em;

        margin: 0px 22px 4px 27px;
        color: ${(props) => props.theme.basic.blackDarken};
    }
    p {
        font-family: Raleway;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 19px;
        letter-spacing: 0.03em;
        color: ${(props) => props.theme.basic.blackDarken};
    }
`;

export const UseCases = (props) => {
  const [authUser] = useGlobal("user");
  const [currentCompany, setCurrentCompany] = useState(null);
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  return (
    <UseCasesStyled {...props}>
      {isVisibleModal && get(authUser, "isAdmin") && (
        <ModalContainer
          footer={null}
          visible={isVisibleModal}
          onCancel={() => setIsVisibleModal(!isVisibleModal)}
        >
          {/* <EditCompany
            setIsVisibleModal={setIsVisibleModal}
            isVisibleModal={isVisibleModal}
            currentCompany={currentCompany}
            {...props}
          /> */}
        </ModalContainer>
      )}
      <div className="title">Eventos pasados</div>
      <div className="main-container">
        <div className="use-cases-container">
          {defaultTo(get(props, "useCases"), []).map(
            (useCase, index) => (
							<UseCase useCase={useCase}/>
            )
          )}
          {get(authUser, "isAdmin") && (
            <ButtonAnt
              variant="outlined"
              color="warning"
              onClick={() => {
                setCurrentCompany({
                  id: firestore.collection("settings/landing/use-cases").doc().id,
                });
                setIsVisibleModal(true);
              }}
            >
              Añadir
            </ButtonAnt>
          )}
        </div>
      </div>
    </UseCasesStyled>
  );
};

const UseCasesStyled = styled.section`
  width: 100%;
  background: ${(props) => props.theme.basic.gray};

  .title {
    font-family: Quicksand;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 19px;
    text-align: center;
    padding: 1rem;
  }

  .main-container {
    width: 100%;
    height: 100%;
    overflow: auto;

    ::-webkit-scrollbar {
      display: none;
    }

    .use-cases-container {
      display: inline-flex;
      align-items: center;
      margin: 1rem 0;
    }
  }

  ${mediaQuery.afterTablet} {
    .main-container {
      display: flex;
      justify-content: center;
    }
  }
`;

const CompaniesContent = styled.div`
  width: 140px;
  height: 70px;
  position: relative;
  margin-right: 2rem;
  background-image: url(${(props) => props.backgroundImage});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

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


