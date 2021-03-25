import React from "reactn";
import { object, date } from "yup";
import { useForm, Controller } from "react-hook-form";
import { ButtonBombo, DatePicker } from "../../../../../components";
import moment from "moment";

export const DateToMatchesContainer = (props) => {
  const schema = object().shape({
    dateMatches: date().required(),
  });

  const { handleSubmit, errors, control } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  return (
    <form onSubmit={handleSubmit(props.generateGroup)} noValidate>
      <Controller
        name="dateMatches"
        control={control}
        defaultValue={moment()}
        as={
          <DatePicker
            showTime={true}
            label="Fecha de partidas"
            error={errors.dateMatches}
            style={{ width: "100%" }}
            format={"DD/MM/YYYY HH:mm:ss"}
            placeholder="Fecha de partidas"
          />
        }
      />
      <ButtonBombo
        htmlType="submit"
        disabled={props.loadingGenerateGroups}
        loading={props.loadingGenerateGroups}
      >
        GUARDAR
      </ButtonBombo>
    </form>
  );
};
