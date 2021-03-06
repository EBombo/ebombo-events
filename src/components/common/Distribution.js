import styled from "styled-components";
import { mediaQuery } from "../../constants";

export const Distribution3Styled = styled.div`
  ${(props) => (props.color ? `color:${props.color};` : "")};
  height: 100%;
  width: 100%;
  padding-bottom: ${(props) => (props.footerBar ? props.footerBar : "0px")};

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    height: 100%;
    width: 100%;
  }
`;

export const Distribution3CenterStyled = styled.div`
  ${(props) => (props.color ? `color:${props.color};` : "")};
  height: 100%;
  width: 100%;
  padding-bottom: ${(props) => (props.footerBar ? props.footerBar : "0px")};

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 0.5fr 1fr 0.5fr;
    height: 100%;
    width: 100%;
    padding: 0;
  }
`;

export const Distribution4Center = styled.div`
  ${(props) => (props.color ? `color:${props.color};` : "")};
  height: 100%;
  width: 100%;
  padding-bottom: ${(props) => (props.footerBar ? props.footerBar : "0px")};

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 0.5fr 0.5fr 0.5fr 0.5fr;
    height: 100%;
    width: 100%;
    padding: 0;
  }
`;

export const Distribution2LeftStyled = styled.div`
  ${(props) => (props.color ? `color:${props.color};` : "")};
  height: 100%;
  width: 100%;
  padding-bottom: ${(props) => (props.footerBar ? props.footerBar : "0px")};

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 2fr 1fr;
    height: 100%;
    width: 100%;
    padding: 0;
  }
`;

export const Distribution2RightStyled = styled.div`
  ${(props) => (props.color ? `color:${props.color};` : "")};
  height: 100%;
  width: 100%;
  padding-bottom: ${(props) => (props.footerBar ? props.footerBar : "0px")};

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 1fr 2fr;
    height: 100%;
    width: 100%;
    padding: 0;
  }
`;

export const Distribution2CenterStyled = styled.div`
  width: 100%;
  height: 100%;
  ${(props) => (props.color ? `color:${props.color};` : "")};
  padding-bottom: ${(props) => (props.footerBar ? props.footerBar : "0px")};

  ${(props) => (props.noResponsive ? "display: grid;grid-template-columns: 1fr 1fr;" : "")}

  ${mediaQuery.afterTablet} {
    padding: 0;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

export const DistributionCol = styled.div`
  padding: 10px 8px;
  overflow-y: hidden;
  text-align: ${(props) => props.align ?? "center"};
  background: ${(props) => (props.background ? props.background : "transparent")};
  ${(props) => (props.color ? `color:${props.color};` : "")};
  ${(props) => !isNaN(props.visible) && !props.visible && "display:none;"};

  ${mediaQuery.afterTablet} {
    overflow-y: auto;
    margin: 0;
  }

  margin: 0;
  height: 100%;
  width: 100%;
`;
