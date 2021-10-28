import React, { useGlobal, useState, useEffect } from "reactn";
import styled from "styled-components";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import { ButtonAnt } from "../../components/form";
import { Image } from "../../components/common/Image";
import { ModalContainer } from "../../components/common/ModalContainer";
import { Icon } from "../../components/common/Icons";
import { useWindowSize } from "../../hooks";
import { firestore } from "../../firebase";
import { mediaQuery, breakPoints } from "../../constants";
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
  return resultList;
  return useCases.slice(startIndex, startIndex + length);
}

export const UseCases = (props) => {
  const [authUser] = useGlobal("user");
  const [currentCompany, setCurrentCompany] = useState(null);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(USE_CASES_PER_PAGE);
  const [currentUseCases, setCurrentUseCases] = useState(getCurrentUseCases(props.useCases, currentPageNumber, pageSize));
  const windowSize = useWindowSize();

  useEffect(() => {
    console.log("windowSize, desktop", windowSize, breakPoints.desktop);
    console.log("windowSize > breakPoints.desktop", windowSize > breakPoints.desktop);
    if (windowSize > breakPoints.desktop) {
      setPageSize(USE_CASES_PER_PAGE_DESKTOP);
    } else {
      setPageSize(USE_CASES_PER_PAGE);
    }
  }, [windowSize]);

  useEffect(() => {
    setCurrentUseCases(getCurrentUseCases(props.useCases, currentPageNumber, pageSize));
  }, [pageSize]);

  const onPaginationChange = (pageNumber) => {
    setCurrentPageNumber(pageNumber);
    setCurrentUseCases(getCurrentUseCases(props.useCases, pageNumber, pageSize));
  };

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
        </div>
        <div class="pagination-container">
          <Pagination
            defaultCurrent={1}
            total={Math.ceil(props.useCases.length)}
            pageSize={pageSize}
            onChange={onPaginationChange}
          />
        </div>
      </div>
    </UseCasesStyled>
  );
};

const UseCasesStyled = styled.section`
  width: 100%;
  background: ${(props) => props.theme.basic.secondary};
  padding-bottom: 84px;
  padding-top: 66px;

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 26px;
    letter-spacing: 0.03em;
    max-width: 1200px;
    margin: 0 auto;

    color: ${(props) => props.theme.basic.whiteLight};
    text-align: center;

    ${mediaQuery.afterDesktop} {
      text-align: left;
      margin-bottom: 33px;
    }
  }

  .main-container {
    width: 100%;
    height: 100%;
    overflow: auto;
    max-width: 1200px;
    margin: 0 auto;

    ::-webkit-scrollbar {
      display: none;
    }

    .use-cases-container {
      display: flex;
      flex-direction: column;
      gap: 48px;
      align-items: center;
      margin: 1rem 0 56px 0;

      ${mediaQuery.afterDesktop} {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
      }
    }
    .pagination-container {
      text-align: center;
      ${mediaQuery.afterTablet} {
        text-align: right;
      }
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


