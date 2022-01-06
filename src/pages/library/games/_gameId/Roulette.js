import React, { useMemo, useState } from "reactn";
import styled from "styled-components";
import { boolean, object, string } from "yup";
import { useForm } from "react-hook-form";
import { ButtonAnt, Checkbox, Input, TextArea } from "../../../../components/form";
import { useRouter } from "next/router";
import { firestore } from "../../../../firebase";
import { ModalSettings } from "./ModalSettings";
import get from "lodash/get";
import { mediaQuery } from "../../../../constants";
import { darkTheme } from "../../../../theme";
import dynamic from "next/dynamic";

const CustomeRoulette = dynamic(() => import("../../../../components/common/CustomeRoulette"), { ssr: false });

export const Roulette = (props) => {
  const router = useRouter();

  const [coverImgUrl, setCoverImgUrl] = useState(null);
  const [ownBranding, setOwnBranding] = useState(props.game?.ownBranding ?? false);
  const [video, setVideo] = useState(props.game?.video ?? null);
  const [visibility, setVisibility] = useState(props.game?.visibility ?? true);
  const [audio, setAudio] = useState(props.game?.audio ?? null);
  const [allowDuplicate, setAllowDuplicate] = useState(!!props.game?.ownBranding);
  const [isVisibleModalSettings, setIsVisibleModalSettings] = useState(false);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const newId = useMemo(() => {
    return props.game?.id ?? firestore.collection("hanged").doc().id;
  }, [props.game]);

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

  const { handleSubmit, register, errors, watch } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const data = [
    { option: "Sebastian", style: { backgroundColor: watch("primary"), textColor: "black" } },
    { option: "Pablo", style: { backgroundColor: watch("secondary"), textColor: "black" } },
    { option: "Anthony", style: { backgroundColor: watch("primary"), textColor: "black" } },
    { option: "Mateo", style: { backgroundColor: watch("secondary"), textColor: "black" } },
    { option: "Santiago", style: { backgroundColor: watch("primary"), textColor: "black" } },
    { option: "Gonzalo", style: { backgroundColor: watch("secondary"), textColor: "black" } },
    { option: "Daniel", style: { backgroundColor: watch("primary"), textColor: "black" } },
    { option: "Carlos", style: { backgroundColor: watch("secondary"), textColor: "black" } },
  ];

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
          path={`/games/roulette/${newId}`}
          {...props}
        />
      )}
      <ButtonAnt color="default" onClick={() => router.back()} disabled={props.isLoading}>
        Cancelar
      </ButtonAnt>
      <form onSubmit={handleSubmit(saveGame)}>
        <div className="first-content">
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
          <Checkbox
            variant="gray"
            label={"En vivo"}
            defaultValue={!!props.game?.live}
            name="participants"
            ref={register}
          />
          <div className="description">
            Escribe el nombre de los participantes y sepáralos con “ENTER” (Máx. 25 caracteres)
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
            id="participants"
            defaultValue={
              props.game?.participants?.join("\n") ?? "Escribe\n" + "Cada\n" + "Nombre\n" + "en una linea\n" + "unica"
            }
            error={errors.participants}
            name="participants"
            ref={register}
            rows="10"
            placeholder="Nombres de participantes"
          />
          <ButtonAnt htmlType="submit" disabled={props.isLoading} loading={props.isLoading}>
            Guardar
          </ButtonAnt>
        </div>
        <div className="second-content">
          <div className="subtitle">Cambia los colores:</div>
          <div className="colors-container">
            <div className="color-pick">
              <div>
                <div className="color-title">Borde exterior</div>
                <div className="input-container">
                  <input
                    type="color"
                    name="outerBorder"
                    defaultValue={get(props, "game.outerBorder", "#D3D3D3")}
                    ref={register}
                    id="input-color-outerBorder"
                  />
                  <label
                    htmlFor="outerBorder"
                    onClick={() => document.getElementById("input-color-background").click()}
                  >
                    {watch("outerBorder")?.toUpperCase()}
                  </label>
                </div>
              </div>
              <div>
                <div className="color-title">Border interior</div>
                <div className="input-container">
                  <input
                    type="color"
                    name="innerBorder"
                    defaultValue={get(props, "game.innerBorder", darkTheme.basic.secondary)}
                    id="input-color-title"
                    ref={register}
                  />
                  <label htmlFor="innerBorder" onClick={() => document.getElementById("input-color-title").click()}>
                    {watch("innerBorder")?.toUpperCase()}
                  </label>
                </div>
              </div>
            </div>

            <div className="color-pick">
              <div>
                <div className="color-title">Selector</div>
                <div className="input-container">
                  <input
                    type="color"
                    name="selector"
                    defaultValue={get(props, "game.selector", "#D3D3D3")}
                    id="input-color-blocks"
                    ref={register}
                  />
                  <label htmlFor="selector" onClick={() => document.getElementById("input-color-blocks").click()}>
                    {watch("selector")?.toUpperCase()}
                  </label>
                </div>
              </div>
            </div>
            <div className="color-pick">
              <div>
                <div className="color-title">Textos</div>
                <div className="input-container">
                  <input
                    type="color"
                    name="text"
                    defaultValue={get(props, "game.text", darkTheme.basic.whiteLight)}
                    ref={register}
                    id="input-color-number"
                  />
                  <label htmlFor="text" onClick={() => document.getElementById("input-color-number").click()}>
                    {watch("text")?.toUpperCase()}
                  </label>
                </div>
              </div>
              <div>
                <div className="color-title">Botón</div>
                <div className="input-container">
                  <input
                    type="color"
                    name="button"
                    defaultValue={get(props, "game.button", "#DFDFDF")}
                    ref={register}
                    id="input-color-number"
                  />
                  <label htmlFor="button" onClick={() => document.getElementById("input-color-number").click()}>
                    {watch("button")?.toUpperCase()}
                  </label>
                </div>
              </div>
            </div>
            <div className="color-pick">
              <div>
                <div className="color-title">Opciones</div>
                <div className="input-container">
                  <input
                    type="color"
                    name="primary"
                    defaultValue={get(props, "game.primary", darkTheme.basic.primary)}
                    ref={register}
                    id="input-color-number"
                  />
                  <label htmlFor="primary" onClick={() => document.getElementById("input-color-number").click()}>
                    {watch("primary")?.toUpperCase()}
                  </label>
                </div>
              </div>
              <div>
                <div className="input-container">
                  <input
                    type="color"
                    name="secondary"
                    defaultValue={get(props, "game.secondary", darkTheme.basic.secondary)}
                    ref={register}
                    id="input-color-number"
                  />
                  <label htmlFor="secondary" onClick={() => document.getElementById("input-color-number").click()}>
                    {watch("secondary")?.toUpperCase()}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="third-content">
          <div className="subtitle">Previsualización:</div>
          <CustomeRoulette
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            onStopSpinning={() => {
              setMustSpin(false);
            }}
          />
          {/*<RouletteExample*/}
          {/*  outerBorder={watch("outerBorder")}*/}
          {/*  innerBorder={watch("innerBorder")}*/}
          {/*  selector={watch("selector")}*/}
          {/*  text={watch("text")}*/}
          {/*  button={watch("button")}*/}
          {/*  primary={watch("primary")}*/}
          {/*  secondary={watch("secondary")}*/}
          {/*>*/}
          {/*  <div className="innerborder">*/}
          {/*    <div className="participants">*/}
          {/*      <div className="participant"></div>*/}
          {/*      <div className="participant"></div>*/}
          {/*      <div className="participant"></div>*/}
          {/*      <div className="participant"></div>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</RouletteExample>*/}
        </div>
      </form>
    </RouletteContainer>
  );
};

