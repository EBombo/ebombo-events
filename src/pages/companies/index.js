import React, {useGlobal, useState} from "reactn";
import styled from "styled-components";
import {Desktop, Tablet} from "../../utils";
import {config} from "../../firebase";
import {services} from "../../components/common/DataList";
import {mediaQuery} from "../../styles/constants";
import {useForm} from "react-hook-form";
import {object, string} from "yup";
import {ButtonBombo, Input, TextArea} from "../../components";
import {message} from "antd";
import {Footer} from "../../components/Footer";
import {useHistory} from "react-router-dom";
import {useErrorHandler} from "react-error-boundary";
import {useOwnFetch} from "../../utils/useFetch/useFetch";

export default (props) => {
  const history = useHistory();

  const [landing] = useGlobal("landing");

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

  const currentElement = (elementType) =>
    landing.filter((landing) => landing.elementType === elementType);

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
    <>
      <HeaderSection>
        <div className="menu-left-content">
          <ul>
            <li onClick={() => history.push("/")}>
              <img
                src={`${config.storageUrl}/resources/b2bLanding/b2bLogo.svg`}
                alt=""
              />
            </li>
            <li>
              <a href="#us">Nosotros</a>
            </li>
            <li>
              <a href="#clients">Clientes</a>
            </li>
            <li>
              <a href="#contact">Contacto</a>
            </li>
          </ul>
          <div className="b2b-description">
            <div>
              <h3>
                Organizamos torneos, eventos e integraciones virtuales para
                empresas corporativas
              </h3>
              <p>
                Somos la solución perfecta para eventos, integraciones o torneos
                virutales de todo tipo para tu compañia. Contamos con la
                experiencia necesaria para proveer o moderar lo que necesites
                para tus colaboradores de manera virtual o presencial. Lo que
                necesites lo podemos hacer
                <br />
                *No estamos haciendo eventos prescenciales por el momento debido
                al Covid-19
              </p>
            </div>
          </div>
        </div>
        <div className="menu-right-content">
          <img
            src={`${config.storageUrl}/resources/b2bLanding/people.svg`}
            alt=""
          />
        </div>
      </HeaderSection>
      <ServiceSection id="us">
        <h2>Nuestros Servicios</h2>
        <h3>
          Somos una empresa de eventos, integraciones y torneos virtuales para
          empresas y comunidades
        </h3>
        <div className="services-container">
          {services.map((service) => (
            <ServiceContent
              borderColor={service.color}
              key={`key-services-${service.title}`}
            >
              <div className="border-section">
                <img src={service.logoUrl} alt="" />
                <h4>{service.title}</h4>
                <p>{service.text}</p>
              </div>
              <img className="absolute-image" src={service.imageUrl} alt="" />
            </ServiceContent>
          ))}
        </div>
      </ServiceSection>
      <GamesSection>
        <div>
          <h4>Estos son algunos de los muchos juegos que ofrecemos</h4>
          <img
            src={`${config.storageUrl}/resources/b2bLanding/games.svg`}
            alt=""
          />
        </div>
        <div className="divider" />
        <div>
          <h4>Cuéntanos el tipo de evento que deseas hacer y te ayudaremos</h4>
          <img
            src={`${config.storageUrl}/resources/b2bLanding/typeEvent.svg`}
            alt=""
          />
        </div>
      </GamesSection>
      <CompaniesSection id="clients">
        <h2>Empresas con las que hemos trabajado</h2>
        <div className="companies">
          {currentElement("companies").map((company, index) => (
            <img
              src={company.companyImageUrlThumb}
              key={`key-companies-${index}`}
            />
          ))}
        </div>
      </CompaniesSection>
      <ImageSection>
        <Desktop>
          <img
            src={`${config.storageUrl}/resources/b2bLanding/horizontalHouse.svg`}
            alt=""
          />
        </Desktop>
        <Tablet>
          <img
            src={`${config.storageUrl}/resources/b2bLanding/verticalHouse.svg`}
            alt=""
          />
        </Tablet>
      </ImageSection>
      <ContactSection id="contact">
        <div className="content">
          <h2>¿Deseas mayor información?</h2>
          <p>Ponte en contacto con nosotros</p>

          <div
            className="company-info"
            onClick={() => window.open("https://wa.me/51945693597", "_blank")}
          >
            <img src={`${config.storageUrl}/resources/wsp-icon.svg`} alt="" />
            <span>+51 945 693 597</span>
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
      <FooterSection>
        <Footer marginLeft={"0"} />
      </FooterSection>
    </>
  );
};

