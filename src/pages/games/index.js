import React from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { mediaQuery } from "../../constants";
import { infoGamesData } from "../../components/common/DataList";
import { GameInfoSection } from "./_gameId/GameInfoSection";
import { Icon } from "../../components/common/Icons";

export const GamesDetail = (props) => {
  const router = useRouter();

  const infoGame = infoGamesData[0];

  return (
  <LandingContainer>
    <div className="landing-container">
      <div className="back-container">
        <Icon className="back-icon" type="left" onClick={() => router.back()} />
      </div>
      <GameInfoSectionContainer>
        { infoGame && <GameInfoSection infoGame={infoGame} /> }
      </GameInfoSectionContainer>
    </div>
  </LandingContainer>);
};

const LandingContainer = styled.div`
  width: 100%;
  background: ${(props) => props.theme.basic.whiteLighten};

  .landing-container {
    position: relative;
    z-index: 1;
  }
  .back-container {
    max-width: 1200px;
    margin: 0 auto 0 auto;
    padding-top: 32px;
    span {
      border-radius: 50%;
      padding: 6px;
      background: ${(props) => props.theme.basic.primary};

      // position: absolute;
      cursor: pointer;
      // bottom: 0;
      // left: 32px;
      vertical-align: bottom;
      color: ${(props) => props.theme.basic.white};
      svg {
        font-size: 12px;
      }
    }
  }
`;

const GameInfoSectionContainer = styled.div`
  section:nth-child(even) {
    background: ${props => props.theme.basic.blackDarken};
    color: ${props => props.theme.basic.white};
    h1 {
      color: ${props => props.theme.basic.white};
    }

  }
  section:nth-child(odd) {
    background: ${props => props.theme.basic.whiteLighten};
    color: ${props => props.theme.basic.black};
    ${mediaQuery.afterTablet} {
      .body-container > .description {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
      }
      .body-container > .image-container {
        grid-column: 2 / 3;
        grid-row: 1 / 2;
        align-self: center;
      }
    }
  }
`;
