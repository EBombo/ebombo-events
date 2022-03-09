import React, { useState } from "reactn";
import { config } from "../../firebase";
import { ButtonAnt, Input, TextArea } from "../../components/form";
import styled from "styled-components";
import { Desktop, mediaQuery } from "../../constants";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { useFetch } from "../../hooks/useFetch";
import { useSendError } from "../../hooks";
import { BannerEbombo } from "../home/BannerEbombo";

export const ContactForm = (props) => {
  const { Fetch } = useFetch();
  const { sendError } = useSendError();

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
    setLoadingSendingEmail(true);
    try {
      const { error } = await Fetch(`${config.serverUrl}/api/contact`, "POST", data);

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
      sendError({ error, action: "sendEmail" });
    }
    setLoadingSendingEmail(false);
  };

  return (
    <>
      <ContactFormSection ref={props.refProp} config={config}>
        <div className="px-8 py-4 md:py-8 md:px-12">
          <div className="title">¡Contáctanos!</div>

          <div className="description">
            Deja tu consulta y el nuestro equipo de ventas se pondrá en contacto contigo.
          </div>

          <form onSubmit={handleSubmit(sendEmail)}>
            <div className="info-contact">
              <Input error={errors.name} type="text" ref={register} name="name" placeholder="Nombre" />
              <Input error={errors.lastName} type="text" ref={register} name="lastName" placeholder="Apellido" />
            </div>

            <Input error={errors.email} type="email" ref={register} name="email" placeholder="Correo electrónico" />

            <div className="info-contact">
              <Input error={errors.company} type="text" ref={register} name="company" placeholder="Empresa" />
              <Input
                error={errors.phoneNumber}
                type="text"
                ref={register}
                name="phoneNumber"
                placeholder="Número de teléfono"
              />
            </div>
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
        <Desktop>
          <div className="grid h-full w-full">
            <div className="img-contact" />
          </div>
        </Desktop>
      </ContactFormSection>
      <BannerEbombo />
    </>
  );
};

const ContactFormSection = styled.section`
  width: 100%;
  display: grid;
  position: relative;
  grid-template-columns: 1fr;
  background: ${(props) => props.theme.basic.white};

  .title {
    font-family: Lato, sans-serif;
    font-weight: 700;
    font-size: 22px;
    line-height: 26px;
    color: ${(props) => props.theme.basic.secondary};
    margin-bottom: 16px;
    font-style: normal;
  }

  .description {
    font-family: Lato;
    font-style: normal;
    font-weight: 100;
    font-size: 18px;
    line-height: 22px;
    color: ${(props) => props.theme.basic.secondary};
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

    input,
    textarea {
      padding-left: 24px;
      border-radius: 4px;
      margin: 7px 0;
      padding: 8px;
    }

    input {
      background: ${(props) => props.theme.basic.whiteDark};
      color: ${(props) => props.theme.basic.grayLight};
    }

    textarea {
      margin-top: 0.5rem;
      width: 100%;
      background: ${(props) => props.theme.basic.whiteDark};
      color: ${(props) => props.theme.basic.grayLight};
      border-radius: 6px;
      border: none;
      padding: 1rem;
      height: 100px;
    }
  }

  .img-contact {
    align-self: center;
    height: 80%;
    background-image: url(${`${config.storageUrl}/resources/event.svg`});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: right;
  }

  ${mediaQuery.afterTablet} {
    grid-template-columns: 1fr 1fr;

    .title {
      font-size: 34px;
      line-height: 41px;
    }

    .info-contact {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 1rem;
    }
  }
`;