const HeaderSection = styled.section`
  width: 100%;
  padding: 2rem 1rem 6rem 1rem;
  background: rgb(82, 216, 152);
  background: linear-gradient(
    180deg,
    rgba(82, 216, 152, 1) 0%,
    rgba(82, 216, 152, 1) 49%,
    rgba(255, 255, 255, 1) 100%
  );

  ${mediaQuery.afterTablet} {
    background: ${(props) => props.theme.basic.primary};
    display: grid;
    grid-template-columns: 60% auto;
  }

  .menu-left-content {
    ${mediaQuery.afterTablet} {
      padding: 2rem 3rem;
    }

    max-width: 100%;

    ul {
      list-style-type: none;
      display: flex;
      justify-content: space-between;

      ${mediaQuery.afterTablet} {
        width: 60%;
        padding-bottom: 2rem;
      }

      li {
        a {
          margin: 0 10px;
          font-style: normal;
          font-weight: 600;
          font-size: 17px;
          line-height: 24px;
          color: ${(props) => props.theme.basic.blackDarken};
        }
      }
    }

    .b2b-description {
      display: flex;
      align-items: center;
      height: 100%;

      div {
        h3 {
          font-weight: bold;
          margin-bottom: 10px !important;
          font-size: 21px;
          line-height: 25px;

          ${mediaQuery.afterTablet} {
            font-size: 25px;
            line-height: 30px;
          }
        }

        p {
          font-weight: normal;
          font-size: 13px;
          line-height: 16px;

          ${mediaQuery.afterTablet} {
            font-size: 16px;
            line-height: 17px;
          }
        }
      }
    }
  }

  .menu-right-content {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 70%;
    }
  }
`;

const ServiceSection = styled.section`
  padding: 1rem;
  background: ${(props) => props.theme.basic.white};
  position: relative;

  ${mediaQuery.afterTablet} {
    padding: 3rem;
  }

  h2 {
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    line-height: 30px;
  }

  h3 {
    margin-top: 1rem !important;
    text-align: center;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;

    ${mediaQuery.afterTablet} {
      margin-top: 2rem !important;
      font-size: 24px;
      line-height: 30px;
    }
  }

  .services-container {
    ${mediaQuery.afterTablet} {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 2rem;
    }
  }
`;

const GamesSection = styled.section`
  background: ${(props) => props.theme.basic.white};

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 1fr 5px 1fr;
    grid-gap: 1rem;
  }

  div {
    text-align: center;

    h4 {
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 19px;
      margin-bottom: 1rem !important;
      text-decoration: underline;
      text-decoration-color: ${(props) => props.theme.basic.primary};
      text-decoration-thickness: 3px;
      text-underline-position: under;

      ${mediaQuery.afterTablet} {
        font-size: 21px;
        line-height: 24px;
      }
    }

    img {
      margin: 1rem 0 !important;
      max-width: 90%;
    }
  }

  .divider {
    height: 80%;
    background: #c4c4c4;
    border-radius: 1px;
  }
`;

const ServiceContent = styled.div`
  margin: 2rem 0 !important;
  position: relative;

  .border-section {
    height: 100%;
    padding: 1rem;
    border-top: 4px solid ${(props) => props.borderColor};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.4);
    width: 90%;

    h4 {
      margin: 1rem 0 !important;
      text-align: left;
      font-weight: bold;
      font-size: 15px;
      line-height: 19px;
    }

    p {
      width: 70%;
    }
  }

  .absolute-image {
    position: absolute;
    right: 0;
    top: 15%;
  }
`;

const CompaniesSection = styled.section`
  padding: 1rem;
  background: #d0e4e8;
  color: ${(props) => props.theme.basic.white};

  ${mediaQuery.afterTablet} {
    padding: 3rem;
  }

  h2 {
    color: ${(props) => props.theme.basic.black};
    margin-bottom: 2rem !important;
    text-align: center;
    font-weight: bold;
    font-size: 21px;
    line-height: 25px;

    ${mediaQuery.afterTablet} {
      font-size: 24px;
      line-height: 30px;
    }
  }

  .companies {
    padding: 1rem 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1rem;
    align-items: center;
    justify-content: center;

    ${mediaQuery.afterTablet} {
      grid-template-columns: repeat(4, 1fr);
    }

    img {
      border-radius: 3px;
      height: auto;
      margin: 0 auto !important;
      width: 90%;

      ${mediaQuery.afterTablet} {
        width: 80%;
        height: auto;
      }
    }
  }
`;

const ImageSection = styled.section`
  background: #d0e4e8;
  height: 50vh;

  img {
    width: 100%;
    height: 100%;
  }
`;

const ContactSection = styled.section`
  padding: 1rem;
  background: #ededed;

  ${mediaQuery.afterTablet} {
    padding: 3rem;
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
      color: #004077;
      font-size: 15px;
      line-height: 19px;

      ${mediaQuery.afterTablet} {
        font-size: 24px;
        line-height: 30px;
      }
    }

    p {
      font-style: normal;
      color: #004077;
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
        color: #004077;
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

const FooterSection = styled.section`
  width: 100%;
`;
