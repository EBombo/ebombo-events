import React, { useState } from "reactn";
import { config } from "../../firebase";
import { ButtonAnt, Input, TextArea, Anchor } from "../../components/form";
import { Image } from "../../components/common/Image";
import styled from "styled-components";
import { Desktop, mediaQuery } from "../../constants";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { useFetch } from "../../hooks/useFetch";
import { useSendError } from "../../hooks";

const salesTeam = [
  {
    name: "Daniel Vega",
    description: "Sub Gerente de Comunicación Interna en Ripley Perú",
    imageUrl: `${config.storageUrl}/resources/team-sales/danielvega.svg`,
    phoneNumber: "+51 991 175 288",
    phoneNumberHref: "https://wa.me/51991175288",
    email: "daniel@bombo.pe",
    emailHref: "mailto:daniel@bombo.pe",
  },
  {
    name: "Santiago Suarez",
    description: "Sub Gerente de Comunicación Interna en Ripley Perú",
    imageUrl: `${config.storageUrl}/resources/team-sales/santiagosuarez.svg`,
    phoneNumber: "+51 948 879 888",
    phoneNumberHref: "https://wa.me/51948879888",
    email: "santiago@bombo.pe",
    emailHref: "mailto:santiago@bombo.pe",
  },
  {
    name: "Vivian Sejuro",
    description: "Sub Gerente de Comunicación Interna en Ripley Perú",
    imageUrl: `${config.storageUrl}/resources/team-sales/viviansejuro.svg`,
    phoneNumber: "+51 983 645 002",
    phoneNumberHref: "https://wa.me/51983645002",
    email: "vivian@bombo.pe",
    emailHref: "mailto:vivian@bombo.pe",
  },
];

export const Contact = (props) => {
  return (
    <ContactSection ref={props.refProp}>
      <div className="team-container">
        <div className="title">
          Sobre nosotros
        </div>
        {salesTeam.map((member) => (
          <MemberContainer key={member.imageUrl}>
            <Image
              src={member.imageUrl}
              width={"180px"}
              height={"180px"}
              borderRadius={"50%"}
              margin={"1rem 0"}
              className="member-image"
            />
            <div className="main-container">
              <div className="name">{member.name}</div>
              <div className="description">{member.description}</div>

              <div className="contact-data">
                <Image
                  src={`${config.storageUrl}/resources/b2bLanding/wsp-icon.svg`}
                  width="20px"
                  height="20px"
                  alt=""
                  className="icon"
                />
                <span className="info">
                  <Anchor 
                    href={member.phoneNumberHref}
                    target="_blank">
                    {member.phoneNumber}
                  </Anchor>
                </span>

                <Image
                  src={`${config.storageUrl}/resources/b2bLanding/email.svg`}
                  width="20px"
                  height="20px"
                  alt=""
                  className="icon"
                />

                <span className="info">
                  <Anchor 
                    href={member.emailHref}
                    target="_blank">
                    {member.email}
                  </Anchor>
                </span>
              </div>
            </div>
          </MemberContainer>
        ))}
      </div>
    </ContactSection>
  );
};

const ContactSection = styled.section`
  padding: 1rem;
  background: ${(props) => props.theme.basic.white};
  position: relative;
  width: 100%;

  .title {
    font-family: Lato, sans-serif;
    font-weight: 700;
    font-size: 22px;
    line-height: 26px;
    text-align: center;
    color: ${(props) => props.theme.basic.primaryDark};
    margin-bottom: 42px;
    font-style: normal;
  }

  .description {
    font-family: Lato;
    font-style: normal;
    font-weight: 100;
    font-size: 18px;
    line-height: 22px;
    color: ${(props) => props.theme.basic.white};
    margin-bottom: 24px;
    font-style: normal;
  }

  .team-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-bottom: 2rem;
  }

  ${mediaQuery.afterTablet} {
    padding: 2rem;

    .title {
      font-size: 34px;
      line-height: 41px;
    }

    .team-container {
      justify-content: space-around;
      align-items: center;
      flex-direction: row;
      max-width: 1300px;
      margin: 0 auto;
    }
  }
`;

const MemberContainer = styled.div`
  text-align: center;
  max-width: 250px;
  margin: 0 auto 110px auto;

  .member-image {
    display: inline-block;
    margin-bottom: 64px;
  }

  .main-container {
    .name {
      font-style: normal;
      font-weight: bold;
      font-size: 18px;
      line-height: 25px;
      text-align: center;
      ${mediaQuery.afterTablet} {
        font-size: 20px;
      }
    }
    .description {
      margin: 7px 0 14px 0;
      font-size: 16px;
    }

    .contact-data {
      display: inline-grid;
      grid-template-columns: 43px 1fr;
      grid-template-rows: auto auto;
      row-gap: 0.5rem;

      .icon {
        margin: 0 auto 0 0;
      }
      .info {
        text-align: left;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
      }
    }
  }

  ${mediaQuery.afterTablet} {
    display: inline-block;
  }
`;
