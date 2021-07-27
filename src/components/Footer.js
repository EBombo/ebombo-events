import React from "reactn";
import styled from "styled-components";
import { mediaQuery, Desktop } from "../constants";
import { Image } from "./common/Image";
import { Anchor } from "./form";
import { config } from "../firebase";

export const Footer = (props) => {
  return (
    <FooterContainer>
      <div className="logos">
        <Image
          src={`${config.storageUrl}/resources/ebombo-white.svg`}
          width={"auto"}
          height={"35px"}
          size={"contain"}
          margin={"0"}
        />
        <div className="social-media">
          <Anchor
            href={"https://instagram.com/ebombo_events?utm_medium=copy_link"}
          >
            <Image
              src={`${config.storageUrl}/resources/instagram-gray.svg`}
              width={"25px"}
              height={"25px"}
              size={"contain"}
              margin={"0 5px 0"}
            />
          </Anchor>
          <Anchor
            href={"https://www.facebook.com/ebombogames"}
          >
            <Image
              src={`${config.storageUrl}/resources/facebook-gray.svg`}
              width={"25px"}
              height={"25px"}
              size={"contain"}
              margin={"0 5px 0"}
            />
          </Anchor>
          <Anchor
            href={"https://twitter.com/ebombogames"}
          >
            <Image
              src={`${config.storageUrl}/resources/twitter-gray.svg`}
              width={"25px"}
              height={"25px"}
              size={"contain"}
              margin={"0 5px 0"}
            />
          </Anchor>
        </div>
      </div>

      <div className="description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc libero
        scelerisque maecenas ut dui. Vitae vestibulum sit interdum velit egestas
        amet, senectus. Tempus, enim id egestas sollicitudin molestie eu. At
        lectus nisi aliquam libero a sit aliquam.
      </div>
    </FooterContainer>
  );
};

const FooterContainer = styled.div`
  padding: 1rem;
  width: 100%;
  background: ${(props) => props.theme.basic.secondaryDark};
  position: absolute;

  .logos {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .social-media {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }
  }

  .description {
    font-style: normal;
    font-weight: 500;
    font-size: 10px;
    line-height: 15px;
    color: ${(props) => props.theme.basic.whiteDarken};
  }

  .container-img {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 400px;
  }

  ${mediaQuery.afterTablet} {
    padding: 2rem;
    .description {
      font-size: 12px;
    }
  }
`;
