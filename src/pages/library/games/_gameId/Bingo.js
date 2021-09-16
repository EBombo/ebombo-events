import React, { useEffect, useRef, useState } from "reactn";
import styled from "styled-components";
import { Desktop, mediaQuery, Tablet } from "../../../../constants";
import { Anchor, ButtonAnt, Input } from "../../../../components/form";
import { FileUpload } from "../../../../components/common/FileUpload";
import get from "lodash/get";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { darkTheme } from "../../../../theme";
import { ModalSettings } from "./ModalSettings";
import { useRouter } from "next/router";
import { bingoCard } from "../../../../components/common/DataList";
import { firestore } from "../../../../firebase";

export const Bingo = (props) => {
  const [coverImgUrl, setCoverImgUrl] = useState(null);
  const [backgroundImg, setBackgroundImg] = useState(null);
  const [isVisibleModalSettings, setIsVisibleModalSettings] = useState(false);

  const [ownBranding, setOwnBranding] = useState(true);
  const [video, setVideo] = useState(null);
  const [allowDuplicate, setAllowDuplicate] = useState(true);
  const [visibility, setVisibility] = useState(true);
  const [audio, setAudio] = useState(null);
  const [newId, setNewId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const _newId = firestore.collection("bingo").doc().id;
    setNewId(_newId);

    if (!props.game) return;

    setOwnBranding(props.game.ownBranding);
    setVideo(props.game.video);
    setAllowDuplicate(props.game.allowDuplicate);
    setVisibility(props.game.visibility);
    setAudio(props.game.audio);
    setCoverImgUrl(props.game.coverImgUrl);
    setBackgroundImg(props.game.backgroundImg);
    setNewId(props.game.id);
  }, []);

  const schema = object().shape({
    title: string().max(25),
    name: string().required(),
  });

  const { handleSubmit, register, errors, watch } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
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
      name: data.name,
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
    <BingoContainer>
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
          {...props}
        />
      )}
      <div className="nav">
        <div className="name">Crear bingo 1 - 75</div>
        <Desktop>
          <Anchor variant="primary" onClick={() => console.log("preview")}>
            Vista Previa
          </Anchor>
        </Desktop>
      </div>
      <form onSubmit={handleSubmit(saveGame)}>
        <div className="main-container">
          <div>
            <div className="btns-container">
              <ButtonAnt
                variant={"outlined"}
                color={"dark"}
                disabled={props.isLoading}
                onClick={() => router.back()}
              >
                Cancelar
              </ButtonAnt>
              <Tablet>
                <ButtonAnt
                  variant={"contained"}
                  color={"primary"}
                  htmlType="submit"
                  loading={props.isLoading}
                  disabled={props.isLoading}
                >
                  Guardar
                </ButtonAnt>
              </Tablet>
            </div>
            <div className="title">
              <Input
                defaultValue={get(props, "game.name", "")}
                marginBottom={"0"}
                variant="primary"
                type="text"
                name="name"
                ref={register}
                error={errors.name}
                placeholder="Título sin nombre"
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
            <div className="subtitle">Personalización de cartilla</div>
            <div className="bingo-card">
              <div className="item">
                <div className="text">Titulo y columnas</div>
                <Input
                  defaultValue={get(props, "game.title", "")}
                  type="text"
                  name="title"
                  ref={register}
                  error={errors.title}
                  placeholder="Titulo"
                />
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
            <div className="subtitle">Selecciona un color para cambiarlo</div>
            <div className="colors-container">
              <div className="color-pick">
                <div className="color-title">Fondo</div>
                <div className="input-container">
                  <input
                    type="color"
                    name="backgroundColor"
                    defaultValue={get(
                      props,
                      "game.backgroundColor",
                      darkTheme.basic.secondary
                    )}
                    ref={register}
                    id="input-color-background"
                  />
                  <label
                    htmlFor="backgroundColor"
                    onClick={() =>
                      document.getElementById("input-color-background").click()
                    }
                  >
                    {watch("backgroundColor")}
                  </label>
                </div>
              </div>
              <div className="color-pick">
                <div className="color-title">Titulo</div>
                <div className="input-container">
                  <input
                    type="color"
                    name="titleColor"
                    defaultValue={get(
                      props,
                      "game.titleColor",
                      darkTheme.basic.whiteLight
                    )}
                    id="input-color-title"
                    ref={register}
                  />
                  <label
                    htmlFor="titleColor"
                    onClick={() =>
                      document.getElementById("input-color-title").click()
                    }
                  >
                    {watch("titleColor")}
                  </label>
                </div>
              </div>
              <div className="color-pick">
                <div className="color-title">Bloques</div>
                <div className="input-container">
                  <input
                    type="color"
                    name="blocksColor"
                    defaultValue={get(
                      props,
                      "game.blocksColor",
                      darkTheme.basic.primary
                    )}
                    id="input-color-blocks"
                    ref={register}
                  />
                  <label
                    htmlFor="blocksColor"
                    onClick={() =>
                      document.getElementById("input-color-blocks").click()
                    }
                  >
                    {watch("blocksColor")}
                  </label>
                </div>
              </div>
              <div className="color-pick">
                <div className="color-title">Número</div>
                <div className="input-container">
                  <input
                    type="color"
                    name="numberColor"
                    defaultValue={get(
                      props,
                      "game.numberColor",
                      darkTheme.basic.whiteLight
                    )}
                    ref={register}
                    id="input-color-number"
                  />
                  <label
                    htmlFor="numberColor"
                    onClick={() =>
                      document.getElementById("input-color-number").click()
                    }
                  >
                    {watch("numberColor")}
                  </label>
                </div>
              </div>
            </div>
            <div className="upload-container">
              <FileUpload
                file={backgroundImg}
                preview={false}
                fileName="backgroundImg"
                filePath={`/games/Bingo/${newId}`}
                sizes="470x570"
                disabled={props.isLoading}
                afterUpload={(resizeImages) =>
                  setBackgroundImg(resizeImages[0].url)
                }
              />
            </div>
          </div>

          <Desktop>
            <div className="right-container">
              <div className="submit-btn">
                <ButtonAnt
                  variant={"contained"}
                  color={"primary"}
                  htmlType="submit"
                  loading={props.isLoading}
                  disabled={props.isLoading}
                >
                  Guardar
                </ButtonAnt>
              </div>
              <div className="card-container">
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
            </div>
          </Desktop>
        </div>
      </form>
    </BingoContainer>
  );
};

