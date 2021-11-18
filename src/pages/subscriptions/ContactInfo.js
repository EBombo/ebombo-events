import React from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { mediaQuery } from "../../constants";

export const ContactInfo = (props) => {
  return (
    <ContactContent>
      <div className="info">
        <a href="https://wa.me/51983645002" target="_blank">
          <Image
            src={`${config.storageUrl}/resources/b2bLanding/wsp-icon.svg`}
            width="20px"
            height="20px"
            margin="0 5px 0 0"
            className="icon"
            cursor="pointer"
          />
        </a>
        <div className="info-content">Mateo Suarez Stewart: +51 945 693 597</div>
      </div>

      <div className="info">
        <a href="mailto:mateo@ebombo.com">
          <Image
            src={`${config.storageUrl}/resources/b2bLanding/email.svg`}
            width="20px"
            height="20px"
            margin="0 5px 0 0"
            className="icon"
            cursor="pointer"
          />
        </a>
        <div className="info-content">Mail: mateo@ebombo.com</div>
      </div>
    </ContactContent>
  );
};

const ContactContent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  margin: 2rem auto 1rem auto;

  .info {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 0.5rem 0;

    .info-content {
      font-family: Lato;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.blackDarken};
    }
  }

  ${mediaQuery.afterTablet} {
    flex-direction: row;

    .info {
      margin: 0;
    }
  }
`;
