import React from "reactn";
import styled from "styled-components";
import { Desktop, mediaQuery, Tablet } from "../constants";
import { Image } from "./common/Image";
import { Anchor } from "./form";
import { config } from "../firebase";
import { Collapse } from "antd";
import { DownOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const footerContent = [
  {
    title: "Comienza con",
    classKey: "start-with",
    children: [
      { title: "Games" },
      { title: "Paquetes" },
      { title: "Iniciar sesión", link: "/login", target: "_self" },
      { title: "Registrate", link: "/register", target: "_self" },
    ],
  },
  {
    title: "Contáctanos",
    classKey: "contact-us",
    children: [
      {
        title: "informes@ebombo.com.pe",
        link: "mailto:informes@ebombo.com.pe",
        icon: `${config.storageUrl}/resources/b2bLanding/email.svg`,
      },
      { title: "Lunes - Viernes 6:00 am - 5:00 pm" },
      {
        title: "+51 983 645 002",
        link: "https://wa.me/51983645002",
        target: "_blank",
        icon: `${config.storageUrl}/resources/b2bLanding/wsp-icon.svg`,
      },
    ],
  },
  {
    title: "¡Síguenos!",
    classKey: "follow-us",
    children: [
      {
        title: "Facebook",
        icon: `${config.storageUrl}/resources/facebook-gray.svg`,
        link: "https://www.facebook.com/ebombogames",
        target: "_blank",
      },
      {
        title: "Instagram",
        icon: `${config.storageUrl}/resources/instagram-gray.svg`,
        link: "https://instagram.com/ebombo_events?utm_medium=copy_link",
        target: "_blank",
      },
      {
        title: "LinkedIn",
        icon: `${config.storageUrl}/resources/linkedin-gray.svg`,
        link: "https://instagram.com/ebombo_events?utm_medium=copy_link",
        target: "_blank",
      },
      {
        title: "Twitter",
        icon: `${config.storageUrl}/resources/twitter-gray.svg`,
        link: "https://twitter.com/ebombogames",
        target: "_blank",
      },
    ],
  },
];

export const Footer = (props) => (
  <FooterContainer>
    <FooterContent>
      <Tablet>
        <Collapse
          defaultActiveKey={[]}
          ghost
          expandIconPosition="right"
          expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
        >
          {footerContent.map((content) => (
            <Panel header={content.title} key={content.title}>
              <div className="items-container">
                {content.children.map((item) => (
                  <Anchor href={item.link} key={item.title} target={item.target}>
                    <div className={`item-body ${content.classKey}`}>
                      {item.icon ? (
                        <Image
                          src={item.icon}
                          width={"25px"}
                          height={"25px"}
                          size={"contain"}
                          margin={"0 auto 0 0"}
                          className="icon"
                        />
                      ) : (
                        <span />
                      )}
                      <span>{item.title}</span>
                    </div>
                  </Anchor>
                ))}
              </div>
            </Panel>
          ))}
        </Collapse>
      </Tablet>
      <Desktop>
        {footerContent.map((content) => (
          <div className="content-wrapper" key={content.title}>
            <div className="title">{content.title}</div>
            <div className="items-container">
              {content.children.map((item) => (
                <Anchor href={item.link} key={item.title} target={item.target}>
                  <div className={`item-body ${content.classKey}`}>
                    {item.icon ? (
                      <Image
                        src={item.icon}
                        width={"25px"}
                        height={"25px"}
                        size={"contain"}
                        margin={"0 auto 0 0"}
                        className="icon"
                      />
                    ) : (
                      <span />
                    )}
                    <span>{item.title}</span>
                  </div>
                </Anchor>
              ))}
            </div>
          </div>
        ))}
      </Desktop>
    </FooterContent>
    <div className="copyright-container">
      <hr />
      <div>
        <Image className="icon" src={`${config.storageUrl}/resources/copyright.svg`} width="15px" height="15px" />{" "}
        ebombo 2021
      </div>
    </div>
  </FooterContainer>
);

const FooterContainer = styled.div`
  background: ${(props) => props.theme.basic.white};
  .copyright-container {
    hr {
      border-top: 0;
    }
    .icon {
      display: inline-block;
    }
    & > div {
      padding: 30px;
      font-family: Lato;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      text-align: center;
    }
  }
`;

const FooterContent = styled.div`
  padding: 1rem;
  width: 100%;

  display: inline-flex;
  justify-content: space-evenly;
  .ant-collapse {
    width: 100%;
  }
  .ant-collapse-arrow {
    font-size: 16px !important;
  }

  .ant-collapse-header,
  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 29px;
    margin-bottom: 19px;
    color: ${(props) => props.theme.basic.secondary};
  }
  .item-body {
    margin: 12px 0;
    text-align: left;
    display: grid;
    grid-template-columns: 48px auto;
    grid-template-rows: auto;

    &.start-with {
      grid-template-columns: 0px auto;
      span:first-child {
        width: 0px;
      }
    }

    .icon {
      display: inline-block;
      align-self: start;
    }
    span {
      font-size: 18px;
      font-family: Lato;
      font-style: normal;
      font-weight: 500;
      line-height: 22px;
      color: ${(props) => props.theme.basic.grayDarken};
    }
  }

  ${mediaQuery.afterTablet} {
    padding: 2rem;
    .description {
      font-size: 12px;
    }
  }
`;
