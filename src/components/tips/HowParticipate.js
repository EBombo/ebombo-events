import React from "react";
import styled from "styled-components";

export const HowParticipate = () => (
  <Container>
    <iframe
      src="https://www.youtube.com/embed/40wii0P5hzo"
      frameBorder="0"
      allowFullScreen
    />
  </Container>
);

const Container = styled.div`
  width: 100%;
  height: 100%;

  iframe {
    width: 100%;
    height: 100%;
    min-height: 275px;
  }
`;
