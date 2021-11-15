import React, { useEffect, useGlobal, useState, useRef } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../../constants";
import { ButtonAnt, Input, TextArea } from "../../../../components/form";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import get from "lodash/get";
import { useRouter } from "next/router";

export const Hanged = (props) => {
  const router = useRouter();

  const schema = object().shape({
    name: string().required(),
    phrases: string().required(),
  });

  const { handleSubmit, register, errors } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveGame = async (data) => {
    const phrases = data.phrases.split(/\r?\n/);
    const title = data.title;

    const _game = {
      phrases,
      title,
    };

    await props.submitGame(_game);
  };

  return (
    <HangedContainer>
      <ButtonAnt color="default" onClick={() => router.back()}>
        Cancelar
      </ButtonAnt>
      <form onSubmit={handleSubmit(saveGame)}>
        <Input
          defaultValue={get(props, "game.name", "")}
          variant="primary"
          type="text"
          name="name"
          ref={register}
          error={errors.name}
          placeholder="Nombre del Juego"
        />
        <label htmlFor="phrases" className="label">
          Frases para el juego
        </label>
        <div className="description">
          Escribe las frases y separalas con “ENTER” (Máx. 20 caracteres por palabra o frase)
        </div>
        <TextArea
          id="phrases"
          error={errors.phrases}
          name="phrases"
          ref={register}
          rows="10"
          placeholder="Frases a advinar"
        />
        <ButtonAnt htmlType="submit">Guardar</ButtonAnt>
      </form>
    </HangedContainer>
  );
};

const HangedContainer = styled.div`
  width: 90%;
  padding: 1rem;
  background: ${(props) => props.theme.basic.gray};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  margin: 1rem auto;

  input[type="text"] {
    margin: 1rem 0 !important;
  }

  .label {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 18px;
    color: ${(props) => props.theme.basic.grayLight};
    margin: 0.5rem 0;
  }

  .description {
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 16px;
    color: ${(props) => props.theme.basic.grayLight};
    margin: 0.5rem 0;
  }

  textarea {
    background: ${(props) => props.theme.basic.whiteLight};
    color: ${(props) => props.theme.basic.blackDarken};
    border: 1px solid ${(props) => props.theme.basic.grayLighten};
  }

  ${mediaQuery.afterTablet} {
    max-width: 550px;
    padding: 2rem;
    margin: 2rem auto;
  }
`;