const BingoContainer = styled.div`
  width: 100%;

  .nav {
    background: ${(props) => props.theme.basic.primary};
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 40px;
    padding: 0 1rem;

    .name {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 15px;
      line-height: 18px;
      color: ${(props) => props.theme.basic.whiteLight};
    }
  }

  form {
    padding: 1rem;

    .btns-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .title {
      margin-top: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

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
      margin-bottom: 0.5rem;
    }

    .bingo-card {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
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
        margin: 1rem auto;

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
    min-height: 100vh;
    background: ${(props) => props.theme.basic.white};

    .right-container {
      .submit-btn {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
        justify-content: flex-end;
      }

      .card-container {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }

    .main-container {
      background: ${(props) => props.theme.basic.gray};
      max-width: 1000px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 1rem;
      border-radius: 4px;
      margin: 1rem auto;
      box-sizing: border-box;
      padding: 1rem;

      .bingo-card {
        grid-template-columns: 1fr;
      }
    }
  }
`;

export const CardContainer = styled.div`
  width: 100%;
  height: 210px;
  max-width: 200px;
  background: ${(props) =>
    props.backgroundColor
      ? props.backgroundColor
      : props.theme.basic.secondary};
  border-radius: 3px;

  .card-title {
    font-family: Lato;
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    line-height: 18px;
    color: ${(props) =>
      props.titleColor ? props.titleColor : props.theme.basic.white};
    text-align: center;
    padding: 0.5rem;
  }

  table {
    width: 90%;
    border-collapse: separate;
    border-spacing: 2.5px;
    margin: 0 auto;

    thead {
      th {
        text-align: center;
        font-family: Lato;
        font-style: normal;
        font-weight: bold;
        font-size: 15px;
        line-height: 18px;
        color: ${(props) => props.theme.basic.whiteLight};
      }
    }

    tbody {
      tr {
        width: 25px;
        height: 25px;

        td {
          margin-right: 5px;
          text-align: center;
          font-family: Lato;
          font-style: normal;
          font-weight: bold;
          font-size: 13px;
          line-height: 15px;
          color: ${(props) =>
            props.numberColor ? props.numberColor : props.theme.basic.white};
          background: ${(props) =>
            props.blocksColor ? props.blocksColor : props.theme.basic.primary};
        }
      }
    }
  }

  ${mediaQuery.afterTablet} {
    max-width: 460px;
    height: 500px;

    .card-title {
      font-size: 28px;
      line-height: 35px;
      font-weight: 700;
      padding: 1rem 0;
    }

    table {
      width: 400px;
      border-collapse: separate;
      border-spacing: 5px;

      thead {
        th {
          font-weight: 700;
          font-size: 38px;
          line-height: 41px;
          color: ${(props) => props.theme.basic.whiteLight};
        }
      }

      tbody {
        tr {
          height: 70px;

          td {
            margin-right: 5px;
            font-weight: 700;
            font-size: 38px;
            line-height: 41px;
          }
        }
      }
    }
  }
`;
