import React from "reactn";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { Input } from "../../../../components/form";
import get from "lodash/get";

export const Trivia = (props) => {
  const schema = object().shape({
    name: string().required(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveGame = async () => {};

  return (
    <div className="w-screen">
      <form className="grid" onSubmit={handleSubmit(saveGame)}>
        <div className="w-full bg-primary py-2 px-4">
          <div className="max-w-[300px]">
            <Input
              defaultValue={get(props, "game.name", "")}
              variant="primary"
              type="text"
              name="name"
              ref={register}
              error={errors.name}
              placeholder="Nombre del Evento"
            />
          </div>
        </div>
        <div className="w-full h-[calc(100vh-102px)] overflow-auto grid md:grid-cols-[180px_auto_260px]">
          <div className="w-full h-full"></div>
          <div className=""></div>
          <div></div>
        </div>
      </form>
    </div>
  );
};
