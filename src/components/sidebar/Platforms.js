import React from "reactn";
import {ButtonBombo} from "../common";
import styled from "styled-components";
import {config} from "../../firebase";
import {darkTheme} from "../../styles/theme";

export const Platforms = () => (
  <PlatformsContainer>
    <h3>Discord</h3>
    <p>
      Unete a nuestra comunidad de discord para mantenerte al tanto de las
      novedades y encontrar partida más rápido.{" "}
    </p>
    <ButtonBombo
      fontWeight="400"
      borderRadius="5px"
      margin="0"
      border="none"
      display="flex"
      alignItems="center"
      justifyContent="space-around"
      background={darkTheme.discord.primary}
      bgColorEvents={darkTheme.discord.primary}
      bgColorBefore={true}
      onClick={() => window.open("https://discord.gg/mWUc5mgAfs", "_blank")}
    >
      <img src={`${config.storageUrl}/resources/discord.svg`} alt="" />
      <div className="button-info">
        <span>Únete a</span>
        <br />
        <span className="info-name">Discord</span>
      </div>
    </ButtonBombo>
  </PlatformsContainer>
);

const PlatformsContainer = styled.div`
  margin: 20px;

  .button-info {
    margin-left: 10px;
  }
  h3 {
    color: ${(props) => props.theme.basic.white};
  }
  p {
    font-size: 12px;
    line-height: 15px;
    color: ${(props) => props.theme.basic.whiteDarken};
  }

  span {
    color: ${(props) => props.theme.basic.white};
    font-size: 15px;
    margin: 0;
  }
  .info-name {
    font-weight: 700;
  }
`;
