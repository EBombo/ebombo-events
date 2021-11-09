import React from "reactn";
import styled from "styled-components";
import { Footer } from "../../components/Footer";
import { HeldEventGrid } from "./HeldEventGrid";
import { Navbar } from "../../components/Navbar";
import { heldEventsData } from "../../components/common/DataList";
import { mediaQuery, Desktop, Tablet } from "../../constants";

export const HeldEvents = (props) => (
  <LandingContainer>
    <div className="landing-container">
      <HeldEventsContainer>
        <div className="title">Eventos pasados</div>
        <div className="main-container">
          <Desktop>
            <HeldEventGrid heldEvents={heldEventsData} pageSize={9} />
          </Desktop>
          <Tablet>
            <HeldEventGrid heldEvents={heldEventsData} pageSize={3} />
          </Tablet>
        </div>
      </HeldEventsContainer>
    </div>
  </LandingContainer>
);

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

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 26px;
    letter-spacing: 0.03em;
    max-width: 1200px;
    margin-bottom: 33px;
    position: relative;
    text-align: center;
    color: ${(props) => props.theme.basic.whiteLight};

    ${mediaQuery.afterTablet} {
      text-align: left;
      max-width: 1200px;
      margin: 0 auto 24px auto;
    }
  }

  .main-container {
    width: 100%;
    height: 100%;
    overflow: auto;
    ${mediaQuery.afterTablet} {
      max-width: 1200px;
      margin: 0 auto;
    }
    ::-webkit-scrollbar {
      display: none;
    }
  }
`;
