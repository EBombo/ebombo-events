import React from "reactn";
import styled from "styled-components";
import { config } from "../../firebase";
import { Image } from "../../components/common/Image";
import { mediaQuery } from "../../constants";

export const Companies = (props) => {
  return (
    <CompaniesStyled>
      <Image
        src={`${config.storageUrl}/resources/planet-1.svg`}
        size="contain"
        width="200px"
        height="200px"
        margin="24px"
        className="planet-1"
      />
      <Image
        src={`${config.storageUrl}/resources/planet-2.svg`}
        size="contain"
        width="200px"
        height="200px"
        margin="24px"
        className="planet-2"
      />

      <div className="content">
        <div className="title">Grandes compañías han confiado en nosotros, solo faltas tú</div>

        <Image
          src={`${config.storageUrl}/resources/companies-group-icon.png`}
          size={"contain"}
          height="200px"
          width="100%"
          margin="24px"
        />
      </div>
    </CompaniesStyled>
  );
};

const CompaniesStyled = styled.div`
  padding: 1.5rem 0;
  position: relative;
  background: linear-gradient(276.15deg, #331e6d 0%, #6646b7 100%);

  .content {
    ${mediaQuery.afterTablet} {
      margin: auto;
      max-width: 80vw;
    }

    .title {
      font-size: 24px;
      text-align: center;
      margin-bottom: 15px;
      color: ${(props) => props.theme.basic.white};
    }
  }

  .planet-1 {
    position: absolute;
    left: 1rem;
    top: -5rem;
  }

  .planet-2 {
    position: absolute;
    bottom: -6rem;
    right: 1rem;
  }
`;
