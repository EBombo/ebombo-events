import React, { useState } from "reactn";
import styled from "styled-components";
import { Input, TextArea } from "../../components";
import { useForm } from "react-hook-form";
import { string, object } from "yup";
import get from "lodash/get";
import { ButtonBombo } from "../../components";
import { firestore } from "../../firebase";
import defaultTo from "lodash/defaultTo";

export default (props) => {
  const [loading, setLoading] = useState(false);

  const schema = object().shape({
    description: string().required(),
    title: string().required(),
    link: string().required(),
  });

  const { register, handleSubmit, errors } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveExample = async (data) => {
    setLoading(true);
    console.log("hitting this");
    let businessExamples;

    if (
      defaultTo(get(props, "events.businessExamples"), []).some(
        (game) => game.id === props.currentExample.id
      )
    ) {
      businessExamples = defaultTo(
        get(props, "events.businessExamples"),
        []
      ).map((example) =>
        example.id === props.currentExample.id ? mapExample(data) : example
      );
    } else {
      businessExamples = defaultTo(get(props, "events.businessExamples"), []);
      businessExamples.push(mapExample(data));
    }

    await firestore.doc(`landings/events`).update({
      businessExamples,
    });

    props.setIsVisibleModal(false);
    setLoading(false);
  };

  const mapExample = (data) => ({
    ...props.currentExample,
    description: data.description,
    title: data.title,
    link: data.link,
  });

  return (
    <Container>
      <div className="title">Ejemplo de Negocio</div>
      <form onSubmit={handleSubmit(saveExample)}>
        <Input
          variant="primary"
          required
          label="Titulo:"
          type="text"
          defaultValue={get(props, "currentExample.title", "")}
          placeholder="Título"
          ref={register}
          name="title"
        />
        <Input
          variant="primary"
          required
          label="Link:"
          type="url"
          defaultValue={get(props, "currentExample.link", "")}
          placeholder="Url video"
          ref={register}
          name="link"
        />
        <TextArea
          variant="primary"
          name="description"
          ref={register}
          error={errors.description}
          required
          label="Descripción:"
          defaultValue={get(props, "currentExample.description", "")}
          placeholder="Descripción del ejemplo"
        />
        <div className="buttons-container">
          <ButtonBombo
            type="primary"
            margin="0"
            loading={loading}
            disabled={loading}
            htmlType="submit"
          >
            Guardar
          </ButtonBombo>
          <ButtonBombo
            type="secondary"
            margin="0"
            loading={loading}
            disabled={loading}
            onClick={() => props.setIsVisibleModal(false)}
          >
            Cancelar
          </ButtonBombo>
        </div>
      </form>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin: 1rem 0;
  .title {
    font-size: 18px;
    line-height: 22px;
    color: ${(props) => props.theme.basic.white};
  }
  form {
    margin-top: 1rem;

    .buttons-container {
      display: flex;
      justify-content: space-around;
    }
  }
`;
