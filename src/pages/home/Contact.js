import React, { useState } from "reactn";
import { config } from "../../firebase";
import { ButtonAnt, Input, TextArea } from "../../components/form";
import { Image } from "../../components/common/Image";
import styled from "styled-components";
import { mediaQuery } from "../../styles/constants";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { useErrorHandler } from "react-error-boundary";
import { useFetch } from "../../hooks/useFetch";
import { Desktop } from "../../constants";

const salesTeam = [
  {
    name: "Daniel Vega",
    imageUrl: `${config.storageUrl}/resources/team-sales/danielvega.svg`,
    phoneNumber: "+51 991 175 288",
    email: "daniel@bombo.pe",
  },
  {
    name: "Santiago Suarez",
    imageUrl: `${config.storageUrl}/resources/team-sales/santiagosuarez.svg`,
    phoneNumber: "+51 948 879 888",
    email: "santiago@bombo.pe",
  },
  {
    name: "Vivian Sejuro",
    imageUrl: `${config.storageUrl}/resources/team-sales/viviansejuro.svg`,
    phoneNumber: "+51 983 645 002",
    email: "vivian@bombo.pe",
  },
];

export const Contact = (props) => {
  const handleError = useErrorHandler();
  const { Fetch } = useFetch();
  const [loadingSendingEmail, setLoadingSendingEmail] = useState(false);

  const schema = object().shape({
    phoneNumber: string().required(),
    message: string().required(),
    email: string().required(),
  });

  const { register, handleSubmit, errors, reset } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const sendEmail = async (data) => {
    try {
      setLoadingSendingEmail(true);

      await Fetch(`${config.serverUrl}/business-email`, "POST", data);

      reset({
        message: null,
        email: null,
        phoneNumber: null,
      });
      setLoadingSendingEmail(false);
    } catch (error) {
      handleError({ ...error, action: "sendEmail" });
    }
  };

  return (
    <ContactSection ref={props.refProp}>
      <div className="title">
        ¿Deseas mayor información?
        <br />
        <span>Ponte en contacto con el equipo de ventas</span>
      </div>

      <div className="team-container">
        {salesTeam.map((member) => (
          <MemberContainer key={member.imageUrl}>
            <Image
              src={member.imageUrl}
              width={"120px"}
              height={"120px"}
              desktopWidth={"260px"}
              desktopHeight={"260px"}
              borderRadius={"15px"}
              margin={"1rem 0"}
            />
            <div className="main-container">
              <div className="name">{member.name}</div>
              <div className="number-container">
                <Desktop>
                  <img
                    src={`${config.storageUrl}/resources/wsp-icon.svg`}
                    alt=""
                  />
                </Desktop>
                <div className="info">
                  Whatsapp: <br />
                  {member.phoneNumber}
                </div>
              </div>
              <div className="email-container">
                <Desktop>
                  <img
                    src={`${config.storageUrl}/resources/b2bLanding/email.svg`}
                    alt=""
                  />
                </Desktop>
                <div className="info">
                  Correo: <br />
                  {member.email}
                </div>
              </div>
            </div>
          </MemberContainer>
        ))}
      </div>

      <div className="title">
        Deja tu consulta y nos pondremos en contacto con usted
      </div>
      <form onSubmit={handleSubmit(sendEmail)}>
        <TextArea
          error={errors.message}
          name="message"
          ref={register}
          rows="10"
          placeholder="Déjanos tu consulta aquí"
        />
        <div className="info-contact">
          <Input
            error={errors.email}
            type="email"
            ref={register}
            name="email"
            placeholder="Correo electrónico"
          />
          <Input
            error={errors.phoneNumber}
            type="text"
            ref={register}
            name="phoneNumber"
            placeholder="Número de teléfono"
          />
        </div>
        <ButtonAnt
          variant="contained"
          color="primary"
          width="100%"
          loading={loadingSendingEmail}
          disabled={loadingSendingEmail}
          htmlType="submit"
        >
          Enviar
        </ButtonAnt>
      </form>
    </ContactSection>
  );
};

const ContactSection = styled.section`
  padding: 1rem;
  background: ${(props) => props.theme.basic.white};
  position: relative;
  width: 100%;

  .title {
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
    span {
      font-weight: normal;
    }
  }

  form {
    max-width: 660px;
    textarea {
      margin-top: 0.5rem;
      width: 100%;
      background: #d0e4e8;
      color: #3f3d56;
      border-radius: 6px;
      border: none;
      padding: 1rem;
      height: 100px;
    }

    .info-contact {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 1rem;
      margin: 0.5rem 0;

      input {
        width: 100%;
        background: #d0e4e8;
        color: #3f3d56;
        border-radius: 6px;
        border: none;
        padding: 1rem;
      }
    }
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
      font-style: normal;
      font-weight: bold;
      font-size: 24px;
      line-height: 30px;
      text-align: left;
    }

    .team-container {
      justify-content: space-around;
      align-items: center;
      flex-direction: row;
    }
  }
`;

const MemberContainer = styled.div`
  display: flex;
  align-items: center;

  div:first-child {
    margin-right: 1rem;
  }

  .main-container {
    .name {
      font-style: normal;
      font-weight: bold;
      font-size: 20px;
      line-height: 25px;
      text-align: left;
    }

    .number-container,
    .email-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .info {
        text-align: left;
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 15px;
      }

      img {
        margin-right: 10px;
      }
    }
  }

  ${mediaQuery.afterTablet} {
    flex-direction: column;
    align-items: flex-start;
    div:first-child {
      margin-right: 0;
    }

    .main-container {
      .number-container,
      .email-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .info {
          font-size: 15px;
          line-height: 19px;
        }
      }
    }
  }
`;
