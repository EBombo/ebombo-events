import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { ButtonAnt, Input } from "../../../components/form";
import { object, ref, string } from "yup";
import { useForm } from "react-hook-form";
import { mediaQuery } from "../../../constants";
import { auth, firebase } from "../../../firebase";
import { useSendError } from "../../../hooks";
import { useRouter } from "next/router";

export const ResetPassword = (props) => {
  const [authUser] = useGlobal("user");

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { sendError } = useSendError();

  useEffect(() => {
    if (!authUser) router.push("/");
  }, [authUser]);

  const schema = object().shape({
    currentPassword: string().required(),
    password: string().required(),
    passwordConfirm: string().oneOf([ref("password"), null], "Las contraseñas deben coincidir."),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const savePassword = async (data) => {
    setLoading(true);
    try {
      await reauthenticate(data.currentPassword);

      const user = auth.currentUser;

      await user.updatePassword(data.password);

      props.showNotification("Success", "Se ha actualizado la contraseña", "success");
    } catch (error) {
      sendError(error, "savePassword");
    } finally {
      setLoading(false);
    }
  };

  const reauthenticate = async (currentPassword) => {
    const user = auth.currentUser;
    const cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    return await user.reauthenticateWithCredential(cred);
  };

  return (
    <ResetContainer>
      <div className="content">
        <div className="title">Cambiar contraseña</div>

        <form onSubmit={handleSubmit(savePassword)}>
          <label htmlFor="password">Antigua contraseña</label>
          <Input
            type="password"
            id="currentPassword"
            name="currentPassword"
            variant="primary"
            error={errors.currentPassword}
            ref={register}
            autoComplete="off"
            defaultValue={get(props, "user.currentPassword", "")}
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

  ${mediaQuery.afterTablet} {
    border-radius: 8px;
    background: ${(props) => props.theme.basic.whiteLight};
    padding: 1rem 1rem 5rem 1rem;

    .content {
      background: ${(props) => props.theme.basic.whiteLigth};
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 2px;
      padding: 10px;
      max-width: 380px;
    }
  }
`;
