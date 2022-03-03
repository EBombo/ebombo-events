import React from "reactn";
import styled from "styled-components";
import { ButtonAnt } from "../../components/form";
import { mediaQuery } from "../../constants";
import { useRouter } from "next/router";

export const BannerEbombo = (props) => {
  const router = useRouter();

  return (
    <BannerEbomboStyled>
      <div className="content">
        <div className="title">El evento virtual que amarás</div>

        <ButtonAnt
          color="success"
          variant="contained"
          fontSize="15px"
          margin="25px 0 0 0"
          onClick={() => router.push("/register")}
        >
          Regístrate
        </ButtonAnt>
      </div>
    </BannerEbomboStyled>
  );
};

const BannerEbomboStyled = styled.div`
  padding: 5rem 0;
  background: linear-gradient(270deg, #1d1138 0%, #331e6d 31.25%, #1e1239 100%);

  .content {
    margin: auto;
    max-width: 90vw;

    ${mediaQuery.afterTablet} {
      margin: auto;
      max-width: 80vw;
    }

    .title {
      font-size: 40px;
      font-weight: bold;
      color: ${(props) => props.theme.basic.white};
    }
  }
`;
