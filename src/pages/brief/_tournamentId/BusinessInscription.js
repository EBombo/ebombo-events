import React, {useGlobal, useState} from "reactn";
import {FormCss} from "./CompleteInscription";
import {object, string} from "yup";
import {useParams} from "react-router-dom";
import {useHistory} from "react-router";
import {config} from "../../../firebase";
import {Controller, useForm} from "react-hook-form";
import UrlAssembler from "url-assembler";
import get from "lodash/get";
import {ButtonBombo, Input, Select} from "../../../components";
import {careers, companyDepartments,} from "../../../components/common/DataList";
import {useOwnFetch} from "../../../utils/useFetch/useFetch";
import {useSendError} from "../../../components/error-fallback/useSendError";

export const BusinessInscription = (props) => {
  const schema = object().shape({
    name: string().required(),
    lastName: string().required(),
    studentId: string(),
    career: string(),
    department: string(),
  });

  const { tournamentId } = useParams();
  const history = useHistory();

  const [authUser] = useGlobal("user");
  const [, setIsVisibleLoginModal] = useGlobal("isVisibleLoginModal");
  const [loadingInscription, setLoadingInscription] = useState(false);

  const { ownFetch } = useOwnFetch();
  const { sendError } = useSendError();

  const { register, handleSubmit, errors, control } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const userInscription = async (data) => {
    try {
      if (!props.validatePassword()) return;

      if (!authUser) return setIsVisibleLoginModal(true);

      if (
        get(props, "tournament.realMoney", true) &&
        get(authUser, "money", 0) < get(props, "tournament.entryCost", null)
      )
        return props.showNotification(
          "Dinero insufiente",
          "Para poder inscribirte al torneo debes recargar."
        );

      setLoadingInscription(true);
      console.log(data);
      await ownFetch(urlApiInscription(), "PUT", data);

      history.push(
        `/games/${props.tournament.game.id}/consoles/${props.tournament.console.id}/tournaments/${tournamentId}`
      );
    } catch (error) {
      props.showNotification(
        "ERROR",
        get(error, "statusText", "Algo salio mal,intentalo nuevamente")
      );
      await sendError({ ...error, action: "userInscription" });
    }
    setLoadingInscription(false);
  };

  const urlApiInscription = () =>
    new UrlAssembler(`${config.serverUrl}`)
      .template("/tournaments/:tournamentId/users/:userId/brief")
      .param({
        tournamentId: tournamentId,
        userId: authUser.id,
      })
      .toString();

  return (
    <FormCss onSubmit={handleSubmit(userInscription)} noValidate>
      <div>
        <div>¡Hola!</div>
        <div>
          Por favor completa el siguiente formulario para inscribirte en el
          torneo
        </div>
        <br />
        <Input
          variant="primary"
          placeholder="Nombre"
          label="Nombre"
          ref={register}
          name="name"
          defaultValue={get(authUser, "name")}
          error={errors.name}
        />
        <Input
          variant="primary"
          placeholder="Apellido"
          label="Apellido"
          ref={register}
          name="lastName"
          error={errors.lastName}
          defaultValue={get(authUser, "lastName")}
        />
        {get(props, "tournament.linkType", "") === "university" && (
          <>
            <Input
              variant="primary"
              placeholder="Código de alumno"
              label="Código de alumno"
              ref={register}
              name="studentId"
              error={errors.studentId}
            />
            <Controller
              name="career"
              control={control}
              as={
                <Select
                  label="Carrera"
                  placeholder="Carrera"
                  showSearch
                  error={errors.career}
                  optionFilterProp="children"
                  optionsdom={careers.map((career) => ({
                    key: career.value,
                    code: career.value,
                    name: career.name,
                  }))}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  marginBottom="0.5rem"
                />
              }
            />
          </>
        )}
        {get(props, "tournament.linkType", "") === "business" && (
          <Controller
            name="deparment"
            control={control}
            as={
              <Select
                label="Area"
                placeholder="Area"
                showSearch
                error={errors.career}
                optionFilterProp="children"
                optionsdom={companyDepartments.map((deparment) => ({
                  key: deparment.value,
                  code: deparment.value,
                  name: deparment.name,
                }))}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                marginBottom="0.5rem"
              />
            }
          />
        )}
        {props.children}
        <ButtonBombo
          primary="true"
          htmlType="submit"
          margin="10px 0"
          disabled={
            loadingInscription ||
            get(props, "tournament.playerIds", []).includes(authUser.id)
          }
          loading={loadingInscription}
        >
          Inscribirme
        </ButtonBombo>
      </div>
    </FormCss>
  );
};
