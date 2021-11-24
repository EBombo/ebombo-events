import React, { useEffect, useGlobal, useState, useRef } from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { ButtonAnt, Input } from "../../../components/form";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { mediaQuery } from "../../../constants";

export const ResetPassword = (props) => {
  const [authUser] = useGlobal("user");

  const [loading, setLoading] = useState(false);

  const schema = object().shape({
    lastPassword: string().required(),
    password: string().required(),
    passwordConfirm: string().required(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const savePassword = async (data) => {
    if(data.password !== data.passwordConfirm)
      return props.showNotification("ERROR", "Las contraseñas no coinciden")

    //TODO: create function that updates the firebase password (this will only word if u are register with email and password)
  };

  return (
    <ResetContainer>
      <div className="content">
        <div className="title">Cambiar contraseña</div>

        <form onSubmit={handleSubmit(savePassword)}>
          <label htmlFor="password">Antigua contraseña</label>
          <Input
            type="password"
            id="lastPassword"
            name="lastPassword"
            variant="primary"
            error={errors.lastPassword}
            ref={register}
            autoComplete="off"
            defaultValue={get(props, "user.lastPassword", "")}
            disabled={authUser.id !== props.user.id}
          />

          <label htmlFor="password">Nueva contraseña</label>
          <Input
            type="password"
            id="password"
            name="password"
            variant="primary"
            error={errors.password}
            ref={register}
            autoComplete="off"
            defaultValue={get(props, "user.password", "")}
            disabled={authUser.id !== props.user.id}
          />

          <label htmlFor="passwordConfirm">Repetir contraseña</label>
          <Input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            variant="primary"
            error={errors.passwordConfirm}
            ref={register}
            autoComplete="off"
            defaultValue={get(props, "user.passwordConfirm", "")}
            disabled={authUser.id !== props.user.id}
          />

          <ButtonAnt
            color="secondary"
            htmlType="submit"
            disabled={loading || authUser.id !== props.user.id}
            loading={loading}
            className="btn-submit"
          >
            Guardar
          </ButtonAnt>
        </form>
      </div>
    </ResetContainer>
  );
};

const ResetContainer = styled.div`
  width: 100%;

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 19px;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid ${(props) => props.theme.basic.grayLighten};
  }

  form {
    padding: 1rem;

    .btn-submit {
      margin: 1rem 0 auto auto;
    }

    input {
      margin-bottom: 0.5rem;
    }
  }
  
  ${mediaQuery.afterTablet}{
    border-radius: 8px;
    background: ${(props) => props.theme.basic.whiteLight};
    padding: 1rem 1rem 5rem 1rem;
    
    .content{
      background: ${(props) => props.theme.basic.whiteLigth};
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 2px;
      padding: 10px;
      max-width: 380px;
    }
  }
`;
