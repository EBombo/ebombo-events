import React, { useEffect, useMemo, useState } from "reactn";
import styled from "styled-components";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { ButtonAnt, Checkbox, Input, TextArea } from "../../../../components/form";
import { useRouter } from "next/router";
import { config, firestore, firestoreRoulette } from "../../../../firebase";
import { ModalSettings } from "./ModalSettings";
import get from "lodash/get";
import { AfterMobile, Desktop, mediaQuery, Mobile, Tablet } from "../../../../constants";
import { darkTheme } from "../../../../theme";
import dynamic from "next/dynamic";
import { snapshotToArray } from "../../../../utils";
import { LeftOutlined } from "@ant-design/icons";
import { Image } from "../../../../components/common/Image";
import { useTranslation } from "../../../../hooks";

const FortuneWheel = dynamic(() => import("../../../../components/common/FortuneWheel"), { ssr: false });

const defaultWinners = 1;

// TODO: Consider refactoring to smaller components.
export const Roulette = (props) => {
  const router = useRouter();
  const { gameId } = router.query;

  const { t } = useTranslation("pages.library.roulette");

  const [coverImgUrl, setCoverImgUrl] = useState(null);
  const [ownBranding, setOwnBranding] = useState(props.game?.ownBranding ?? false);
  const [video, setVideo] = useState(props.game?.video ?? null);
  const [visibility, setVisibility] = useState(props.game?.visibility ?? true);
  const [audio, setAudio] = useState(props.game?.audio ?? null);
  const [allowDuplicate, setAllowDuplicate] = useState(!!props.game?.ownBranding);
  const [isVisibleModalSettings, setIsVisibleModalSettings] = useState(false);
  const [mustSpin, setMustSpin] = useState(false);
  const [isLive, setIsLive] = useState(props.game?.isLive ?? false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [options, setOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(gameId !== "new");

  const newId = useMemo(() => {
    return props.game?.id ?? firestore.collection("hanged").doc().id;
  }, [props.game]);

  useEffect(() => {
    if (!props.game) return;

    const fetchOptions = async () => {
      const optionsQuery = await firestoreRoulette.collection("games").doc(props.game.id).collection("options").get();

      const _options = snapshotToArray(optionsQuery);

      setOptions(_options.map((option) => option.option));

      setIsLoadingOptions(false);
    };

    fetchOptions();
  }, []);

  const schema = object().shape({
    name: string().required(),
    outerBorder: string().required(),
    amountWinners: string().required(),
    lineColor: string().required(),
    selector: string().required(),
    text: string().required(),
    buttonColor: string().required(),
    colorPrimary: string().required(),
    colorSecondary: string().required(),
    options: string(),
  });

  const { handleSubmit, register, errors, watch } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
    defaultValues: {
      outerBorder: get(props, "game.outerBorder", darkTheme.basic.secondary),
      lineColor: get(props, "game.lineColor", darkTheme.basic.secondaryDark),
      selector: get(props, "game.selector", "#D3D3D3"),
      text: get(props, "game.text", darkTheme.basic.whiteLight),
      buttonColor: get(props, "game.buttonColor", "#DFDFDF"),
      colorPrimary: get(props, "game.colorPrimary", darkTheme.basic.primary),
      colorSecondary: get(props, "game.colorSecondary", darkTheme.basic.secondary),
    },
  });

  const data = [
    { option: "Sebastian", style: { backgroundColor: watch("colorPrimary"), textColor: watch("text") } },
    { option: "Pablo", style: { backgroundColor: watch("colorSecondary"), textColor: watch("text") } },
    { option: "Anthony", style: { backgroundColor: watch("colorPrimary"), textColor: watch("text") } },
    { option: "Mateo", style: { backgroundColor: watch("colorSecondary"), textColor: watch("text") } },
    { option: "Santiago", style: { backgroundColor: watch("colorPrimary"), textColor: watch("text") } },
    { option: "Gonzalo", style: { backgroundColor: watch("colorSecondary"), textColor: watch("text") } },
    { option: "Daniel", style: { backgroundColor: watch("colorPrimary"), textColor: watch("text") } },
    { option: "Carlos", style: { backgroundColor: watch("colorSecondary"), textColor: watch("text") } },
    { option: "Mauricio", style: { backgroundColor: watch("colorPrimary"), textColor: watch("text") } },
    { option: "Giovanni", style: { backgroundColor: watch("colorSecondary"), textColor: watch("text") } },
    { option: "Cesar", style: { backgroundColor: watch("colorPrimary"), textColor: watch("text") } },
    { option: "Carlos", style: { backgroundColor: watch("colorSecondary"), textColor: watch("text") } },
  ];

  const questions = [
    {
      option: "??Cu??l es tu cita favorita y por qu???",
      style: { backgroundColor: watch("colorPrimary"), textColor: watch("text") },
    },
    {
      option: "??Cu??l es el destino de viaje de tus sue??os?",
      style: { backgroundColor: watch("colorSecondary"), textColor: watch("text") },
    },
    {
      option: "Si pudieras ser un profesional en un deporte, ??cu??l ser??a?",
      style: { backgroundColor: watch("colorPrimary"), textColor: watch("text") },
    },
    {
      option: "??Cu??l era tu personaje de pel??cula favorito cuando eras joven?",
      style: { backgroundColor: watch("colorSecondary"), textColor: watch("text") },
    },
    {
      option: "??Cual es tu color favorito?",
      style: { backgroundColor: watch("colorPrimary"), textColor: watch("text") },
    },
    {
      option: "??Puedes contarme sobre el d??a m??s emocionante de tu vida?",
      style: { backgroundColor: watch("colorSecondary"), textColor: watch("text") },
    },
  ];

  const saveGame = async (data) => {
    let options = data.options?.split(/\r?\n/) ?? null;

    // Prevent empty values.
    options = options.filter((option) => !!option);

    const isQuestions = props.currentAdminGame?.name?.toLowerCase()?.includes("questions");

    const _game = {
      ...data,
      options,
      isLive,
      isQuestions,
      coverImgUrl,
      id: newId,
      ownBranding,
      video,
      visibility,
      audio,
      allowDuplicate,
      amountWinners: +data.amountWinners ?? defaultWinners,
    };

    await props.submitGame(_game);
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
          path={`/games/roulette/${newId}`}
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
              placeholder={t("event-name")}
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
            {t("settings")}
          </ButtonAnt>
          <ButtonAnt
            color="default"
            size="small"
            margin={"0 0 0 10px"}
            onClick={() => router.back()}
            disabled={props.isLoading}
          >
            {t("cancel")}
          </ButtonAnt>
        </div>
        <RouletteContainer>
          <div className="first-content">
            <div className="text-['Lato'] text-[11px] leading-[13px] md:text-[13px] md:leading-[16px] my-2">
              {t("amount-of")}{" "}
              {props.currentAdminGame?.name?.toLowerCase()?.includes("questions") ? t("questions") : t("winners")}
            </div>
            <Input
              variant="primary"
              placeholder={`${t("amount-of")} ${
                props.currentAdminGame?.name?.toLowerCase()?.includes("questions") ? "preguntas a sortear" : "ganadores"
              }`}
              name="amountWinners"
              error={errors.amountWinners}
              defaultValue={props.game?.amountWinners ?? 1}
              ref={register}
              type="number"
              min={0}
            />

            {props.currentAdminGame?.name === "roulette" && (
              <>
                <Checkbox defaultChecked={isLive} variant="gray" onChange={() => setIsLive(!isLive)}>
                  {t("live")}
                </Checkbox>
                <div className="text-['Lato'] text-[11px] leading-[13px]">{t("description-live")}</div>
              </>
            )}

            {props.currentAdminGame?.name === "roulette" ? (
              <div className="description">{t("description-area")}</div>
            ) : (
              <div className="description">{t("description-placeholder")}</div>
            )}

            <TextArea
              onKeyPress={(event) => {
                if (event.key === "Enter") return;

                // Prevent use special characters.
                const regex = new RegExp("^[a-zA-Z .???]+$");
                const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                if (!regex.test(key)) {
                  event.preventDefault();
                  return false;
                }
              }}
              id="options"
              defaultValue={options.join("\n") ?? "Escribe\n" + "Cada\n" + "Nombre\n" + "en una linea\n" + "unica"}
              disabled={!!isLive || isLoadingOptions}
              isLoading={isLoadingOptions}
              error={errors.options}
              name="options"
              ref={register}
              rows="10"
              placeholder={t("participant-name")}
            />

            <Desktop>
              <ButtonAnt
                htmlType="submit"
                disabled={props.isLoading || isLoadingOptions}
                loading={props.isLoading || isLoadingOptions}
                margin="1rem 0"
              >
                {t("save")}
              </ButtonAnt>
            </Desktop>
          </div>

          <div className="second-content">
            <div className="subtitle">{t("change-colors")}</div>
            <div className="colors-container">
              <div className="color-pick">
                <div>
                  <div className="color-title">{t("border")}</div>
                  <div className="input-container">
                    <input type="color" name="outerBorder" ref={register} id="input-color-outerBorder" />
                    <label
                      htmlFor="outerBorder"
                      onClick={() => document.getElementById("input-color-outerBorder").click()}
                    >
                      {watch("outerBorder")?.toUpperCase()}
                    </label>
                  </div>
                </div>
                <div>
                  <div className="color-title">{t("border-in")}</div>
                  <div className="input-container">
                    <input type="color" name="lineColor" id="input-color-lineColor" ref={register} />
                    <label htmlFor="lineColor" onClick={() => document.getElementById("input-color-lineColor").click()}>
                      {watch("lineColor")?.toUpperCase()}
                    </label>
                  </div>
                </div>
              </div>

              <div className="color-pick">
                <div>
                  <div className="color-title">{t("selector")}</div>
                  <div className="input-container">
                    <input type="color" name="selector" id="input-color-selector" ref={register} />
                    <label htmlFor="selector" onClick={() => document.getElementById("input-color-selector").click()}>
                      {watch("selector")?.toUpperCase()}
                    </label>
                  </div>
                </div>
              </div>
              <div className="color-pick">
                <div>
                  <div className="color-title">{t("texts")}</div>
                  <div className="input-container">
                    <input type="color" name="text" ref={register} id="input-color-number" />
                    <label htmlFor="text" onClick={() => document.getElementById("input-color-number").click()}>
                      {watch("text")?.toUpperCase()}
                    </label>
                  </div>
                </div>
                <div>
                  <div className="color-title">{t("button")}</div>
                  <div className="input-container">
                    <input type="color" name="buttonColor" ref={register} id="input-color-button" />
                    <label htmlFor="buttonColor" onClick={() => document.getElementById("input-color-button").click()}>
                      {watch("buttonColor")?.toUpperCase()}
                    </label>
                  </div>
                </div>
              </div>
              <div className="color-pick">
                <div>
                  <div className="color-title">{t("options")}</div>
                  <div className="input-container">
                    <input type="color" name="colorPrimary" ref={register} id="input-color-primary" />
                    <label
                      htmlFor="colorPrimary"
                      onClick={() => document.getElementById("input-color-primary").click()}
                    >
                      {watch("colorPrimary")?.toUpperCase()}
                    </label>
                  </div>
                </div>
                <div>
                  <div className="color-title">{t("options")}</div>
                  <div className="input-container">
                    <input type="color" name="colorSecondary" ref={register} id="input-color-secondary" />
                    <label
                      htmlFor="colorSecondary"
                      onClick={() => document.getElementById("input-color-secondary").click()}
                    >
                      {watch("colorSecondary")?.toUpperCase()}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="third-content">
            <div className="subtitle">{t("preview")}:</div>
            <FortuneWheel
              setMustSpin={setMustSpin}
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              setPrizeNumber={setPrizeNumber}
              data={props.currentAdminGame?.name === "rouletteQuestions" ? questions : data}
              outerBorderColor={watch("outerBorder") ?? darkTheme.basic.secondary}
              outerBorderWidth={20}
              radiusLineColor={watch("lineColor") ?? darkTheme.basic.secondaryDark}
              radiusLineWidth={1}
              fontSize={12}
              buttonColor={watch("buttonColor") ?? darkTheme.basic.gray}
              selector={watch("selector") ?? darkTheme.basic.gray}
              onStopSpinning={() => {
                setMustSpin(false);
              }}
            />
            <Tablet>
              <ButtonAnt
                htmlType="submit"
                disabled={props.isLoading || isLoadingOptions}
                loading={props.isLoading || isLoadingOptions}
                margin="1rem 0"
              >
                {t("save")}
              </ButtonAnt>
            </Tablet>
          </div>
        </RouletteContainer>
      </form>
    </div>
  );
};

const RouletteContainer = styled.div`
  width: 90%;
  padding: 1rem;
  background: ${(props) => props.theme.basic.gray};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
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

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1rem;
  }
`;
