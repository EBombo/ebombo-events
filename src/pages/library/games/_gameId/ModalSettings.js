import React, { useState, useEffect } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { darkTheme } from "../../../../theme";
import { ButtonAnt, Input } from "../../../../components/form";
import { mediaQuery } from "../../../../constants";
import get from "lodash/get";
import { Switch, Radio } from "antd";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { FileUpload } from "../../../../components/common/FileUpload";
import { firestore } from "../../../../firebase";
import {useRouter} from "next/router";

export const ModalSettings = (props) => {
  const router = useRouter();
  const { folderId } = router.query;
  const [parent, setParent] = useState(null);

  useEffect(() => {
    const fetchParent = async () => {
      if (!folderId) return null;
      const parentRef = await firestore
        .collection("folders")
        .doc(folderId)
        .get();
      setParent(parentRef.data());
    };
    fetchParent();
  }, []);

  const schema = object().shape({
    video: string(),
    music: string(),
  });

  const { handleSubmit, register } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveChanges = (data) => {
    props.setVideo(data.video);
    props.setMusic(data.music);
    props.setIsVisibleModalSettings(false);
  };

  const resetToDefault = () => {
    props.setImageUrl(false);
    props.setOwnBranding(true);
    props.setVideo(null);
    props.setAllowDuplicate(true);
    props.setVisibility(true);
    props.setMusic(null);
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
              <div className="path">
                {get(parent, "name", "Mis Juegos")}
              </div>

              <div className="label">Branding</div>
              <div className="branding">
                Usar branding propio
                <Switch
                  defaultChecked
                  onChange={() => props.setOwnBranding(!props.ownBranding)}
                />
              </div>

              <div className="label">Video del Lobby</div>
              <input
                className="input-video"
                type="url"
                name="video"
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
              <FileUpload
                fileName="imageUrl"
                sizes="300x350"
                onChange={(img) => props.setImageUrl(img)}
              />

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
              <input
                className="input-video"
                name="music"
                type="url"
                placeholder="Pegar link de youtube"
                ref={register}
              />
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
    }
  }
`;
