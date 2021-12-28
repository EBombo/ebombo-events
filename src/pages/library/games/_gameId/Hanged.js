import React, { useState } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../../constants";
import { ButtonAnt, Input, TextArea } from "../../../../components/form";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import get from "lodash/get";
import { useRouter } from "next/router";
import { firestore } from "../../../../firebase";
import { ModalSettings } from "./ModalSettings";

export const Hanged = (props) => {
  const router = useRouter();

  const [coverImgUrl, setCoverImgUrl] = useState(null);
  const [ownBranding, setOwnBranding] = useState(props.game?.ownBranding ?? false);
  const [video, setVideo] = useState(props.game?.video ?? null);
  const [visibility, setVisibility] = useState(props.game?.visibility ?? true);
  const [audio, setAudio] = useState(props.game?.audio ?? null);
  const [allowDuplicate, setAllowDuplicate] = useState(props.game?.allowDuplicate ?? true);
  const [newId] = useState(props.game?.id ?? firestore.collection("hanged").doc().id);
  const [isVisibleModalSettings, setIsVisibleModalSettings] = useState(false);

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
    const name = data.name;

    const _game = {
      phrases,
      name,
      coverImgUrl,
      id: newId,
      ownBranding,
      video,
      visibility,
      audio,
      allowDuplicate
    };

    await props.submitGame(_game);
  };

  return (
    <HangedContainer>
      {isVisibleModalSettings && (
        <ModalSettings
          isVisibleModalSettings={isVisibleModalSettings}
          setIsVisibleModalSettings={setIsVisibleModalSettings}
          setCoverImgUrl={setCoverImgUrl}
          coverImgUrl={coverImgUrl}
          setOwnBranding={setOwnBranding}
          ownBranding={ownBranding}
          setVideo={setVideo}
          video={video}
          setVisibility={setVisibility}
          visibility={visibility}
          setAudio={setAudio}
          audio={audio}
          setAllowDuplicate={setAllowDuplicate}
          allowDuplicate={allowDuplicate}
          newId={newId}
          path={`/games/Hanged/${newId}`}
          {...props}
        />
      )}
      <ButtonAnt color="default" onClick={() => router.back()} disabled={props.isLoading}>
        Cancelar
      </ButtonAnt>
      <form onSubmit={handleSubmit(saveGame)}>
        <div className="flex items-center">
          <Input
            defaultValue={get(props, "game.name", "")}
            variant="primary"
            type="text"
            name="name"
            ref={register}
            error={errors.name}
            placeholder="Nombre del Evento"
          />
          <ButtonAnt
            variant="contained"
            color="secondary"
            size="small"
            margin={"0 0 0 10px"}
            onClick={() => setIsVisibleModalSettings(true)}
            disabled={props.isLoading}
          >
            Ajustes
          </ButtonAnt>
        </div>
        <label htmlFor="phrases" className="label">
          Frases para el juego
        </label>
        <div className="description">
          Escribe las frases y separalas con “ENTER” (Máx. 20 caracteres por palabra o frase)
        </div>
        <TextArea
          onKeyPress={(event) => {
            if (event.key === "Enter") return;

            const regex = new RegExp("^[a-zA-Z ]+$");
            const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
            if (!regex.test(key)) {
              event.preventDefault();
              return false;
            }
          }}
          id="phrases"
          defaultValue={"Escribe\n" + "Cada\n" + "Palabara\n" + "Acá"}
          error={errors.phrases}
          name="phrases"
          ref={register}
          rows="10"
          placeholder="Frases a advinar"
        />
        <ButtonAnt htmlType="submit" disabled={props.isLoading} loading={props.isLoading}>
          Guardar
        </ButtonAnt>
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

  .upload-container {
    margin: 1rem 0;
  }

  ${mediaQuery.afterTablet} {
    max-width: 550px;
    padding: 2rem;
    margin: 2rem auto;
  }
`;
