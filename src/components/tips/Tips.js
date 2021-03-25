import React from "react";
import styled from "styled-components";
import {useLocation} from "react-router";
import includes from "lodash/includes";
import {LevelYourOpponent} from "./LevelYourOpponent";
import {Carousel} from "../index";
import {TipPaymentsDeposits} from "./TipPaymentsDeposits";
import {TipEvidence} from "./TipEvidence";
import {TipMoreInformation} from "./TipMoreInformation";
import {TipUserPay} from "./TipUserPay";
import {TipFindOpponent} from "./TipFindOpponent";
import {TipDropouts} from "./TipDropouts";

const mobileStylePages = ["vs"];

export const Tips = () => {
  const location = useLocation();

  const isMobileStyled = mobileStylePages.some((mobileStylePage) =>
    includes(location.pathname, mobileStylePage)
  );

  return (
    <Container type={{ desktop: "fluid", mobile: "total" }}>
      <h2>
        TIPS PARA <span>NUEVOS</span>
      </h2>
      <Carousel
        styled={{ mobile: { height: "170px" }, desktop: { height: "200px" } }}
        components={[
          <LevelYourOpponent isMobileStyled={isMobileStyled} />,
          <TipUserPay />,
          <TipPaymentsDeposits />,
          <TipFindOpponent />,
          <TipEvidence />,
          <TipDropouts />,
          <TipMoreInformation />,
        ]}
      />
    </Container>
  );
};

const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  h2 {
    font-size: 12px;
    font-weight: normal;
    color: ${(props) => props.theme.basic.white};
    margin: 10px 0 !important;
    span {
      color: ${(props) => props.theme.basic.action};
    }
  }
`;
