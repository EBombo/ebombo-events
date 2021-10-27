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
import { Desktop, Tablet } from "../../constants";
import { Pagination } from "antd";

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
    //max-width: 293px;
    padding-bottom: 27px;

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
        font-family: Lato, sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 19px;
        letter-spacing: 0.03em;
        color: ${(props) => props.theme.basic.blackDarken};
        margin: 0px 22px 4px 27px;
    }
`;

const USE_CASES_PER_PAGE = 3;
const USE_CASES_PER_PAGE_DESKTOP = 9;
const getCurrentUseCases = (useCases, currentPageNumber, length) => {
  const startIndex = (currentPageNumber - 1) * length
  const resultList = useCases.slice(startIndex, startIndex + length)
  console.log("startIndex",startIndex, "startIndex + length", startIndex + length);
  return useCases.slice(startIndex, startIndex + length);
}

export const UseCases = (props) => {
  const [authUser] = useGlobal("user");
  const [currentCompany, setCurrentCompany] = useState(null);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [currentUseCases, setCurrentUseCases] = useState(getCurrentUseCases(props.useCases, currentPageNumber, USE_CASES_PER_PAGE));

  const onPaginationChange = (usesPerPageSize) => ((pageNumber) => {
    setCurrentPageNumber(pageNumber);
    setCurrentUseCases(getCurrentUseCases(props.useCases, pageNumber, usesPerPageSize));
  });

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
          {currentUseCases.map(
            (useCase, index) => (
							<UseCase key={index} useCase={useCase}/>
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

          {/*
            * TODO Refactor to simplify usage of pageSize
          */}
          <Desktop>
            <Pagination
              defaultCurrent={1}
              total={Math.ceil(props.useCases.length)}
              pageSize={USE_CASES_PER_PAGE_DESKTOP}
              onChange={onPaginationChange(USE_CASES_PER_PAGE_DESKTOP)}
            />
          </Desktop>
          <Tablet>
            <Pagination
              defaultCurrent={1}
              total={Math.ceil(props.useCases.length)}
              pageSize={USE_CASES_PER_PAGE}
              onChange={onPaginationChange(USE_CASES_PER_PAGE)}
            />
          </Tablet>
        </div>
      </div>
    </UseCasesStyled>
  );
};

const UseCasesStyled = styled.section`
  width: 100%;
  background: ${(props) => props.theme.basic.gray};
  margin-bottom: 84px;

  & > *:first-child {
    margin-top: 66px;
  }

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 26px;
    letter-spacing: 0.03em;

    color: ${(props) => props.theme.basic.whiteLight};
    text-align: center;
    // #FAFAFA
  }

  .main-container {
    width: 100%;
    height: 100%;
    overflow: auto;

    ::-webkit-scrollbar {
      display: none;
    }

    .use-cases-container {
      display: flex;
      flex-direction: column;
      gap: 48px;
      align-items: center;
      margin: 1rem 0;
    }
  }

  .ant-pagination-prev,
  .ant-pagination-next {
    button {
      border: 0;
      border-radius: 50%;
      color: white;
      background: ${(props) => props.theme.basic.primary};
    }
  }
  .ant-pagination-item {
    background: transparent;
    border: 0;
    font-size: 18px;
    &.ant-pagination-item-active a {
      color: white;
      font-weight: bold;
    }
    a {
      color: white;
    }
  }
  .ant-pagination-item-active {
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


