import React, { useMemo } from "reactn";
import styled from "styled-components";
import { Desktop, mediaQuery, Tablet } from "../constants";
import { Image } from "./common/Image";
import { Anchor } from "./form";
import { config } from "../firebase";

const footerContent = [
  {
    title: "Nosotros",
    children: [
      { title: "Conócenos", link: "/about-us" },
      { title: "Términos y condiciones", link: "/" },
    ],
  },
  {
    title: "Plataforma",
    children: [
      { title: "¿Qué hacemos?", link: "/about-us" },
      { title: "Pide una demo", link: "/contact" },
    ],
  },
  {
    title: "Contacto",
    children: [
      { title: "Contactar ventas", link: "/contact" },
      { title: "Contactar soporte", link: "/contact" },
    ],
  },
];

export const Footer = (props) => {
  const email = useMemo(() => {
    return (
      <div className="email" onClick={() => window.open("mailto:events@ebombo.com.pe")}>
        <Image
          src={`${config.storageUrl}/resources/email-white.svg`}
          size="contain"
          width="15px"
          height="15px"
          margin="5px 10px 0 0"
        />
        events@ebombo.com
      </div>
    );
  }, []);

  return (
    <FooterContainer>
      <div className="content-footer">
        <div className="images">
          <Image
            src={`${config.storageUrl}/resources/ebombo-footer.svg`}
            size="contain"
            desktopWidth="150px"
            desktopHeight="fit-content"
            width="100px"
            height="auto"
            margin="0"
          />

          <div className="icons">
            <div className="email">
              <Image
                cursor="pointer"
                onClick={() => window.open("https://www.instagram.com/ebombo_/")}
                src={`${config.storageUrl}/resources/instagram-white.svg`}
                size="contain"
                width="15px"
                height="15px"
                margin="0"
              />
              <Image
                cursor="pointer"
                onClick={() => window.open("https://www.linkedin.com/company/ebombo/?viewAsMember=true")}
                src={`${config.storageUrl}/resources/linkedin-white.svg`}
                size="contain"
                width="15px"
                height="15px"
                margin="0 10px"
              />
            </div>

            <Desktop>{email}</Desktop>
          </div>
        </div>

        <Tablet>{email}</Tablet>

        {footerContent.map((content) => (
          <div className="content-wrapper" key={content.title}>
            <div className="title">{content.title}</div>

            <div className="items-container">
              {content.children.map((item, index) => (
                <div key={`desktop-${index}`}>
                  <Anchor href={item.link} variant="primary" margin="0" fontSize="13px">
                    {item.title}
                  </Anchor>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="copyright-container">
        <div className="label">
          <Image className="icon" src={`${config.storageUrl}/resources/copyright.svg`} width="15px" height="15px" />{" "}
          ebombo 2022
        </div>
      </div>
    </FooterContainer>
  );
};

const FooterContainer = styled.div`
  background: ${(props) => props.theme.basic.secondaryDark};

  .content-footer {
    display: grid;
    grid-gap: 30px 0;
    padding-top: 4rem;
    padding-bottom: 4rem;
    grid-template-columns: 1fr 1fr;
    color: ${(props) => props.theme.basic.white};

    ${mediaQuery.afterTablet} {
      display: grid;
      grid-template-columns: 3fr 1fr 1fr 1fr;
    }

    .images {
      padding-left: 2rem;

      ${mediaQuery.afterTablet} {
        padding-left: 3rem;
      }
    }

    .icons {
      display: inline-grid;
    }

    .email {
      display: flex;
      cursor: pointer;
      margin-top: 20px;
    }

    .content-wrapper {
      padding-left: 2rem;

      .title {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }

  .copyright-container {
    .label {
      text-align: left;
      padding: 30px;
      font-size: 14px;
      font-weight: 500;
      line-height: 17px;
      font-family: Lato;
      font-style: normal;
      color: ${(props) => props.theme.basic.white};
      border-top: 3px solid ${(props) => props.theme.basic.primary};

      .icon {
        filter: invert(1);
        margin-right: 15px;
        margin-bottom: -3px;
        display: inline-block;
      }
    }
  }
`;
