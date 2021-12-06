import React, { useState } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../components/common/ModalContainer";
import { darkTheme } from "../../../theme";
import { Image } from "../../../components/common/Image";
import { config } from "../../../firebase";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { useFetch } from "../../../hooks/useFetch";
import { useSendError } from "../../../hooks";
import { ButtonAnt, Input, TextArea } from "../../../components/form";
import { Checkbox } from "antd";
import { adsOptions } from "../../../components/common/DataList";
import { useRouter } from "next/router";

export const ModalInvite = (props) => {
  const router = useRouter();

  const { Fetch } = useFetch();
  const { sendError } = useSendError();

  const { companyId } = router.query;

  const [loading, setLoading] = useState(false);
  const [ads, setAds] = useState([]);
  const [copied, setCopied] = useState(false);

  const schema = object().shape({
    role: string().required(),
    emails: string().required(),
  });

  const { handleSubmit, register, errors } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const inviteUsers = async (data) => {
    try {
      setLoading(true);

      const { error } = await Fetch(`${config.serverUrl}/api/companies/${companyId}/members`, "POST", {
        members: data.emails.split("\n"),
        role: data.role,
        ads,
      });

      props.showNotification(
        error ? "ERROR" : "OK",
        error ? "Algo salió mal" : "Guardado!",
        error ? "error" : "success"
      );

      if (error) throw Error(error);

      if (!error) props.setIsVisibleModalInvite(false);
    } catch (error) {
      await sendError(error, "inviteUsers");
    }

    setLoading(false);
  };

  return (
    <ModalContainer
      background={darkTheme.basic.whiteLight}
      footer={false}
      closable={false}
      visible={props.isVisibleModalInvite}
      padding="0"
    >
      <Content>
        <div className="top-container">
          <div className="title">Invitar usuarios</div>
          <div className="close" onClick={() => props.setIsVisibleModalInvite(false)}>
            <Image src={`${config.storageUrl}/resources/close.svg`} width="12px" height="12px" size="contain" />
          </div>
        </div>
        <form onSubmit={handleSubmit(inviteUsers)}>
          <div className="form-content">
            <div className="link">
              <label htmlFor="link">Invita con un enlace único para compartir</label>
              <div className="url">
                <Input
                  id="link"
                  type="url"
                  defaultValue={`www.ebombo.com/register/companies/${props.company.id}`}
                  disabled
                />
                <ButtonAnt
                  color={copied ? "success" : "primary"}
                  onClick={() => {
                    setCopied(true);
                    navigator.clipboard.writeText(`www.ebombo.com/register/companies/${props.company.id}`);
                  }}
                >
                  {copied ? "Copiado!" : "Copiar"}
                </ButtonAnt>
              </div>
            </div>

            <div className="emails">
              <label htmlFor="emails">Ingrese direcciones de correo electrónico (separados con salto de linea)</label>
              <TextArea
                id="emails"
                error={errors.emails}
                name="emails"
                ref={register}
                rows="5"
                placeholder="Escriba los correos"
              />
            </div>

            <div className="type-users">
              <label>Tipo de Usuarios</label>
              <div className="option">
                <input type="radio" name="role" value="member" ref={register} defaultChecked={true} />
                <p>Miembro</p>
              </div>
              <div className="option">
                <input type="radio" name="role" value="admin" ref={register} />
                <p>Admin.</p>
              </div>
            </div>

            <div className="note">
              *Te quedan
              <div className="amount">3</div>
              licencias (Admin.)
            </div>

            <div className="ads">
              <label>Ads on</label>
              <Checkbox.Group options={adsOptions} onChange={(checkedValue) => setAds(checkedValue)} />
            </div>
          </div>
          <div className="footer">
            <ButtonAnt color="default" onClick={() => props.setIsVisibleModalInvite(false)}>
              Cerrar
            </ButtonAnt>
            <ButtonAnt color="secondary" htmlType="submit" loading={loading}>
              Enviar invitación
            </ButtonAnt>
          </div>
        </form>
      </Content>
    </ModalContainer>
  );
};

const Content = styled.div`
  width: 100%;

  .top-container {
    height: 64px;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: Lato;

    .title {
      font-style: normal;
      font-weight: bold;
      font-size: 24px;
      line-height: 29px;
      color: ${(props) => props.theme.basic.blackDarken};
    }

    .close {
      cursor: pointer;
    }
  }

  .footer {
    margin-top: 1rem;
    box-shadow: 1px 0px 4px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    height: 69px;
  }

  form {
    .form-content {
      padding: 1rem;

      label {
        font-family: Lato;
        font-style: normal;
        font-weight: 600;
        font-size: 13px;
        line-height: 16px;
        color: ${(props) => props.theme.basic.blackDarken};
      }

      .link {
        .url {
          display: grid;
          align-items: center;
          grid-template-columns: auto auto;
          grid-gap: 1rem;
        }
      }

      .emails {
        margin-top: 1rem;
        textarea {
          color: ${(props) => props.theme.basic.blackDarken};
        }
      }

      .type-users {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        input {
          margin-left: 10px;
        }

        .option {
          display: flex;
          align-items: center;
        }

        p {
          font-family: Lato;
          font-style: normal;
          font-weight: normal;
          font-size: 12px;
          line-height: 15px;
          color: ${(props) => props.theme.basic.blackDarken};
          margin: 0 0 0 5px !important;
        }
      }

      .note {
        margin: 1rem 0 0 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-family: Lato;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 15px;
        color: ${(props) => props.theme.basic.blackDarken};

        .amount {
          width: 21px;
          height: 23px;
          border-radius: 4px;
          border: 1px solid ${(props) => props.theme.basic.grayLighten};
          background: ${(props) => props.theme.basic.whiteDarken};
          margin: 0 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: ${(props) => props.theme.basic.blackDarken};
        }
      }
    }
  }
`;
