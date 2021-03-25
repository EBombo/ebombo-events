import { ButtonBombo, Input } from "../../../../../../../components";
import { Icon } from "../../../../../../../components/common/Icons";
import React from "reactn";
import { object, string } from "yup";
import { useForm } from "react-hook-form";

export const AddNonRegisterPlayer = (props) => {
  const schema = object().shape({
    memberName: string().required(),
  });

  const { errors, handleSubmit, register } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  return (
    <form
      className="no-register-form"
      onSubmit={handleSubmit(props.addNoRegisterMember)}
    >
      <Input
        variant="primary"
        type="text"
        error={errors.memberName}
        ref={register}
        marginBottom="0.5rem"
        name="memberName"
        maxWidth="200px"
        placeholder="Nombre del miembro"
      />
      <div className="button-container">
        <ButtonBombo type="secondary" htmlType="submit" margin="0">
          Agregar
          <Icon type="plus" />
        </ButtonBombo>
      </div>
    </form>
  );
};