const RouletteContainer = styled.div`
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

  input[type="color"] {
    width: 38px;
    height: 36px;
    border: 1px solid #6f6f6f;
    outline: none;
    border-radius: 3px;
    -webkit-appearance: none;
    cursor: pointer;
  }

  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 3px;
  }

  .color-pick {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    margin-bottom: 0.5rem;

    .color-title {
      font-family: Lato;
      font-style: normal;
      font-weight: 500;
      font-size: 13px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.grayLight};
    }

    .input-container {
      display: flex;
      align-items: center;
    }

    label {
      width: 112px;
      height: 36px;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: Encode Sans;
      font-style: normal;
      font-weight: bold;
      font-size: 13px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.grayLight};
      border: 1px solid ${(props) => props.theme.basic.grayLight};
      border-radius: 4px;
      cursor: pointer;
      margin-left: 10px;
    }
  }

  .second-content {
    .subtitle {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 15px;
      line-height: 18px;
      color: ${(props) => props.theme.basic.grayLight};
      margin-bottom: 0.5rem;
    }
  }
  ${mediaQuery.afterTablet} {
    max-width: 1100px;
    padding: 1rem;
    margin: 2rem auto;

    form {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 1rem;
    }
  }
`;

const RouletteExample = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  background: radial-gradient(51.36% 51.36% at 50% 50%, #956dfc 0%, #6336d6 100%);
  border-radius: 50%;
  border: 8px solid ${(props) => props.innerBorder ?? props.theme.basic.secondary};
  box-shadow: 0 0 0px 4px ${(props) => props.outerBorder ?? "#D3D3D3"};

  .participants {
    position: relative;
    display: block;

    .participant {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #d48634;
      -webkit-clip-path: $upside-down-triangle;
      clip-path: $upside-down-triangle;
      z-index: 2;
    }
  }
`;
