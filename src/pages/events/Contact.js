import React, {useState} from "reactn";
import {config} from "../../firebase";
import {ButtonBombo, Input, TextArea} from "../../components";
import {Desktop} from "../../utils";
import styled from "styled-components";
import {mediaQuery} from "../../styles/constants";
import {message} from "antd";
import {object, string} from "yup";
import {useForm} from "react-hook-form";
import {useErrorHandler} from "react-error-boundary";
import {useOwnFetch} from "../../utils/useFetch/useFetch";
import {Image} from "../../components/common/Image";

export const Contact = (props) => {
    const handleError = useErrorHandler();
    const {ownFetch} = useOwnFetch();
    const [loadingSendingEmail, setLoadingSendingEmail] = useState(false);

    const schema = object().shape({
        phoneNumber: string().required(),
        message: string().required(),
        email: string().required(),
    });

    const {register, handleSubmit, errors, reset} = useForm({
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
            handleError({...error, action: "sendEmail"});
        }
    };

    return <ContactSection id="contact">
        <div className="content">
            <h2>¿Deseas mayor información?</h2>
            <p>Ponte en contacto con nosotros</p>

            <div
                className="company-info"
                onClick={() => window.open("https://wa.me/51945693597", "_blank")}
            >
                <img src={`${config.storageUrl}/resources/wsp-icon.svg`}
                     alt=""/>
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
        <BackgroundFooter src={`${config.storageUrl}/landing/footer-bg.svg`}/>
        <div className="cabin">
            <Image
                src={`${config.storageUrl}/landing/cabin.svg`}
                height={"100%"}
                width={"100%"}
            />
        </div>
        <div className="tree-duo">
            <Image
                src={`${config.storageUrl}/landing/tree-duo.svg`}
                height={"100%"}
                width={"100%"}
            />
        </div>
        <div className="tree-trio">
            <Image
                src={`${config.storageUrl}/landing/tree-trio.svg`}
                height={"100%"}
                width={"100%"}
            />
        </div>
        <div className="moon">
            <Image
                src={`${config.storageUrl}/landing/moon2.svg`}
                height={"100%"}
                width={"100%"}
            />
        </div>
        <div className="balloons">
            <Image
                src={`${config.storageUrl}/landing/balloons.svg`}
                height={"100%"}
                width={"100%"}
            />
        </div>
        <div className="people">
            <Image
                src={`${config.storageUrl}/landing/people.svg`}
                height={"100%"}
                width={"100%"}
            />
        </div>
        <div className="light-circle">
            <Image
                src={`${config.storageUrl}/landing/light-circle.svg`}
                height={"100%"}
                width={"100%"}
                bgPosition={"center left"}
                size={"cover"}
            />
        </div>
    </ContactSection>;
};

const BackgroundFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80%;
  z-index: 2;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  
  ${mediaQuery.afterTablet}{
    height: 70%;
  }
`

const ContactSection = styled.section`
  padding: 300px 1rem 1rem;
  background: transparent;
  position: relative;
  width: 100%;

  .light-circle{
    position: absolute;
    height: 50%;
    z-index: 1;
    bottom: 69%;
    right: 0;
    width: 50%;
    ${mediaQuery.afterTablet}{
      top: 0%;
      left: 5%;
      right: auto;
      width: 15%;
      height: auto;
      bottom: auto;
    }
  }
  
  .people{
    position: absolute;
    bottom: 65%;
    right: 40%;
    width: 15%;
    height: auto;
    z-index: 3;
    ${mediaQuery.afterTablet}{
      width: 10%;
      bottom: 50%;
    }
  }
  
  .balloons{
    position: absolute;
    top: 5%;
    left: 35%;
    width: 15%;
    height: auto;
    z-index: 3;
    ${mediaQuery.afterTablet}{
      width: 10%;
    }
  }

  .moon{
    position: absolute;
    top: 0;
    right: 5%;
    width: 15%;
    height: auto;
    z-index: 3;
    ${mediaQuery.afterTablet}{
      width: 10%;
    }
  }
  
  .cabin {
    position: absolute;
    bottom: 70%;
    left: 10%;
    width: 20%;
    height: auto;
    z-index: 3;
    ${mediaQuery.afterTablet}{
      width: 12%;
      bottom: 50%;
    }
  }
  
  .tree-duo{
    position: absolute;
    bottom: 60%;
    left: 5%;
    width: 20%;
    height: auto;
    z-index: 3;
    ${mediaQuery.afterTablet}{
      width: 15%;
      bottom: 40%;
    }
  }
  
  .tree-trio{
    position: absolute;
    bottom: 62%;
    right: 5%;
    width: 18%;
    height: auto;
    z-index: 3;
    ${mediaQuery.afterTablet}{
      width: 12%;
      bottom: 30%;
    }
  }

  ${mediaQuery.afterTablet} {
    padding: 750px 3rem 3rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1rem;
  }

  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 999;
  }

  .content {
    width: 100%;
    position: relative;
    z-index: 999;

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
`;
