import React, {useGlobal, useState} from "reactn";
import {ButtonBombo, EBomboRules} from "../common";
import {Suggestion} from "../common/Suggestion";
import styled from "styled-components";
import {ModalContainer} from "../common/ModalContainer";
import {BurgerMenuAccordion} from "./BurgerMenuAccordion";
import {Anchor} from "../common/Anchor";

const Rules = (props) => (
  <RulesContainer>
    <SectionTitle>Reglas de ebombo</SectionTitle>
    <Anchor
      className="view-rules"
      type="primary"
      onClick={() => props.setIsVisibleEBomboRules(!props.isVisibleEBomboRules)}
    >
      Ver Reglas
    </Anchor>
  </RulesContainer>
);

const Video = () => {
  const [settings] = useGlobal("settings");

  return (
    <VideoContainer>
      <SectionTitle>Video explicativo</SectionTitle>
      <ButtonBombo
        margin={"1rem 0"}
        type="secondary"
        onClick={() => window.open(settings.videoUrl, "_blank")}
      >
        Ver video
      </ButtonBombo>
    </VideoContainer>
  );
};

export const HowItWorks = (props) => {
  const [howItWorks] = useGlobal("howItWorks");
  const [isVisibleEBomboRules, setIsVisibleEBomboRules] = useState(false);

  return (
    <>
      <TopContainer>
        <SectionTitle>¿Cómo funciona?</SectionTitle>
        <BurgerMenuAccordion howItWorks={howItWorks} />
      </TopContainer>
      <BottomContainer>
        <Rules
          setIsVisibleEBomboRules={setIsVisibleEBomboRules}
          isVisibleEBomboRules={isVisibleEBomboRules}
        />
        <Video />

        <Suggestion />

        <ModalContainer
          footer={null}
          visible={isVisibleEBomboRules}
          onCancel={() => setIsVisibleEBomboRules(false)}
        >
          <EBomboRules />
        </ModalContainer>
      </BottomContainer>
    </>
  );
};

const SectionTitle = styled.h2`
  font-weight: bold;
  font-size: 15px;
  color: ${(props) => props.theme.basic.white};
`;

const TopContainer = styled.div`
  padding: 0;
  width: 100%;

  ${SectionTitle} {
    padding: 1.5rem 1rem 0 1rem;
  }
`;

const BottomContainer = styled.div`
  padding: 0 1rem 1.5rem 1rem;
  width: 100%;
`;

const RulesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-right: 2rem;

  .view-rules {
    font-size: 12px;
    cursor: pointer;
    margin: 0;
  }
`;

const VideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;
