import styled from "styled-components";
import {mediaQuery} from "../../styles/constants";

export const Tip = styled.div`
  width: 245px;
  background: transparent;
  color: ${(props) => props.theme.basic.white};
  position: relative;
  height: auto;
  padding: 10px 10px;
  box-sizing: border-box;

  .levels {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    div {
      font-size: 10px !important;
      margin: 2px !important;
      padding: 1px 5px !important;
    }
  }
`;

export const TipTittle = styled.div`
  font-weight: 600;
  font-size: 11px;
  line-height: 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.basic.whiteDarken};
  ${mediaQuery.afterTablet} {
    font-size: 13px;
  }
  img {
    margin-left: 10px;
  }
`;

export const TipDescription = styled.div`
  margin: 0.5rem 0;
  font-size: 10px;
  ${mediaQuery.afterTablet} {
    font-size: 12px;
  }
  color: ${(props) => props.theme.basic.grayDark};
`;
