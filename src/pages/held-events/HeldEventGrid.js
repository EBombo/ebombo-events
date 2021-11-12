import React, { useState } from "reactn";
import styled from "styled-components";
import chunk from "lodash/chunk";
import { Pagination } from "antd";
import { HeldEvent } from "./HeldEvent";
import { mediaQuery } from "../../constants";

export const HeldEventGrid = (props) => {
  const heldEventChunks = chunk(props.heldEvents, props.pageSize);
  const [currentHeldEvents, setCurrentHeldEvents] = useState(heldEventChunks[0]);

  const onPaginationChange = (pageNumber) => setCurrentHeldEvents(heldEventChunks[pageNumber - 1]);

  return (
    <HeldEventsGridContainer>
      <div className="held-events-container">
        {currentHeldEvents.map((heldEvent) => (
          <HeldEvent heldEvent={heldEvent} key={heldEvent.id} />
        ))}
      </div>
      <div className="pagination-container">
        <Pagination
          defaultCurrent={1}
          total={props.heldEvents.length}
          pageSize={props.pageSize}
          onChange={onPaginationChange}
        />
      </div>
    </HeldEventsGridContainer>
  );
};

const HeldEventsGridContainer = styled.div`
  .held-events-container {
    margin: 1rem 2.5rem 56px 2.5rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 48px;
    align-items: center;
    ${mediaQuery.afterTablet} {
      grid-template-columns: repeat(3, 1fr);
      margin: 1rem 0 56px 0;
    }
  }
  .pagination-container {
    text-align: center;
    ${mediaQuery.afterTablet} {
      text-align: right;
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
