import React from "reactn";
import styled from "styled-components";
import { boolean, object, string } from "yup";
import { useForm } from "react-hook-form";
import { ButtonAnt } from "../../../../components/form";
import { useRouter } from "next/router";

export const Roulette = props => {
  const router = useRouter();

  const schema = object().shape({
    name: string().required(),
    live: boolean().required(),
    outerBorder: string().required(),
    innerBorder: string().required(),
    selector: string().required(),
    text: string().required(),
    button: string().required(),
    primary: string().required(),
    secondary: string().required(),
    participants: string(),
  });

  const { handleSubmit, register, errors } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveGame = async (data) => {
    const phrases = data.phrases.split(/\r?\n/);
    const name = data.name;

    const _game = {
      phrases,
      name,
      coverImgUrl,
      id: newId,
    };

    await props.submitGame(_game);
  };

  return (
    <RouletteContainer>
      <ButtonAnt color="default" onClick={() => router.back()} disabled={props.isLoading}>
        Cancelar
      </ButtonAnt>
      <form onSubmit={handleSubmit(saveGame)}>

      </form>
    </RouletteContainer>
  )
}

const RouletteContainer = styled.div`
  width:100%;
`