import React from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { mediaQuery } from "../../../constants";
import { infoGamesData } from "../../../components/common/DataList";
import { GameInfoSection } from "./GameInfoSection";
import { Icon } from "../../../components/common/Icons";
import { ContactForm } from "../../home/ContactForm";

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
        {infoGame && <GameInfoSection infoGame={infoGame} />}
        <ContactForm/>
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

