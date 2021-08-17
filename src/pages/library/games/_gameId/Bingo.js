import React, { useState, useGlobal, useRef } from "reactn";
import styled from "styled-components";
import { mediaQuery, Tablet, Desktop } from "../../../../constants";
import { Anchor, ButtonAnt, Input } from "../../../../components/form";
import { FileUpload } from "../../../../components/common/FileUpload";
import get from "lodash/get";
import { Image } from "../../../../components/common/Image";
import { config } from "../../../../firebase";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { darkTheme } from "../../../../theme";
import defaultTo from "lodash/defaultTo";
import { useRouter } from "next/router";
import { ModalSettings } from "./ModalSettings";

const bingoCard = [
  [2, 4, 8, 13, 15],
  [16, 22, 25, 27, 30],
  [31, 33, 36, 38, 45],
  [46, 48, 56, 59, 60],
  [61, 63, 68, 72, 75],
];

export const Bingo = (props) => {
  const [coverImgUrl, setCoverImgUrl] = useState(null);
  const [backgroundImg, setBackgroundImg] = useState(null);
  const [isVisibleModalSettings, setIsVisibleModalSettings] = useState(false);

  const [ownBranding, setOwnBranding] = useState(true);
  const [video, setVideo] = useState(null);
  const [allowDuplicate, setAllowDuplicate] = useState(true);
  const [visibility, setVisibility] = useState(true);
  const [music, setMusic] = useState(null);

  const router = useRouter();

  const schema = object().shape({
    title: string(),
    name: string().required(),
  });

  const { handleSubmit, register, errors, watch } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveGame = async (data) => {
    const game = {
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
      music,
    };

    await props.createGame(game);
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
          setMusic={setMusic}
          music={music}
          setAllowDuplicate={setAllowDuplicate}
          allowDuplicate={allowDuplicate}
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
                color={"default"}
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
                marginBottom={"0"}
                variant="primary"
                type="text"
                name="name"
                ref={register}
                error={errors.name}
                placeholder="Título sin nombre"
                className="name-input"
              />

              <ButtonAnt
                variant="contained"
                color="secondary"
                size="small"
                margin={"0 0 0 10px"}
                onClick={() => setIsVisibleModalSettings(true)}
              >
                Ajustes
              </ButtonAnt>
            </div>
            <div className="subtitle">Personalización de cartilla</div>
            <div className="bingo-card">
              <div className="item">
                <div className="text">Titulo y columnas</div>
                <Input
                  marginBottom={"0"}
                  variant="primary"
                  type="text"
                  name="title"
                  ref={register}
                  error={errors.title}
                  defaultValue={"Título"}
                  placeholder="Titulo"
                  className="title-input"
                />
                <div className="bingo-inputs">
                  <Input
                    marginBottom={"0"}
                    variant="primary"
                    type="text"
                    name="b"
                    ref={register}
                    error={errors.b}
                    defaultValue={"B"}
                    className="input-bingo"
                    maxLength={1}
                  />
                  <Input
                    marginBottom={"0"}
                    variant="primary"
                    type="text"
                    name="i"
                    ref={register}
                    error={errors.i}
                    defaultValue={"I"}
                    className="input-bingo"
                    maxLength={1}
                  />
                  <Input
                    marginBottom={"0"}
                    variant="primary"
                    type="text"
                    name="n"
                    ref={register}
                    error={errors.n}
                    defaultValue={"N"}
                    className="input-bingo"
                    maxLength={1}
                  />
                  <Input
                    marginBottom={"0"}
                    variant="primary"
                    type="text"
                    name="g"
                    ref={register}
                    error={errors.g}
                    defaultValue={"G"}
                    className="input-bingo"
                    maxLength={1}
                  />
                  <Input
                    marginBottom={"0"}
                    variant="primary"
                    type="text"
                    name="o"
                    ref={register}
                    error={errors.o}
                    defaultValue={"O"}
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
                    <div className="card-title">{watch("title")}</div>
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
                <input
                  type="color"
                  name="backgroundColor"
                  defaultValue={darkTheme.basic.secondary}
                  ref={register}
                  error={errors.backgroundColor}
                />
                <label htmlFor="backgroundColor">
                  {watch("backgroundColor")}
                </label>
              </div>
              <div className="color-pick">
                <input
                  type="color"
                  name="titleColor"
                  defaultValue={darkTheme.basic.whiteLight}
                  ref={register}
                  error={errors.titleColor}
                />
                <label htmlFor="titleColor">{watch("titleColor")}</label>
              </div>
              <div className="color-pick">
                <input
                  type="color"
                  name="blocksColor"
                  defaultValue={darkTheme.basic.primary}
                  ref={register}
                  error={errors.blocksColor}
                />
                <label htmlFor="blocksColor">{watch("blocksColor")}</label>
              </div>
              <div className="color-pick">
                <input
                  type="color"
                  name="numberColor"
                  defaultValue={darkTheme.basic.whiteLight}
                  ref={register}
                  error={errors.numberColor}
                />
                <label htmlFor="numberColor">{watch("numberColor")}</label>
              </div>
            </div>
            <FileUpload
              preview={"false"}
              fileName="backgroundImage"
              sizes="300x350"
              onChange={(img) => setBackgroundImg(img)}
            />
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
              <CardContainer
                backgroundColor={watch("backgroundColor")}
                titleColor={watch("titleColor")}
                blocksColor={watch("blocksColor")}
                numberColor={watch("numberColor")}
              >
                <div className="card-title">{watch("title")}</div>
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

      .name-input {
        background: ${(props) => props.theme.basic.whiteLight} !important;
        font-family: Lato;
        font-style: normal;
        font-weight: bold;
        font-size: 15px;
        line-height: 18px;
        border: none;
        box-sizing: border-box;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        color: ${(props) => props.theme.basic.grayLight};
        border-radius: 4px;
        height: 36px;
      }
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

      .title-input {
        background: ${(props) => props.theme.basic.whiteLight} !important;
        font-family: Lato;
        font-style: normal;
        font-weight: bold;
        font-size: 15px;
        line-height: 18px;
        border: none;
        box-sizing: border-box;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        color: ${(props) => props.theme.basic.grayLight};
        border-radius: 4px;
        height: 42px;
      }

      .bingo-inputs {
        margin-top: 1rem;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 5px;

        .input-bingo {
          background: ${(props) => props.theme.basic.whiteLight} !important;
          padding: 0 !important;
          text-align: center;
          font-family: Lato;
          font-style: normal;
          font-weight: bold;
          font-size: 15px;
          line-height: 18px;
          border-radius: 4px;
          border: none !important;
          height: 28px;
          color: ${(props) => props.theme.basic.grayLight};
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
        align-items: center;
        justify-content: space-evenly;
      }

      input[type="color"] {
        width: 29px;
        height: 36px;
        border: none;
        outline: none;
        border-radius: 3px;
        -webkit-appearance: none;
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
      }
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
      
      .bingo-inputs {
        max-width: 160px;
        margin: 0 auto;
      }
      .bingo-card {
        grid-template-columns: 1fr;
      }
    }
  }
`;

const CardContainer = styled.div`
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
    width: 100%;
    border-collapse: separate;
    border-spacing: 2.5px;

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
      margin: 0 auto;
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
