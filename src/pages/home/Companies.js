import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import { ButtonBombo, Image, ModalContainer, Icon } from "../../components";
import { firestore } from "../../firebase";
import { lazy, Suspense } from "react";
import { spinLoader } from "../../utils";
import { mediaQuery } from "../../styles/constants";

const EditCompany = lazy(() => import("./EditCompany"));

export const Companies = (props) => {
  const [authUser] = useGlobal("user");
  const [currentCompany, setCurrentCompany] = useState(null);
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  return (
    <CompaniesContainer>
      {isVisibleModal && get(authUser, "isAdmin") && (
        <ModalContainer
          footer={null}
          visible={isVisibleModal}
          onCancel={() => setIsVisibleModal(!isVisibleModal)}
        >
          <Suspense fallback={spinLoader()}>
            <EditCompany
              setIsVisibleModal={setIsVisibleModal}
              isVisibleModal={isVisibleModal}
              currentCompany={currentCompany}
              {...props}
            />
          </Suspense>
        </ModalContainer>
      )}
      <div className="title">Han confiado en nosotros</div>
      <div className="main-container">
        <div className="companies-container">
          {defaultTo(get(props, "home.companies"), []).map(
            (company, index) => (
              <CompaniesContent
                backgroundImage={company.imageUrl}
                key={`${company.name}-${index}`}
              >
                {get(authUser, "isAdmin") && (
                  <div className="container-edit">
                    <Icon
                      className="icon"
                      type="edit"
                      onClick={() => {
                        setCurrentCompany(company);
                        setIsVisibleModal(true);
                      }}
                    />
                    <Icon
                      className="icon-delete"
                      type="delete"
                      onClick={() => {
                        props.deleteElement(company, "companies");
                      }}
                    />
                  </div>
                )}
              </CompaniesContent>
            )
          )}
          {get(authUser, "isAdmin") && (
            <ButtonBombo
              variant="outlined"
              color="action"
              onClick={() => {
                setCurrentCompany({
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
    </CompaniesContainer>
  );
};

const CompaniesContainer = styled.section`
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

    .companies-container {
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
 
`