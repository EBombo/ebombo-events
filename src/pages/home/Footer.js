import React from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../styles/constants";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { Desktop } from "../../constants";

export const Footer = (props) => {
  return (
    <FooterContainer>
      <Image
        src={`${config.storageUrl}/resources/b2bLanding/b2bLogo.svg`}
        width={"100px"}
        height={"45px"}
        size={"contain"}
        margin={"0 0 1rem 0"}
      />

      <div className="description">Todos los derechos reservados</div>

      <Desktop>
        <div className="container-img">
          <Image
            src={`${config.storageUrl}/resources/b2bLanding/footer.svg`}
            width={"100%"}
            height={"100%"}
            size={"contain"}
            margin={"0"}
          />
        </div>
      </Desktop>
    </FooterContainer>
  );
};

const FooterContainer = styled.div`
  padding: 1rem;
  width: 100%;
  background: ${(props) => props.theme.basic.darkPurple};
  position: absolute;

  .description {
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: ${(props) => props.theme.basic.white};
  }

  .container-img {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 400px;
  }

  ${mediaQuery.afterTablet} {
    padding: 2rem;
  }
`;
