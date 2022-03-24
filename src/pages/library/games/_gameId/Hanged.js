import React, { useMemo, useState } from "reactn";
import styled from "styled-components";
import { AfterMobile, mediaQuery, Mobile } from "../../../../constants";
import { ButtonAnt, Input, TextArea } from "../../../../components/form";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import get from "lodash/get";
import { useRouter } from "next/router";
import { config, firestore } from "../../../../firebase";
import { ModalSettings } from "./ModalSettings";
import { LeftOutlined } from "@ant-design/icons";
import { Image } from "../../../../components/common/Image";

const allowedLetters = new RegExp("^[a-zA-ZñÑáéíóúÁÉÍÓÚ, ¿?!¡:;\n]*$");
const bannedLetters = new RegExp("[^a-zA-ZñÑáéíóúÁÉÍÓÚ, ¿?!¡:;\n]", "g");

export const Hanged = (props) => {
  const router = useRouter();

  const [coverImgUrl, setCoverImgUrl] = useState(null);
  const [ownBranding, setOwnBranding] = useState(props.game?.ownBranding ?? false);
  const [video, setVideo] = useState(props.game?.video ?? null);
  const [visibility, setVisibility] = useState(props.game?.visibility ?? true);
  const [audio, setAudio] = useState(props.game?.audio ?? null);
  const [allowDuplicate, setAllowDuplicate] = useState(!!props.game?.ownBranding);
  const [isVisibleModalSettings, setIsVisibleModalSettings] = useState(false);

  const newId = useMemo(() => {
    return props.game?.id ?? firestore.collection("hanged").doc().id;
  }, [props.game]);

  const schema = object().shape({
    name: string().required(),
    phrases: string()
      .required()
      .matches(allowedLetters, "Only letters, signs ?¿!¡, whitespace ( ) and comma (,) are allowed for this field "),
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
      allowDuplicate,
    };

    await props.submitGame(_game);
  };

  const preventMaxLengthPerLine = (event, maxLengthPerLine) => {
    const phrasesChunks = event.target.value.split("\n");

    return phrasesChunks[phrasesChunks.length - 1].length + 1 > maxLengthPerLine;
  };

  return (
    <div>
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
          path={`/games/hanged/${newId}`}
          {...props}
        />
      )}
      <form onSubmit={handleSubmit(saveGame)}>
        <div className="w-full bg-primary py-2 px-4 flex items-center gap-[5px] md:gap-4">
          <Mobile>
            <LeftOutlined width="18px" height="25px" style={{ color: "white" }} onClick={() => router.back()} />
          </Mobile>
          <AfterMobile>
            <Image
              src={`${config.storageUrl}/resources/ebombo-white.png`}
              height="auto"
              width="125px"
              size="contain"
              margin="0"
              cursor="pointer"
              onClick={() => router.back()}
            />
          </AfterMobile>
          <div className=" w-full max-w-[300px] ">
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
          <ButtonAnt
            color="default"
            size="small"
            margin={"0 0 0 10px"}
            onClick={() => router.back()}
            disabled={props.isLoading}
          >
            Cancelar
          </ButtonAnt>
        </div>

        <HangedContainer>
          <div className="text-['Lato'] font-bold text-[15px] leading-[18px] text-grayLight my-4">
            Frases para el juego
          </div>
          <div className="text-['Lato'] font-normal text-[13px] leading-[16px] text-grayLight my-4">
            Escribe las frases y sepáralas con “ENTER” (Máx. 50 caracteres por palabra o frase). Solo se aceptan letras,
            signos de interrogación y exclamación (¿?¡!), espacio y comma (,).
          </div>
          <TextArea
            onPaste={(ev) => {
              const pasteText = ev.clipboardData.getData("text");

              const newPhrase = `${ev.target.value}${pasteText}`.replaceAll(bannedLetters, "");

              ev.target.value = newPhrase;

              ev.preventDefault();
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter") return;

              if (preventMaxLengthPerLine(event, 50)) {
                event.preventDefault();
                return false;
              }

              const regex = allowedLetters;
              const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
              if (!regex.test(key)) {
                event.preventDefault();
                return false;
              }
            }}
            id="phrases"
            defaultValue={props.game?.phrases?.join("\n") ?? "Escribe\n" + "Cada\n" + "Palabara\n" + "Acá"}
            error={errors.phrases}
            name="phrases"
            ref={register}
            rows="10"
            placeholder="Frases a advinar"
            background="#FAFAFA"
            color="#242424"
            border="1px solid #C4C4C4"
          />
          <ButtonAnt htmlType="submit" disabled={props.isLoading} loading={props.isLoading}>
            Guardar
          </ButtonAnt>
        </HangedContainer>
      </form>
    </div>
  );
};
const HangedContainer = styled.div`
  width: 90%;
  padding: 1rem;
  background: ${(props) => props.theme.basic.gray};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  margin: 1rem auto;

  ${mediaQuery.afterTablet} {
    max-width: 540px;
    padding: 1rem;
    margin: 2rem auto;
  }
`;
