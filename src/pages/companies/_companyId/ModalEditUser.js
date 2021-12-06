import React, { useState } from "reactn";
import styled from "styled-components";
import { darkTheme } from "../../../theme";
import { ModalContainer } from "../../../components/common/ModalContainer";
import { Image } from "../../../components/common/Image";
import { config } from "../../../firebase";
import { ButtonAnt } from "../../../components/form";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { Checkbox } from "antd";
import { useFetch } from "../../../hooks/useFetch";
import { useSendError } from "../../../hooks";
import { adsOptions } from "../../../components/common/DataList";
import { useRouter } from "next/router";

export const ModalEditUser = (props) => {
  const router = useRouter();

  const { Fetch } = useFetch();
  const { sendError } = useSendError();

  const { companyId } = router.query;

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);

  const schema = object().shape({
    role: string().required(),
  });

  const { handleSubmit, register, errors } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const editUsers = async (data) => {
    try {
      setLoading(true);

      const { error } = await Fetch(`${config.serverUrl}/api/companies/${companyId}/members`, "PUT", {
        members: props.selectedUsers,
        role: data.role,
        ads,
      });

      props.showNotification(
        error ? "ERROR" : "OK",
        error ? "Algo salió mal" : "Guardado!",
        error ? "error" : "success"
      );

      if (error) throw Error(error);
    } catch (error) {
      await sendError(error, "editUsers");
    }

    setLoading(false);
  };

  return (
    <ModalContainer
      background={darkTheme.basic.whiteLight}
      footer={false}
      closable={false}
      visible={props.isVisibleModalEditUser}
      padding="0"
    >
      <Content>
        <div className="top-container">
          <div className="title">Editar usuarios</div>
          <div className="close" onClick={() => props.setIsVisibleModalEditUser(false)}>
            <Image src={`${config.storageUrl}/resources/close.svg`} width="12px" height="12px" size="contain" />
          </div>
        </div>

        <form onSubmit={handleSubmit(editUsers)}>
          <div className="form-content">
            <div className="amount-users">Ha seleccionado ({props.selectedUsers.length}) miembros</div>
            <div className="role">
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
            <ButtonAnt color="default" onClick={() => props.setIsVisibleModalEditUser(false)}>
              Cerrar
            </ButtonAnt>
            <ButtonAnt color="secondary" htmlType="submit" loading={loading}>
              Guardar
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

  .form-content {
    padding: 1rem;

    .amount-users {
      font-family: Lato;
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 15px;
      color: ${(props) => props.theme.basic.blackDarken};
      margin: 0.5rem 0;
    }

    label {
      font-family: Lato;
      font-style: normal;
      font-weight: 600;
      font-size: 13px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.blackDarken};
    }

    .role {
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

  .footer {
    margin-top: 1rem;
    box-shadow: 1px 0px 4px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    height: 69px;
  }
`;
