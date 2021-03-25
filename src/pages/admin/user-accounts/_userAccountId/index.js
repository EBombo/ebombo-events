import React, { useEffect, useGlobal, useState } from "reactn";
import { useHistory, useParams } from "react-router";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import defaultTo from "lodash/defaultTo";
import { Checkbox, Col, Divider, message, Row, Select } from "antd";
import styled from "styled-components";
import { firestore } from "../../../../firebase";
import { spinLoader } from "../../../../utils";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { ButtonBombo, Input } from "../../../../components/common";
import moment from "moment";

const newUserAccount = {
  name: "",
  description: "",
  consolesIds: [],
  gamesIds: [],
  deleted: false,
};

export default () => {
  const schema = object().shape({
    name: string().required(),
    description: string().required(),
  });

  const { userAccountId } = useParams();
  const history = useHistory();

  const [games] = useGlobal("games");
  const [consoles] = useGlobal("consoles");

  const [selectedRenderer, setSelectedRenderer] = useState("games");

  const [gamesValues, setGamesSelected] = useState({
    gamesSelected: [],
    isChange: false,
  });

  const [consolesValues, setConsolesSelected] = useState({
    consolesSelected: [],
    isChange: false,
  });

  const [loadingUserAccount, setLoadingUserAccount] = useState(true);
  const [loadingCouponButton, setLoadingCouponButton] = useState(false);
  const [userAccount, setUserAccount] = useState({});
  const { register, errors, handleSubmit, control } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    fetchUserAccount();
  }, []);

  const fetchUserAccount = async () => {
    if (userAccountId === "new") {
      const new_id = firestore.collection("userAccounts").doc().id;
      setUserAccount({ ...newUserAccount, id: new_id });
    } else {
      const userAccountRef = await firestore
        .collection("userAccounts")
        .doc(userAccountId)
        .get();

      if (!userAccountRef.exists) return history.push("/notFound");

      const userAccount_ = userAccountRef.data();

      setUserAccount(userAccount_);
      setSelectedRenderer(
        isEmpty(userAccount_.consoleIds) ? "games" : "consoles"
      );
    }
    setLoadingUserAccount(false);
  };

  const saveUserAccount = async (data) => {
    setLoadingCouponButton(true);
    try {
      let currentUserAccount = mapUserAccount(data);

      if (userAccountId !== "new")
        currentUserAccount = {
          ...currentUserAccount,
          updateAt: moment().toDate(),
        };

      await firestore
        .collection("userAccounts")
        .doc(userAccount.id)
        .set({ ...currentUserAccount });

      message.success("Se realizó la operación correctamente", 5);
      history.goBack();
    } catch (error) {
      console.error(error);
      message.error("Algo salio mal, intente nuevamente", 5);
    }
    setLoadingCouponButton(false);
  };

  const mapUserAccount = (data) => ({
    id: userAccount.id,
    gameIds:
      selectedRenderer === "games"
        ? gamesValues.isChange
          ? gamesValues.gamesSelected
          : get(userAccount, "gameIds", [])
        : [],
    consoleIds:
      selectedRenderer === "consoles"
        ? consolesValues.isChange
          ? consolesValues.consolesSelected
          : get(userAccount, "consoleIds", [])
        : [],
    name: data.name.toUpperCase().trim(),
    description: data.description.toUpperCase().trim(),
    deleted: userAccount.deleted,
    createAt: userAccount.createAt ? userAccount.createAt : moment().toDate(),
    updateAt: userAccount.updateAt ? userAccount.updateAt : moment().toDate(),
  });

  const games_ = () => defaultTo(games, []);

  const consoles_ = () => defaultTo(consoles, []);

  const onChangeConsoles = (checkedValues) =>
    setConsolesSelected({
      consolesSelected: checkedValues,
      isChange: true,
    });

  const onChangeGames = (checkedValues) =>
    setGamesSelected({
      gamesSelected: checkedValues,
      isChange: true,
    });

  return loadingUserAccount ? (
    spinLoader()
  ) : (
    <UserAccountContainer>
      <h2 className="title-information-user">
        Información de la Cuenta de Usuario
      </h2>
      <Divider />
      <form onSubmit={handleSubmit(saveUserAccount)} noValidate>
        <Input
          variant="secondary"
          error={errors.name}
          required
          label="Nombre"
          type="text"
          autoComplete="on"
          ref={register}
          name="name"
          defaultValue={get(userAccount, "name", "")}
          placeholder="Nombre"
        />
        <Input
          variant="secondary"
          error={errors.description}
          required
          label="Descripción"
          type="text"
          autoComplete="on"
          ref={register}
          name="description"
          defaultValue={get(userAccount, "description", "")}
          placeholder="Descripción"
        />
        <div className="description">Seleccione Juego o Consola</div>
        <Select
          onChange={(value) => setSelectedRenderer(value)}
          defaultValue={selectedRenderer}
          placeholder="Seleccione"
        >
          <Select.Option value="consoles">consolas</Select.Option>
          <Select.Option value="games">Juegos</Select.Option>
        </Select>
        <br />
        <br />
        {selectedRenderer === "consoles" ? (
          <>
            <div className="description">Consolas</div>
            <br />
            <Checkbox.Group
              style={{ width: "100%" }}
              onChange={onChangeConsoles}
              defaultValue={get(userAccount, "consoleIds", [])}
            >
              <Row>
                {consoles_().map((console_) => (
                  <Col span={8} key={console_.id}>
                    <Checkbox value={console_.id}>{console_.name}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
            <br />
            <br />
          </>
        ) : (
          selectedRenderer === "games" && (
            <>
              <div className="description">Juegos</div>
              <br />
              <Checkbox.Group
                style={{ width: "100%" }}
                onChange={onChangeGames}
                defaultValue={get(userAccount, "gameIds", [])}
              >
                <Row>
                  {games_().map((game_) => (
                    <Col span={8} key={game_.id}>
                      <Checkbox value={game_.id}>{game_.name}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
              <br />
              <br />
            </>
          )
        )}
        <div style={{ display: "flex" }}>
          <ButtonBombo
            type="secondary"
            onClick={() => history.goBack()}
            disabled={loadingCouponButton}
          >
            CANCELAR
          </ButtonBombo>
          <ButtonBombo
            type="primary"
            loading={loadingCouponButton}
            style={{ marginLeft: "10px" }}
            disabled={loadingCouponButton}
            htmlType="submit"
          >
            GUARDAR
          </ButtonBombo>
        </div>
      </form>
    </UserAccountContainer>
  );
};

const UserAccountContainer = styled.div`
  width: 100%;
`;
