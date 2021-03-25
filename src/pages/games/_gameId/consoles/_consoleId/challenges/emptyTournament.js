import React from "reactn";
import get from "lodash/get";
import styled from "styled-components";
import { config } from "../../../../../../firebase";
import { Desktop, Tablet } from "../../../../../../utils";
import { Image } from "../../../../../../components/common/Image";

export const EmptyTournaments = ({ type = "default" }) => {
  const data = {
    default: {
      text:
        "Por el momento no hay torneos abiertos para este juego. Te recomendamos seguirnos en nuestras redes para enterarte de nuestras novedades y próximos torneos. Estate atento que se vienen próximos torneos :)",
      imgUrl: "tournaments-empty.svg",
    },
    teams: {
      text: "No te has inscrito a ningún torneo.",
      imgUrl: "empty-tournaments-team.svg",
    },
    matches: {
      text: "No tienes partidas de torneos en estos momentos.",
      imgUrl: "empty-tournaments-matches.svg",
    },
  };

  return (
    <Container>
      <p>{get(data[type], "text")}</p>
      <Desktop>
        <Image
          src={`${config.storageUrl}/resources/${get(data[type], "imgUrl")}`}
          width="180px"
          height="115px"
          margin="0"
        />
      </Desktop>
      <Tablet>
        <Image
          src={`${config.storageUrl}/resources/${get(data[type], "imgUrl")}`}
          width="180px"
          height="115px"
          margin="0"
        />
      </Tablet>
    </Container>
  );
};

const Container = styled.section`
  width: 100%;
  padding-left: 1rem;
  p {
    color: ${(props) => props.theme.basic.white};
  }
`;
