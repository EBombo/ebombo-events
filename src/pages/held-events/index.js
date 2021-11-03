import React, { useState } from "reactn";
import styled from "styled-components";
import {Footer} from "../../components/Footer";
import { HeldEvent } from "./HeldEvent";
import {Navbar} from "../home/Navbar";
import { heldEventsData } from "../../components/common/DataList";
import { mediaQuery, Desktop, Tablet, breakPoints } from "../../constants";
import { Icon } from "../../components/common/Icons";
import { Pagination } from "antd";

const USE_CASES_PER_PAGE_DESKTOP = 9;
const USE_CASES_PER_PAGE = 3;
const getCurrentHeldEvents = (currentPageNumber, length) => {
  const startIndex = (currentPageNumber - 1) * length
  const resultList = heldEventsData.slice(startIndex, startIndex + length)
  return resultList;
  return heldEventsData.slice(startIndex, startIndex + length);
}
export const HeldEvents = (props) => {
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const pageSize = window.innerWidth > breakPoints.tablet ? USE_CASES_PER_PAGE_DESKTOP : USE_CASES_PER_PAGE;
  // const [pageSize, setPageSize] = useState(USE_CASES_PER_PAGE);
  const [currentHeldEvents, setCurrentHeldEvents] = useState(getCurrentHeldEvents(heldEventsData, currentPageNumber, pageSize));


  const onPaginationChange = (pageNumber) => {
    setCurrentPageNumber(pageNumber);
    setCurrentHeldEvents(getCurrentHeldEvents(heldEventsData, pageNumber, pageSize));
  };

  return (
  <LandingContainer>
    <div className="landing-container">
      <Navbar />

      {/*TODO: It should be named HelpEvent [singular] not HeldEventsView.*/}
      {/*TODO: Consider making the map here.*/}
      {/*TODO: heldEvents.map(heldEvent=> <HeldEvents />)*/}
      <HeldEventsContainer>
        <div className="title">
          <Icon className="back-icon" type="left" /> Eventos pasados
        </div>
        <div className="main-container">
          <div className="held-events-container">
            { currentHeldEvents.map(heldEvent => <HeldEvent heldEvent={heldEvent}/>) }
            {/* <Desktop> */}
              {/*TODO: Do not use List from antd instead it use css grid. */}
              {/* <List
                grid={{ gutter: 36, column: 3 }}
                pagination={{
                  pageSize: 9,
                }}
                dataSource={props.useCases}
                renderItem={(item) => (
                  <List.Item>
                    <UseCase useCase={item} />
                  </List.Item>
                )}
              /> */}
            {/* </Desktop> */}
            {/* <Tablet> */}
              {/*TODO: Consider use mediaQuery.*/}
              {/* <List
                itemLayout="vertical"
                size="large"
                pagination={{
                  pageSize: 3,
                }}
                dataSource={props.useCases}
                renderItem={(item) => (
                  <List.Item>
                    <UseCase useCase={item} />
                  </List.Item>
                )}
              /> */}
            {/* </Tablet> */}
          </div>
          <div class="pagination-container">
            <Pagination
              defaultCurrent={1}
              total={heldEventsData.length}
              pageSize={pageSize}
              onChange={onPaginationChange}
            />
          </div>
        </div>
      </HeldEventsContainer>
      <Footer />
    </div>
  </LandingContainer>)
};

const LandingContainer = styled.div`
  width: 100%;

  .landing-container {
    position: relative;
    z-index: 1;
  }
`;

const HeldEventsContainer = styled.section`
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

    .held-events-container {
      margin: 1rem 0 56px 0;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 48px;
      align-items: center;
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
