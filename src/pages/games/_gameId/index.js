import React from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { mediaQuery } from "../../../constants";
import { infoGamesData } from "../../../components/common/DataList";
import { GameInfoSection } from "./GameInfoSection";
import { Icon } from "../../../components/common/Icons";

export const GameDetail = (props) => {
  const router = useRouter();

  const { gameId } = router.query;

  const infoGame = infoGamesData.find((infoGame) => infoGame.id === gameId);

  return (
    <LandingContainer>
      <div className="landing-container">
        <div className="back-container">
          <Icon className="back-icon" type="left" onClick={() => router.back()} />
        </div>
        <GameInfoSectionsContainer>{infoGame && <GameInfoSection infoGame={infoGame} />}</GameInfoSectionsContainer>
      </div>
    </LandingContainer>
  );
};

// TODO: Consider refactoring.
// TODO: Don't use nth-child.
// TODO: Don't use ".a-class > .b-class".
// TODO: Use the className.
const LandingContainer = styled.div`
  width: 100%;
  height: 100%;
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

const GameInfoSectionsContainer = styled.div`
  section:nth-child(even) {
    background: ${(props) => props.theme.basic.blackDarken};
    color: ${(props) => props.theme.basic.white};

    h1 {
      color: ${(props) => props.theme.basic.white};
    }
  }

  section:nth-child(odd) {
    background: ${(props) => props.theme.basic.whiteLighten};
    color: ${(props) => props.theme.basic.black};

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
