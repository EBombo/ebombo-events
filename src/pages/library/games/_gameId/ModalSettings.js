import React, { useState, useEffect, useRef } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { darkTheme } from "../../../../theme";
import { ButtonAnt } from "../../../../components/form";
import { mediaQuery } from "../../../../constants";
import get from "lodash/get";
import { Switch, Radio } from "antd";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { firestore } from "../../../../firebase";
import { useRouter } from "next/router";
import { config } from "../../../../firebase";
import { Image } from "../../../../components/common/Image";
import { snapshotToArray } from "../../../../utils";
import defaultTo from "lodash/defaultTo";

export const ModalSettings = (props) => {
  const router = useRouter();
  const inputRef = useRef(null);
  const { folderId } = router.query;
  const [parent, setParent] = useState(null);
  const [audios, setAudios] = useState([]);

  useEffect(() => {
    const fetchParent = async () => {
      if (!folderId) return null;
      const parentRef = await firestore
        .collection("folders")
        .doc(folderId)
        .get();
      setParent(parentRef.data());
    };

    const fetchAudios = () =>
      firestore
        .collection("audios")
        .where("deleted", "==", false)
        .onSnapshot((audiosSnapshot) =>
          setAudios(snapshotToArray(audiosSnapshot))
        );

    fetchParent();
    fetchAudios();
  }, []);

  const schema = object().shape({
    video: string(),
    music: string(),
  });

  const { handleSubmit, register } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const manageFile = async (e) => {
    const file = e.target.files[0];
    props.setCoverImgUrl(file);
  };

  const saveChanges = (data) => {
    props.setVideo(data.video);
    props.setAudio(data.audio);
    props.setIsVisibleModalSettings(false);
  };

  const resetToDefault = () => {
    props.setCoverImgUrl(get(props, "game.coverImgUrl", false));
    props.setOwnBranding(get(props, "game.ownBranding", true));
    props.setVideo(get(props, "game.video", null));
    props.setAllowDuplicate(get(props, "game.allowDuplicate", false));
    props.setVisibility(get(props, "game.visibility", true));
    props.setAudio(get(props, "game.audio", null));
    props.setIsVisibleModalSettings(false);
  };

  return (
    <ModalContainer
      footer={null}
      closable={false}
      visible={props.isVisibleModalSettings}
      padding={"1rem"}
      background={darkTheme.basic.whiteLight}
      onCancel={() =>
        props.setIsVisibleModalSettings(!props.isVisibleModalSettings)
      }
    >
      <SettingsContainer>
        <div className="title">Ajustes</div>

        <form onSubmit={handleSubmit(saveChanges)}>
          <div className="main-container">
            <div className="left-side">
              <div className="label">Guardar en</div>
              <div className="path">{get(parent, "name", "Mis Juegos")}</div>

              <div className="label">Branding</div>
              <div className="branding">
                Usar branding propio
                <Switch
                  defaultChecked={props.ownBranding}
                  onChange={() => props.setOwnBranding(!props.ownBranding)}
                />
              </div>

              <div className="label">Video del Lobby</div>
              <input
                className="input-video"
                type="url"
                name="video"
                defaultValue={get(props, "video", "")}
                placeholder="Pegar link de youtube"
                ref={register}
              />

              <div className="label">Visibilidad</div>
              <Radio.Group
                onChange={() => props.setVisibility(!props.visibility)}
                value={props.visibility}
              >
                <Radio value={true}>Organización</Radio>
                <Radio value={false}>Nadie</Radio>
              </Radio.Group>
            </div>

            <div className="right-side">
              <div className="label">Imagen de portada</div>
              {props.coverImgUrl ? (
                <div className="cover">
                  <Image
                    src={URL.createObjectURL(props.coverImgUrl)}
                    width="212px"
                    height="121px"
                    size="cover"
                    margin="0"
                  />
                  <ButtonAnt
                    color="secondary"
                    onClick={() => inputRef.current.click()}
                  >
                    Cambiar
                  </ButtonAnt>
                </div>
              ) : (
                <div
                  className="upload-file"
                  onClick={() => inputRef.current.click()}
                >
                  <Image
                    src={`${config.storageUrl}/resources/no-image.svg`}
                    width="40px"
                    height="40px"
                    size="contain"
                    margin="0"
                  />
                  <span>Añade una imagen de cover</span>
                </div>
              )}
              <input type="file" ref={inputRef} onChange={manageFile} hidden />

              <div className="label">
                Permitir duplicar{" "}
                <Switch
                  defaultChecked
                  onChange={() =>
                    props.setAllowDuplicate(!props.allowDuplicate)
                  }
                />
              </div>

              <div className="label">Musica del lobby</div>
              <select ref={register} name="audio" className="audio-select">
                {defaultTo(audios, []).map((audio) => (
                  <option value={audio.audioUrl}>{audio.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="btns-container">
            <ButtonAnt
              variant={"contained"}
              color={"gray"}
              onClick={() => resetToDefault()}
            >
              Cerrar
            </ButtonAnt>
            <ButtonAnt
              variant={"contained"}
              color={"secondary"}
              htmlType="submit"
            >
              Listo
            </ButtonAnt>
          </div>
        </form>
      </SettingsContainer>
    </ModalContainer>
  );
};

const SettingsContainer = styled.div`
  width: 100%;

  .btns-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 1rem 0;
  }

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 18px;
    color: ${(props) => props.theme.basic.blackDarken};
    text-align: center;
  }

  .input-video {
    margin-top: 5px;
    width: 100%;
    height: 36px;
    background: ${(props) => props.theme.basic.whiteLight} !important;
    color: ${(props) => props.theme.basic.grayLight} !important;
    border-width: thin !important;
    border-color: ${(props) => props.theme.basic.grayLighten} !important;
    border-style: solid !important;
    border-radius: 4px !important;
    padding: 0 0.5rem;
  }

  .label {
    font-family: Lato;
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    line-height: 18px;
    color: ${(props) => props.theme.basic.blackDarken};
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .branding,
  .path {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5px;
    height: 36px;
    border: 1px solid ${(props) => props.theme.basic.grayLighten};
    box-sizing: border-box;
    border-radius: 4px;
    color: ${(props) => props.theme.basic.blackDarken};
    margin-top: 5px;
  }

  .audio-select {
    width: 100%;
    height: 36px;
    border: 1px solid ${(props) => props.theme.basic.grayLighten};
    box-sizing: border-box;
    border-radius: 4px;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    color: ${(props) => props.theme.basic.blackDarken};
  }

  .main-container {
    .cover {
      display: flex;
      align-items: center;
      grid-gap: 1rem;
      margin-top: 0.5rem;
    }

    .upload-file {
      margin-top: 0.5rem;
      width: 212px;
      height: 121px;
      background: ${(props) => props.theme.basic.whiteLight};
      border: 1px solid ${(props) => props.theme.basic.grayLighten};
      box-sizing: border-box;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      flex-direction: column;

      span {
        font-family: Lato;
        font-style: normal;
        font-weight: normal;
        font-size: 11px;
        line-height: 13px;
        text-align: center;
        color: ${(props) => props.theme.basic.grayLight};
      }
    }
  }

  ${mediaQuery.afterTablet} {
    .title {
      font-size: 32px;
      line-height: 38px;
      text-align: left;
    }

    .main-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 1rem;
      margin-top: 0.5rem;

      .cover {
        display: flex;
        align-items: center;
        flex-direction: column;
        grid-gap: 1rem;
      }
    }
  }
`;
