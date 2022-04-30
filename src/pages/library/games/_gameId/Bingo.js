import React, { useMemo, useState } from "reactn";
import styled from "styled-components";
import { AfterMobile, Desktop, mediaQuery, Mobile, Tablet } from "../../../../constants";
import { ButtonAnt, Input } from "../../../../components/form";
import { FileUpload } from "../../../../components/common/FileUpload";
import get from "lodash/get";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { darkTheme } from "../../../../theme";
import { ModalSettings } from "./ModalSettings";
import { useRouter } from "next/router";
import { bingoCard } from "../../../../components/common/DataList";
import { config, firestore } from "../../../../firebase";
import { LeftOutlined } from "@ant-design/icons";
import { Image } from "../../../../components/common/Image";
import { useTranslation } from "../../../../hooks";

export const Bingo = (props) => {
  const router = useRouter();

  const { gameId } = router.query;

  const { t } = useTranslation("pages.library.bingo");

  const [isVisibleModalSettings, setIsVisibleModalSettings] = useState(false);
  const [backgroundImg, setBackgroundImg] = useState(props.game ? props.game.backgroundImg : null);
  const [coverImgUrl, setCoverImgUrl] = useState(props.game ? props.game.coverImgUrl : null);
  const [ownBranding, setOwnBranding] = useState(props.game ? props.game.ownBranding : false);
  const [video, setVideo] = useState(props.game ? props.game.video : null);
  const [allowDuplicate, setAllowDuplicate] = useState(!!props.game?.ownBranding);
  const [visibility, setVisibility] = useState(props.game ? props.game.visibility : true);
  const [audio, setAudio] = useState(props.game ? props.game.audio : null);

  const newId = useMemo(() => {
    return props.game?.id ?? firestore.collection("hanged").doc().id;
  }, [props.game]);

  const schema = object().shape({
    title: string().max(25),
    name: string(),
  });

  const { handleSubmit, register, errors, watch } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
    defaultValues: {
      backgroundColor: darkTheme.basic.primaryLight,
      titleColor: darkTheme.basic.secondary,
      blocksColor: darkTheme.basic.secondary,
      numberColor: darkTheme.basic.whiteLight,
      title: t("card-title"),
      b: "B",
      i: "I",
      n: "N",
      g: "G",
      o: "O",
    },
  });

  const saveGame = async (data) => {
    const _game = {
      letters: {
        b: data.b,
        i: data.i,
        n: data.n,
        g: data.g,
        o: data.o,
      },
      blocksColor: data.blocksColor,
      numberColor: data.numberColor,
      titleColor: data.titleColor,
      backgroundColor: data.backgroundColor,
      title: data.title,
      name: data.name || "default bingo",
      coverImgUrl,
      backgroundImg,
      ownBranding,
      video,
      allowDuplicate,
      visibility,
      audio,
      id: newId,
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
          path={`/games/bingo/${props.newId}`}
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
              marginBottom={"0"}
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

        <BingoContainer>
          <div className="main-container">
            <div>
              <div className="subtitle">{t("customize-card")}</div>
              <div className="bingo-card">
                <div className="item">
                  <div className="text">{t("title")}</div>
                  <Input
                    defaultValue={get(props, "game.title", t("card-title"))}
                    type="text"
                    name="title"
                    ref={register}
                    error={errors.title}
                    placeholder={t("title")}
                  />
                  <div className="text">{t("columns")}</div>
                  <div className="bingo-inputs">
                    <Input
                      type="text"
                      name="b"
                      ref={register}
                      error={errors.b}
                      defaultValue={get(props, "game.letters.b", "B")}
                      className="input-bingo"
                      maxLength={1}
                    />
                    <Input
                      type="text"
                      name="i"
                      ref={register}
                      error={errors.i}
                      defaultValue={get(props, "game.letters.i", "I")}
                      className="input-bingo"
                      maxLength={1}
                    />
                    <Input
                      type="text"
                      name="n"
                      ref={register}
                      error={errors.n}
                      defaultValue={get(props, "game.letters.n", "N")}
                      className="input-bingo"
                      maxLength={1}
                    />
                    <Input
                      type="text"
                      name="g"
                      ref={register}
                      error={errors.g}
                      defaultValue={get(props, "game.letters.g", "G")}
                      className="input-bingo"
                      maxLength={1}
                    />
                    <Input
                      type="text"
                      name="o"
                      ref={register}
                      error={errors.o}
                      defaultValue={get(props, "game.letters.o", "O")}
                      className="input-bingo"
                      maxLength={1}
                    />
                  </div>
                </div>
                <Tablet>
                  <div className="card">
                    <CardContainer
                      backgroundColor={watch("backgroundColor")}
                      titleColor={watch("titleColor")}
                      blocksColor={watch("blocksColor")}
                      numberColor={watch("numberColor")}
                    >
                      <div className="card-title no-wrap">{watch("title")}</div>
                      <table>
                        <thead className="thead">
                          <tr>
                            <th>{watch("b")}</th>
                            <th>{watch("i")}</th>
                            <th>{watch("n")}</th>
                            <th>{watch("g")}</th>
                            <th>{watch("o")}</th>
                          </tr>
                        </thead>
                        <tbody className="tbody">
                          {bingoCard.map((arrNums, index) => (
                            <tr key={`key-${index}`}>
                              {arrNums.map((num, idx) => (
                                <td key={`key-${num}-${idx}`}>{num}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContainer>
                  </div>
                </Tablet>
              </div>
              <div className="subtitle">{t("select-color")}</div>
              <div className="colors-container">
                <div className="color-pick">
                  <div className="color-title">{t("background")}</div>
                  <div className="input-container">
                    <input
                      type="color"
                      name="backgroundColor"
                      defaultValue={get(props, "game.backgroundColor", darkTheme.basic.primaryLight)}
                      ref={register}
                      id="input-color-background"
                      onChange={() => setBackgroundImg(null)}
                    />
                    <label
                      htmlFor="backgroundColor"
                      onClick={() => document.getElementById("input-color-background").click()}
                    >
                      {watch("backgroundColor")}
                    </label>
                  </div>
                </div>
                <div className="color-pick">
                  <div className="color-title">{t("title")}</div>
                  <div className="input-container">
                    <input
                      type="color"
                      name="titleColor"
                      defaultValue={get(props, "game.titleColor", darkTheme.basic.secondary)}
                      id="input-color-title"
                      ref={register}
                    />
                    <label htmlFor="titleColor" onClick={() => document.getElementById("input-color-title").click()}>
                      {watch("titleColor")}
                    </label>
                  </div>
                </div>
                <div className="color-pick">
                  <div className="color-title">{t("blocks")}</div>
                  <div className="input-container">
                    <input
                      type="color"
                      name="blocksColor"
                      defaultValue={get(props, "game.blocksColor", darkTheme.basic.secondary)}
                      id="input-color-blocks"
                      ref={register}
                    />
                    <label htmlFor="blocksColor" onClick={() => document.getElementById("input-color-blocks").click()}>
                      {watch("blocksColor")}
                    </label>
                  </div>
                </div>
                <div className="color-pick">
                  <div className="color-title">{t("number")}</div>
                  <div className="input-container">
                    <input
                      type="color"
                      name="numberColor"
                      defaultValue={get(props, "game.numberColor", darkTheme.basic.whiteLight)}
                      ref={register}
                      id="input-color-number"
                    />
                    <label htmlFor="numberColor" onClick={() => document.getElementById("input-color-number").click()}>
                      {watch("numberColor")}
                    </label>
                  </div>
                </div>
              </div>
              <div className="upload-container">
                <FileUpload
                  key={watch("backgroundColor")}
                  buttonLabel={backgroundImg ? t("update-img") : t("upload-img")}
                  file={backgroundImg}
                  preview={false}
                  fileName="backgroundImg"
                  filePath={`/games/Bingo/${newId}`}
                  sizes="470x570"
                  disabled={props.isLoading}
                  afterUpload={(resizeImages) => setBackgroundImg(resizeImages[0].url)}
                />
              </div>

              <Desktop>
                <ButtonAnt htmlType="submit" disabled={props.isLoading} loading={props.isLoading} margin="1rem 0">
                  {t("save")}
                </ButtonAnt>
              </Desktop>
            </div>

            <Desktop>
              <div className="right-container">
                <div className="card-container">
                  <CardContainer
                    backgroundImage={backgroundImg}
                    backgroundColor={watch("backgroundColor")}
                    titleColor={watch("titleColor")}
                    blocksColor={watch("blocksColor")}
                    numberColor={watch("numberColor")}
                  >
                    <div className="card-title no-wrap">{watch("title")}</div>
                    <table>
                      <thead className="thead">
                        <tr>
                          <th>{watch("b")}</th>
                          <th>{watch("i")}</th>
                          <th>{watch("n")}</th>
                          <th>{watch("g")}</th>
                          <th>{watch("o")}</th>
                        </tr>
                      </thead>
                      <tbody className="tbody">
                        {bingoCard.map((arrNums, index) => (
                          <tr key={`key-${index}`}>
                            {arrNums.map((num, idx) => (
                              <td key={`key-${num}-${idx}`}>{num}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContainer>
                </div>
              </div>
            </Desktop>
            <Tablet>
              <ButtonAnt htmlType="submit" disabled={props.isLoading} loading={props.isLoading} margin="1rem auto">
                {t("save")}
              </ButtonAnt>
            </Tablet>
          </div>
        </BingoContainer>
      </form>
    </div>
  );
};

const BingoContainer = styled.div`
  width: 90%;
  padding: 1rem;
  margin: 1rem auto;
  background: ${(props) => props.theme.basic.gray};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

  .main-container {
    .subtitle {
      margin: 1rem 0;
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 15px;
      line-height: 18px;
      color: ${(props) => props.theme.basic.grayLight};
    }

    .text {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 13px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.grayLight};
      margin: 0.5rem 0;
    }

    .bingo-card {
      display: grid;
      grid-gap: 0.5rem;

      .card {
        display: flex;
        justify-content: center;
      }

      .bingo-inputs {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 5px;
        max-width: 200px;
        margin: 0.5rem 0;

        .input-bingo {
          padding: 0 !important;
          text-align: center !important;
        }
      }
    }

    .colors-container {
      display: grid;
      grid-template-columns: repeat(2, 50%);
      grid-gap: 1rem;
      align-items: center;

      .color-pick {
        display: flex;
        flex-direction: column;

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
      }

      input[type="color"] {
        width: 29px;
        height: 36px;
        border: none;
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

    .upload-container {
      margin-top: 1rem;
    }
  }

  ${mediaQuery.afterTablet} {
    max-width: 900px;
    padding: 1rem;
    margin: 2rem auto;

    .right-container {
      width: 100%;
      height: 100%;

      .card-container {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }

    .main-container {
      max-width: 1000px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 1rem;
      border-radius: 4px;
      justify-items: center;
    }
  }
`;

export const CardContainer = styled.div`
  width: 100%;
  aspect-ratio: 6/ 8;
  ${(props) => props.full && "min-width: 550px"};
  max-width: ${(props) => (props.full ? "100%" : "350px")};
  background: ${(props) => {
    if (props.backgroundImg) return `url(${props.backgroundImg})`;
    if (props.backgroundColor) return props.backgroundColor;

    return props.theme.basic.secondary;
  }};
  background-position: center;
  border-radius: 3px;
  padding: ${(props) => (props.full ? "1rem" : "0.5rem")};
  margin: 0 auto;
  display: grid;
  grid-template-rows: 10% 85%;
  grid-gap: 5%;

  .card-title {
    font-family: Lato;
    font-weight: bold;
    color: ${(props) => (props.titleColor ? props.titleColor : props.theme.basic.secondary)};
    text-align: center;
    font-size: ${(props) => (props.full ? "55px" : "32px")};
    line-height: ${(props) => (props.full ? "59px" : "36px")};
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 5px;
    margin: 0 auto;

    thead {
      tr {
        th {
          width: 20%;
          aspect-ratio: 1 / 1;
          text-align: center;
          font-family: Lato;
          font-weight: 700;
          font-size: ${(props) => (props.full ? "55px" : "32px")};
          line-height: ${(props) => (props.full ? "59px" : "36px")};
          font-style: normal;
          color: ${(props) => (props.titleColor ? props.titleColor : props.theme.basic.secondary)};
        }
      }
    }

    tbody {
      tr {
        td {
          width: 20%;
          aspect-ratio: 1 / 1;
          margin-right: 5px;
          text-align: center;
          font-family: Lato;
          font-weight: 700;
          font-size: ${(props) => (props.full ? "55px" : "32px")};
          line-height: ${(props) => (props.full ? "59px" : "36px")};
          font-style: normal;
          color: ${(props) => (props.numberColor ? props.numberColor : props.theme.basic.white)};
          background: ${(props) => (props.blocksColor ? props.blocksColor : props.theme.basic.secondary)};
          justify-content: center;

          .active {
            border-radius: 50%;
            background: ${(props) => props.theme.basic.success};
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${(props) => props.theme.basic.blackDarken};
            margin: 0 auto;
          }

          .number {
            cursor: pointer;
            width: 80%;
            aspect-ratio: 1 / 1;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: auto;
            text-align: center;
            font-size: 32px;

            ${mediaQuery.afterTablet} {
              font-size: 28px;
            }
          }
        }
      }
    }
  }

  ${mediaQuery.afterTablet} {
    padding: 0.5rem 1rem;
  }
`;
