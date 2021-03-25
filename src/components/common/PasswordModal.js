import React, {useGlobal} from "reactn";
import {ModalContainer} from "./ModalContainer";
import {ButtonBombo, Input} from "./index";
import styled from "styled-components";
import {object, string} from "yup";
import {useForm} from "react-hook-form";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import {useHistory} from "react-router";
import {message} from "antd";
import moment from "moment";

export const PasswordModal = () => {
  const history = useHistory();

  const validationSchema = object().shape({
    password: string().required(),
  });

  const [currentTournament, setCurrentTournament] = useGlobal(
    "currentTournament"
  );
  const [isVisiblePasswordModal, setIsVisiblePasswordModal] = useGlobal(
    "isVisiblePasswordModal"
  );
  const [, setOpenSidebarMenuLeft] = useGlobal("openSidebarMenuLeft");

  const { register, errors, handleSubmit } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });

  const validatePassword = (data) => {
    if (currentTournament.password === data.password) {
      let localTournaments = defaultTo(
        JSON.parse(localStorage.getItem("tournaments")),
        []
      );

      localTournaments.push({
        id: currentTournament.id,
        password: currentTournament.password,
      });

      localStorage.setItem("tournaments", JSON.stringify(localTournaments));

      setIsVisiblePasswordModal(false);
      setOpenSidebarMenuLeft(false);

      if (window.location.pathname.includes("brief")) return;

      return currentTournament.eventType === "league" &&
        moment().isAfter(currentTournament.inscriptionDate.toDate())
        ? history.push(
            `/games/${currentTournament.game.id}/consoles/${currentTournament.console.id}/leagues/${currentTournament.id}/matches`
          )
        : currentTournament.name.toLowerCase().includes("ulima")
        ? history.push(`/brief/${currentTournament.id}`)
        : history.push(
            `/games/${currentTournament.game.id}/consoles/${currentTournament.console.id}/tournaments/${currentTournament.id}`
          );
    }
    message.error("Contraseña incorrecta", 3);
  };

  return (
    <ModalContainer
      footer={null}
      visible={isVisiblePasswordModal}
      onCancel={async () => {
        await setCurrentTournament(null);
        await setIsVisiblePasswordModal(false);
      }}
    >
      <PasswordContainer>
        <div className="title">
          Ingrese la contraseña{" "}
          {get(currentTournament, "eventType", "") === "tournament"
            ? "del torneo"
            : "de la liga"}
        </div>
        <div className="content-item">
          <form onSubmit={handleSubmit(validatePassword)}>
            <Input
              variant="primary"
              error={errors.password}
              ref={register}
              type="password"
              name="password"
              defaultValue=""
            />
            <ButtonBombo htmlType="submit" width="30%" fontWeight="normal">
              Entrar
            </ButtonBombo>
          </form>
        </div>
      </PasswordContainer>
    </ModalContainer>
  );
};

const PasswordContainer = styled.div`
  padding: 20px;

  .title {
    text-align: center;
    font-size: 15px;
    margin: 1rem 0;
  }

  .content-item {
    margin-bottom: 10px;

    .danger {
      color: ${(props) => props.theme.basic.danger};
    }
  }
`;
