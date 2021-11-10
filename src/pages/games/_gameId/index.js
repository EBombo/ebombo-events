import React from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Navbar } from "../../home/Navbar";
import { Footer } from "../../../components/Footer";
import { mediaQuery } from "../../../constants";
import { infoGamesData } from "../../../components/common/DataList";
import { GameInfoSection } from "./GameInfoSection";

export const GameDetail = (props) => {
  const router = useRouter();

  const { gameId } = router.query;
  const infoGame = infoGamesData.find(infoGame => infoGame.id === gameId);

  return (
  <LandingContainer>
    <div className="landing-container">
      <GameInfoSectionsContainer>
        { infoGame && infoGame.sections.map(infoSection => <GameInfoSection infoGame={infoSection} />) }
      </GameInfoSectionsContainer>
    </div>
  </LandingContainer>);
};

const LandingContainer = styled.div`
  width: 100%;

  .landing-container {
    position: relative;
    z-index: 1;
  }
`;

const GameInfoSectionsContainer = styled.div`
  section:nth-child(even) {
    background: ${props => props.theme.basic.blackDarken};
    color: ${props => props.theme.basic.white};
    h1 {
      color: ${props => props.theme.basic.white};
    }

  }
  section:nth-child(odd) {
    background: ${props => props.theme.basic.white};
    color: ${props => props.theme.basic.back};
    ${mediaQuery.afterTablet} {
      .body-container > .description {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
      }
      .body-container > .image-container {
        grid-column: 2 / 3;
        grid-row: 1 / 2;
      }
    }
  }
`;
