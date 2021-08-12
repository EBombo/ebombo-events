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

const bingoCard = [
  [2, 4, 8, 13, 15],
  [16, 22, 25, 27, 30],
  [31, 33, 36, 38, 45],
  [46, 48, 56, 59, 60],
  [61, 63, 68, 72, 75],
];

export const Bingo = (props) => {
  const [coverImg, setCoverImg] = useState(null);
  const [backgroundImg, setBackgroundImg] = useState(null);
  const inputRef = useRef(null);

  const schema = object().shape({
    title: string(),
    name: string().required(),
  });

  const { handleSubmit, register, errors, watch } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const manageFile = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    setCoverImg(file);
  };

  return (
    <BingoContainer>
      <div className="nav">
        <div className="name">Crear bingo 1 - 75</div>
        <Desktop>
          <Anchor variant="primary" onClick={() => console.log("preview")}>
            Vista Previa
          </Anchor>
        </Desktop>
      </div>
      <Tablet>
        <form action="">
          <div className="btns-container">
            <Anchor fontWeight={"bold"} fontSize={"15px"} lineHeight={"18px"}>
              Cancelar
            </Anchor>
            <Anchor
              fontWeight={"bold"}
              fontSize={"15px"}
              lineHeight={"18px"}
              onClick={() => console.log("submit")}
            >
              Guardar
            </Anchor>
          </div>
          {coverImg ? (
            <Image
              src={URL.createObjectURL(coverImg)}
              width={"100%"}
              height={"95px"}
              size={"cover"}
              margin={"0.5rem 0"}
            />
          ) : (
            <>
              <div className="cover" onClick={() => inputRef.current.click()}>
                <Image
                  src={`${config.storageUrl}/resources/no-image.svg`}
                  width={"40px"}
                  height={"40px"}
                  size={"contain"}
                  margin={"0"}
                />
                <div className="description">Añade una imagen de cover</div>
              </div>
              <input
                type="file"
                accept={props.accept || "image/*" || "application/pdf"}
                ref={inputRef}
                onChange={manageFile}
                hidden
              />
            </>
          )}
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
              <label htmlFor="backgroundColor">{watch("titleColor")}</label>
            </div>
            <div className="color-pick">
              <input
                type="color"
                name="blocksColor"
                defaultValue={darkTheme.basic.primary}
                ref={register}
                error={errors.blocksColor}
              />
              <label htmlFor="backgroundColor">{watch("blocksColor")}</label>
            </div>
            <div className="color-pick">
              <input
                type="color"
                name="numberColor"
                defaultValue={darkTheme.basic.whiteLight}
                ref={register}
                error={errors.numberColor}
              />
              <label htmlFor="backgroundColor">{watch("numberColor")}</label>
            </div>
          </div>
          <FileUpload
            preview={"false"}
            fileName="backgroundImage"
            sizes="300x350"
            onChange={(img) => setBackgroundImg(img)}
          />
        </form>
      </Tablet>
      <Desktop>desktop</Desktop>
    </BingoContainer>
  );
};

const BingoContainer = styled.div`
  width: 100%;
  background: ${(props) => props.theme.basic.gray};

  .nav {
    background: ${(props) => props.theme.basic.primary};
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 40px;

    .name {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 15px;
      line-height: 18px;
    }
  }

  form {
    padding: 1rem;

    .btns-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .cover {
      width: 100%;
      height: 85px;
      background: ${props => props.theme.basic.whiteLight};
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      flex-direction: column;
      margin-top: 1rem;

      .description {
        font-family: Lato;
        font-style: normal;
        font-weight: normal;
        font-size: 11px;
        line-height: 13px;
      }
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
    padding: 0 0.5rem;
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
`;
