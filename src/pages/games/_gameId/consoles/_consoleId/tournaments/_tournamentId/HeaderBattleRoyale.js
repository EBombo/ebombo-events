import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { Image } from "../../../../../../../components/common/Image";
import { config } from "../../../../../../../firebase";
import { mediaQuery } from "../../../../../../../styles/constants";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";

export const HeaderBattleRoyale = (props) => {
  const [authUser] = useGlobal("user");

  return defaultTo(props.tournamentTeams, []).some(
    (team) => team.playerIds[0] === get(authUser, "id")
  ) ? (
    <HeaderBattleRoyaleCss>
      <div className="title">
        Únete al grupo de Whatsappo Discord del torneo:
      </div>
      <div className="sub-title">
        <Image
          src={`${config.storageUrl}/resources/wsp-icon.svg`}
          height="30px"
          width="30px"
        />
        <div className="sub-title-item">Grupo de Whatsapp</div>
      </div>
      <div className="text">
        Tienes <b className="danger">{props.timer}</b> para jugar{" "}
        <b className="primary">las partidas que quieras.</b>
        <br /> Solo puedes colocar tus <b className={"primary"}>3</b> mejores
        partidas. Suerte :)
        <br />
        <br />
        Por favor juega las 3 partidas correspondientes
      </div>
      <div className="sub-text">
        * La subida de imagen despúes de la partida solo será obligatoria en
        caso el admin la pida.
      </div>
    </HeaderBattleRoyaleCss>
  ) : null;
};

const HeaderBattleRoyaleCss = styled.div`
  ${mediaQuery.afterTablet} {
    width: 30vw;
  }

  margin-bottom: 15px;

  .title {
    font-size: 13px;
    font-weight: bold;
    color: ${(props) => props.theme.basic.primary};
    margin-bottom: 15px;
  }

  .sub-title {
    display: inline-flex;
    font-size: 13px;
    font-weight: bold;
    color: ${(props) => props.theme.basic.primary};

    .sub-title-item {
      margin: auto 5px;
    }
  }

  .text {
    font-size: 12px;
    font-weight: bold;
    color: ${(props) => props.theme.basic.white};

    .danger {
      color: ${(props) => props.theme.basic.danger};
    }

    .primary {
      color: ${(props) => props.theme.basic.primary};
    }
  }

  .sub-text {
    font-size: 12px;
    color: ${(props) => props.theme.basic.white};
  }
`;
