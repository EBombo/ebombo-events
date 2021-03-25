import React, { useState } from "reactn";
import { config } from "../../firebase";
import { ButtonBombo, Input, TextArea } from "../../components";
import { Desktop } from "../../utils";
import styled from "styled-components";
import { mediaQuery } from "../../styles/constants";
import { message } from "antd";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { useErrorHandler } from "react-error-boundary";
import { useOwnFetch } from "../../utils/useFetch/useFetch";

export const Contact = (props) => {
  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();
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

      await ownFetch(`${config.serverUrl}/business-email`, "POST", data);

      message.success("Se envio el mensaje correctamente.");
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
    <ContactSection id="contact">
      <div className="content">
        <h2>¿Deseas mayor información?</h2>
        <p>Ponte en contacto con nosotros</p>

        <div
          className="company-info"
          onClick={() => window.open("https://wa.me/51945693597", "_blank")}
        >
          <img src={`${config.storageUrl}/resources/wsp-icon.svg`} alt="" />
          <span>+51 915 088 420</span>
        </div>
        <div className="company-info">
          <img
            src={`${config.storageUrl}/resources/b2bLanding/email.svg`}
            alt=""
          />
          <span>mateo@bombo.pe</span>
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
          <ButtonBombo
            width="100%"
            loading={loadingSendingEmail}
            disabled={loadingSendingEmail}
            htmlType="submit"
          >
            Enviar
          </ButtonBombo>
        </form>
      </div>
      <Desktop>
        <div className="image-container">
          <img
            src={`${config.storageUrl}/resources/b2bLanding/schedule.svg`}
            alt=""
          />
        </div>
      </Desktop>
    </ContactSection>
  );
};

const ContactSection = styled.section`
  padding: 250px 1rem 1rem;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  background-image: url(${config.storageUrl + "/resources/b2bLanding/9.png"});

  ${mediaQuery.afterTablet} {
    padding: 500px 3rem 3rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1rem;
  }

  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content {
    width: 100%;

    h2 {
      font-style: normal;
      font-weight: bold;
      color: ${(props) => props.theme.basic.white};
      font-size: 15px;
      line-height: 19px;

      ${mediaQuery.afterTablet} {
        font-size: 24px;
        line-height: 30px;
      }
    }

    p {
      font-style: normal;
      color: ${(props) => props.theme.basic.white};
      font-size: 15px;
      line-height: 19px;

      ${mediaQuery.afterTablet} {
        font-size: 24px;
        line-height: 30px;
      }
    }

    .company-info {
      margin: 0.5rem 0 !important;
      display: flex;
      align-items: center;

      span {
        margin-left: 10px;
        font-style: normal;
        font-weight: 500;
        color: ${(props) => props.theme.basic.white};
        font-size: 13px;
        line-height: 16px;

        ${mediaQuery.afterTablet} {
          font-size: 22px;
          line-height: 27px;
        }
      }
    }

    form {
      textarea {
        margin-top: 0.5rem;
        width: 100%;
        background: #d0e4e8;
        color: #3f3d56;
        border-radius: 6px;
        border: none;
        padding: 1rem;
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
  }
`;
