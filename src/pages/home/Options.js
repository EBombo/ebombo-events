import React, { useEffect } from "reactn";
import styled from "styled-components";
import { ButtonAnt } from "../../components/form";
import { mediaQuery } from "../../constants";
import { useRouter } from "next/router";
import { CheckOutlined } from "@ant-design/icons";

const options = [
  "Acceda a nuestra biblioteca de juegos completa que incluye Trivia, Bingo, Ruleta de preguntas, Ahorcado, entre varias actividades",
  "Eventos organizados o autoorganizados",
  "Organice fácilmente eventos con nosotros",
  "Permita que equipos grandes puedan tener un espacio de diversión, entretenimiento e integración",
];

export const Options = (props) => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/register");
  }, []);

  return (
    <OptionsStyled>
      <div className="content">
        <div className="title">Eventos virtuales para el equipo con todas las opciones</div>

        <div className="options">
          {options.map((option) => (
            <div className="option">
              {" "}
              <CheckOutlined /> {option}
            </div>
          ))}
        </div>

        <ButtonAnt
          color="success"
          variant="contained"
          fontSize="15px"
          margin="15px 0 0 0"
          onClick={() => router.push("/register")}
        >
          Regístrate
        </ButtonAnt>

        <div className="hr" />

        <div className="sub-title">Con la confianza de empresas líderes</div>
        <div className="images"></div>
      </div>
    </OptionsStyled>
  );
};

const OptionsStyled = styled.div`
  padding: 4rem 0;
  background: linear-gradient(270deg, #ececec 0%, #ffffff 31.25%, #ededed 100%);

  .content {
    ${mediaQuery.afterTablet} {
      margin: auto;
      max-width: 80vw;
    }

    .title {
      font-size: 70px;
      line-height: 84px;
      margin-bottom: 2rem;
    }

    .options {
      font-size: 20px;
      margin-bottom: 2rem;

      .option {
        span {
          color: ${(props) => props.theme.basic.primary};
        }
      }
    }

    .hr {
      height: 3px;
      margin: 25px 0;
      background: ${(props) => props.theme.basic.grayLighten};
    }

    .sub-title {
      color: ${(props) => props.theme.basic.grayLighten};
    }
  }
`;
