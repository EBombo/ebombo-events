import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../styles/constants";
import { config } from "../../firebase";
import get from "lodash/get";

const dataAchievements = [
  {
    title: "Partidas rápidas",
    description:
      "Elige tu juego favorito, crea una sala con tus propias reglas o entra a una sala ya creada y participa por dinero real o dinero jugable,  también puedes conseguir un rival mediante el chat de nuestra plataforma.",
    icon: "/resources/clock.svg",
    amount: "+13215",
    type: "partidas jugadas",
  },
  {
    title: "Torneos",
    description:
      "Participa en nuestros torneos semanales de tu juego favorito de forma individual o con tu equipo, gana premios y demuestra que eres el mejor.",
    icon: "/resources/trophy.svg",
    amount: "+5087",
    type: "torneos organizados",
  },
  {
    title: "Comunidad",
    description:
      "Encuentra rivales probar tus habilidades y ganar premios. Además,  haz nuevos amigos gamers con quienes jugar y competir.",
    icon: "/resources/high-five.svg",
    amount: "+38272",
    type: "usuarios registrados",
  },
];

export const ContentAchievements = (props) => {
  const [settings] = useGlobal("settings");

  return (
    <ContainerAchievements>
      {dataAchievements.map((achievement) => (
        <div
          className="achievement-content"
          key={`key-achievement-${achievement.title}`}
        >
          <h4>{achievement.title}</h4>
          <div className="image-container">
            <img src={`${config.storageUrl}${achievement.icon}`} alt="" />
          </div>
          <p>{achievement.description}</p>
          <span>
            {achievement.type.includes("usuarios") &&
              `+${get(settings, "totalUsers", achievement.amount)}`}
            {achievement.type.includes("torneos") &&
              `+${get(settings, "totalTournaments", achievement.amount)}`}
            {achievement.type.includes("partidas") &&
              `+${get(settings, "totalMatches", achievement.amount)}`}
          </span>
          <h5>{achievement.type}</h5>
        </div>
      ))}
    </ContainerAchievements>
  );
};

const ContainerAchievements = styled.section`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${(props) => props.theme.basic.blackDarken};

  ${mediaQuery.afterTablet} {
    padding: 3rem 2.5rem;
    flex-direction: row;
  }

  .achievement-content {
    padding: 1rem;
    text-align: center;
    flex: 1;

    h4 {
      color: ${(props) => props.theme.basic.white};
      font-weight: 600;
      font-size: 25px;
      line-height: 31px;
      text-align: center;
    }

    .image-container {
      padding: 1rem 0;

      img {
        width: 75px;
        height: 75px;
      }
    }

    p {
      text-align: left;
      color: ${(props) => props.theme.basic.whiteDarken};
      font-style: normal;
      font-weight: 300;
      font-size: 18px;
      line-height: 22px;

      ${mediaQuery.afterTablet} {
        height: 110px;
      }
    }

    span {
      width: 100%;
      color: ${(props) => props.theme.basic.primary};
      font-size: 31px;
      line-height: 39px;
      text-align: center;
    }

    h5 {
      color: ${(props) => props.theme.basic.whiteDarken};
      font-style: normal;
      font-weight: 300;
      font-size: 18px;
      line-height: 22px;
    }
  }
`;
