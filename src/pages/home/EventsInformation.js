import React from "reactn";
import styled from "styled-components";

export const EventsInformation = (props) => {
  return (
    <EventsInformationStyled>
      <div className="title">Dirige como quieras las dinámicas virtuales</div>

      <div>
        <div>
          <div>1</div>
          <div>2</div>
        </div>
        <div>img</div>
      </div>
    </EventsInformationStyled>
  );
};

const EventsInformationStyled = styled.div`
  .title {
    color: ${(props) => props.theme.basic.white};
  }

  background: linear-gradient(270deg, #1d1138 0%, #331e6d 31.25%, #1e1239 100%);
`;
