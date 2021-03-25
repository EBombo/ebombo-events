import {message} from "antd";
import {firestore} from "../../../../../../../../firebase";
import React, {useState} from "react";
import moment from "moment";
import {Controller, useForm} from "react-hook-form";
import {ButtonBombo, DatePicker} from "../../../../../../../../components";
import {date, object} from "yup";
import {finishTimeByRule} from "../../../../../../../../utils";

export const ModalAdminGroupMatchDateEdit = (props) => {
  const schema = object().shape({
    createAt: date().required(),
  });

  const [isSavingMatchTime, setIsSavingMatchTime] = useState(false);

  const { errors, handleSubmit, control } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const mapLobby = (data) => ({
    createAt: data.createAt,
    updateAt: new Date(),
  });

  const saveMatchTime = async (data) => {
    try {
      setIsSavingMatchTime(true);

      let currentLobby = mapLobby(data);

      const matchesPromises = props.matches.map(async (match) => {
        await firestore.doc("matches/" + match.id).set(
          {
            ...currentLobby,
            finishAt: finishTimeByRule(match.rule, data.createAt),
          },
          { merge: true }
        );
      });

      await Promise.all(matchesPromises);

      message.success("Se realizó la operación correctamente", 5);

      props.fetchMatchesPerGroup();
    } catch (error) {
      console.error(error);
      message.error("Algo salio mal, intente nuevamente", 5);
    }
    setIsSavingMatchTime(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(saveMatchTime)} noValidate>
        <div>
          <Controller
            name="createAt"
            control={control}
            defaultValue={moment(props.matches[0].createAt.toDate())}
            as={
              <DatePicker
                placeholder="Fecha de partida"
                error={errors.createAt}
                showTime={true}
                label="Fecha del Encuentro"
                style={{ width: "100%" }}
                format={"DD/MM/YYYY HH:mm:ss"}
                required
              />
            }
          />
          <ButtonBombo
            margin="0"
            type="primary"
            loading={isSavingMatchTime}
            style={{ marginLeft: "10px" }}
            disabled={isSavingMatchTime}
            htmlType="submit"
          >
            Guardar
          </ButtonBombo>
        </div>
      </form>
    </div>
  );
};
