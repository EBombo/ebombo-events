import React, { useState } from "reactn";
import { config } from "../../firebase";
import { ButtonBombo, Input, TextArea, Image } from "../../components";
import styled from "styled-components";
import { mediaQuery } from "../../styles/constants";
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
      <div className="content">
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
          <ButtonBombo
            variant="contained"
            color="primary"
            width="100%"
            loading={loadingSendingEmail}
            disabled={loadingSendingEmail}
            htmlType="submit"
          >
            Enviar
          </ButtonBombo>
        </form>
      </div>
    </ContactSection>
  );
};

const ContactSection = styled.section`
  padding: 1rem;
  background: ${(props) => props.theme.basic.white};
  position: relative;
  width: 100%;

  .content {
    .title {
      font-style: normal;
      font-weight: bold;
      font-size: 18px;
      line-height: 22px;
      text-align: center;
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
  }

  ${mediaQuery.afterTablet} {
    padding: 2rem;

    .content {
      .title {
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 30px;
        text-align: left;
      }
    }
  }
`;
