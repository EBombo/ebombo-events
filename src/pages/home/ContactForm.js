import React, { useState } from "reactn";
import { config } from "../../firebase";
import { ButtonAnt, Input, TextArea } from "../../components/form";
import { Image } from "../../components/common/Image";
import styled from "styled-components";
import { Desktop, Tablet, mediaQuery } from "../../constants";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { useFetch } from "../../hooks/useFetch";
import { useSendError } from "../../hooks";

export const ContactForm = (props) => {
  const { sendError } = useSendError();
  const { Fetch } = useFetch();
  const [loadingSendingEmail, setLoadingSendingEmail] = useState(false);

  const schema = object().shape({
    phoneNumber: string().required(),
    message: string().required(),
    email: string().required(),
    name: string().required(),
    lastName: string().required(),
    company: string().required(),
  });

  const { register, handleSubmit, errors, reset } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const sendEmail = async (data) => {
    console.log('sendEmail', data);
    setLoadingSendingEmail(true);
    try {
      const { response, error } = await Fetch(
        `${config.serverUrl}/api/contact`,
        "POST",
        data
      );

      if (error) throw Error(error);

      reset({
        message: null,
        email: null,
        phoneNumber: null,
        name: null,
        lastName: null,
        company: null,
      });
    } catch (error) {
      sendError({ ...error, action: "sendEmail" });
    }
    setLoadingSendingEmail(false);
  };

  return (
    <ContactFormSection ref={props.refProp}>
      <div className="contact-form-section">
        <div className="title">
          ¿Deseas mayor información?
        </div>
        <div className="description">
          Deja tu consulta y nos pondremos en contacto con usted
        </div>
        <form onSubmit={handleSubmit(sendEmail)}>
          <Desktop>
            <div className="info-contact">
              <Input
                error={errors.name}
                type="text"
                ref={register}
                name="name"
                placeholder="Nombre"
              />
              <Input
                error={errors.lastName}
                type="text"
                ref={register}
                name="lastName"
                placeholder="Apellido"
              />
            </div>
          </Desktop>
          <Tablet>
            <Input
              error={errors.name}
              type="text"
              ref={register}
              name="name"
              placeholder="Nombre"
            />
            <Input
              error={errors.lastName}
              type="text"
              ref={register}
              name="lastName"
              placeholder="Apellido"
            />
          </Tablet>
          <Input
            error={errors.email}
            type="email"
            ref={register}
            name="email"
            placeholder="Correo electrónico"
          />

          <Desktop>
            <div className="info-contact">
              <Input
                error={errors.company}
                type="text"
                ref={register}
                name="company"
                placeholder="Empresa"
              />
              <Input
                error={errors.phoneNumber}
                type="text"
                ref={register}
                name="phoneNumber"
                placeholder="Número de teléfono"
              />
            </div>
          </Desktop>
          <Tablet>
            <Input
              error={errors.company}
              type="text"
              ref={register}
              name="company"
              placeholder="Empresa"
            />
            <Input
              error={errors.phoneNumber}
              type="text"
              ref={register}
              name="phoneNumber"
              placeholder="Número de teléfono"
            />
          </Tablet>
          <TextArea
            error={errors.message}
            name="message"
            ref={register}
            rows="10"
            placeholder="Déjanos tu consulta aquí"
          />
          <div className="submit-container">
            <ButtonAnt
              variant="contained"
              color="default"
              loading={loadingSendingEmail}
              disabled={loadingSendingEmail}
              htmlType="submit"
            >
              Enviar
            </ButtonAnt>
          </div>
        </form>
      </div>

    </ContactFormSection>
  );
};

const ContactFormSection = styled.section`
  position: relative;
  width: 100%;
  padding: 4rem 1rem 2rem 1rem;
  background: ${(props) => props.theme.basic.primary};

  .title {
    font-family: Lato, sans-serif;
    font-weight: 700;
    font-size: 22px;
    line-height: 26px;
    color: ${(props) => props.theme.basic.white};
    margin-bottom: 16px;
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
  .submit-container {
    text-align: center;
    button {
      display: inline-block;
    }

    ${mediaQuery.afterTablet} {
      text-align: left;
    }
  }

  form {
    max-width: 660px;
    input, textarea {
      padding-left: 24px;
      border-radius: 4px;
      margin: 7px 0;
      padding: 8px;
    }
    input {
      background: ${props => props.theme.basic.whiteDark};
      color: ${props => props.theme.basic.grayLight};;
    }
    textarea {
      margin-top: 0.5rem;
      width: 100%;
      background: ${props => props.theme.basic.whiteDark};
      color: ${props => props.theme.basic.grayLight};;
      border-radius: 6px;
      border: none;
      padding: 1rem;
      height: 100px;
    }

    .info-contact {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 1rem;
    }
  }

  ${mediaQuery.afterTablet} {
    padding: 2rem 4rem;

    .title {
      font-size: 34px;
      line-height: 41px;
    }
  }
`;
