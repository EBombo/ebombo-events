import React, {useGlobal} from "reactn";
import styled from "styled-components";
import defaultTo from "lodash/defaultTo";
import {mediaQuery} from "../styles/constants";

export const Characteristics = (props) => {
  const [characteristics] = useGlobal("characteristics");

  return (
    <Container>
      {defaultTo(characteristics, []).map((characteristic, index) => (
        <div className="characteristic-container" key={index}>
          <div className="title">{characteristic.title}</div>
          <div className="description">{characteristic.content}</div>
        </div>
      ))}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 100%;
  display: -webkit-inline-box;
  overflow-x: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  .characteristic-container {
    width: 245px;
    background: transparent;
    color: ${(props) => props.theme.basic.white};
    position: relative;
    height: auto;
    padding: 10px 10px;
    box-sizing: border-box;
    .title {
      font-weight: 600;
      font-size: 11px;
      line-height: 14px;
      margin-bottom: 10px;
      color: ${(props) => props.theme.basic.whiteDarken};
      ${mediaQuery.afterTablet} {
        font-size: 13px;
      }
    }
    .description {
      margin: 0.5rem 0;
      font-size: 10px;
      color: ${(props) => props.theme.basic.grayDark};
      ${mediaQuery.afterTablet} {
        font-size: 12px;
      }
    }
  }
`;
