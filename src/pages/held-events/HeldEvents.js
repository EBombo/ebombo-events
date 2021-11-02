import React, { useGlobal, useState, useEffect } from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { Image } from "../../components/common/Image";
import { ModalContainer } from "../../components/common/ModalContainer";
import { mediaQuery } from "../../constants";
import { Desktop, Tablet } from "../../constants";
import { List } from "antd";
import { Icon } from "../../components/common/Icons";
import { useRouter } from "next/router";

const UseCase = (props) => {
  const router = useRouter();
  return (
      <UseCaseStyled
        {...props}
        onClick={() => {  router.push(`/held-events/${props.useCase.id}`) }}>
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
    padding: 9px 9px 27px 9px;
    cursor: pointer;

    .image-wrapper {
        margin-bottom: 18px;
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

export const UseCases = (props) => {
  const [authUser] = useGlobal("user");
  const [isVisibleModal, setIsVisibleModal] = useState(false);


  return (
    <UseCasesStyled {...props}>
      {isVisibleModal && get(authUser, "isAdmin") && (
        <ModalContainer
          footer={null}
          visible={isVisibleModal}
          onCancel={() => setIsVisibleModal(!isVisibleModal)}
        >
          {/* TODO add admin functionalities */}
          {/* <EditCompany
            setIsVisibleModal={setIsVisibleModal}
            isVisibleModal={isVisibleModal}
            currentCompany={currentCompany}
            {...props}
          /> */}
        </ModalContainer>
      )}
      <div className="title"><Icon className="back-icon" type="left" /> Eventos pasados</div>
      <div className="main-container">
        <div className="use-cases-container">
          <Desktop>
            <List
              grid={{ gutter: 36, column: 3 }}
              pagination={{
                pageSize: 9,
              }}
              dataSource={props.useCases}
              renderItem={item => (
                <List.Item>
                  <UseCase useCase={item} />
                </List.Item>
              )}
            />
          </Desktop>
          <Tablet>
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                pageSize: 3,
              }}
              dataSource={props.useCases}
              renderItem={item => (
                <List.Item>
                  <UseCase useCase={item} />
                </List.Item>
              )}
            />
          </Tablet>
          {/* 
          // TODO add admin feature
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
          )} */}
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

  .back-icon {
    border-radius: 50%;
    padding: 6px;
    background: ${(props) => props.theme.basic.primary};

    position: absolute;
    left: 0;
    bottom: 0;
    svg {
      font-size: 12px;
    }
    ${mediaQuery.afterTablet} {
      position: relative;
      margin-right: 1.5rem;
      vertical-align: bottom;
    }
  }
  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 26px;
    letter-spacing: 0.03em;
    max-width: 1200px;
    margin: 0 24px;
    position: relative;

    color: ${(props) => props.theme.basic.whiteLight};

    ${mediaQuery.afterTablet} {
      text-align: left;
      margin-bottom: 33px;
    margin: 0 auto;
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
      margin: 1rem 0 56px 0;
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

  .ant-list-item:last-child {
    border-bottom: none !important;
  }
  .ant-list-split .ant-list-item {
    border-bottom: none;
    margin-bottom: 24px;
    ${mediaQuery.afterTablet} {
      margin-bottom: 48px;
    }
  }


`;

