import React from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { infoGamesData } from "../../components/common/DataList";
import { GameInfoSection } from "./_gameId/GameInfoSection";
import { Icon } from "../../components/common/Icons";
import { Index } from "../contact";

export const GamesDetail = (props) => {
  const router = useRouter();

  const infoGame = infoGamesData[0];

  return (
    <LandingContainer>
      <div className="landing-container">
        <div className="back-container">
          <Icon className="back-icon" type="left" onClick={() => router.back()} />
        </div>
        {infoGame && <GameInfoSection infoGame={infoGame} />}
        <Index />
      </div>
    </LandingContainer>
  );
};

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

    .back-icon {
      border-radius: 50%;
      padding: 6px;
      background: ${(props) => props.theme.basic.primary};
      cursor: pointer;
      vertical-align: bottom;
      color: ${(props) => props.theme.basic.white};
    }
  }
`;
