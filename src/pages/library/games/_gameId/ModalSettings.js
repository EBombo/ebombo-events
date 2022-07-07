import React, { useEffect, useState } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { darkTheme } from "../../../../theme";
import { ButtonAnt, Select, Switch } from "../../../../components/form";
import { mediaQuery } from "../../../../constants";
import get from "lodash/get";
import { Radio } from "antd";
import { object, string } from "yup";
import { Controller, useForm } from "react-hook-form";
import { firestore } from "../../../../firebase";
import { snapshotToArray } from "../../../../utils";
import { FileUpload } from "../../../../components/common/FileUpload";
import { ModalMove } from "../../../../components/common/ModalMove";
import { useRouter } from "next/router";
import { useTranslation } from "../../../../hooks";

export const ModalSettings = (props) => {
  const router = useRouter();

  const { adminGameId } = router.query;

  const {t} = useTranslation("modal-settings")

  const [audios, setAudios] = useState([]);
  const [isVisibleModalMove, setIsVisibleModalMove] = useState(false);

  useEffect(() => {
    const fetchAudios = () =>
      firestore
        .collection("audios")
        .where("deleted", "==", false)
        .onSnapshot((audiosSnapshot) => setAudios(snapshotToArray(audiosSnapshot)));

    fetchAudios();
  }, []);

  const schema = object().shape({
    video: string(),
    music: string(),
  });

  const { handleSubmit, register, control, errors } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveChanges = (data) => {
    const _audio = audios.find((audio) => audio.id === data.audioId);

    props.setVideo(data.video);
    props.setAudio(_audio);
    props.setIsVisibleModalSettings(false);
  };

  const moveToFolder = (folder) => {
    router.push({
      query: { adminGameId, folderId: folder.id },
    });
    props.setParent(folder);
  };

  return (
    <ModalContainer
      footer={null}
      closable={false}
      visible={props.isVisibleModalSettings}
      padding={"1rem"}
      background={darkTheme.basic.whiteLight}
      onCancel={() => props.setIsVisibleModalSettings(!props.isVisibleModalSettings)}
    >
      <ModalMove
        moveToFolder={moveToFolder}
        setIsVisibleModalMove={setIsVisibleModalMove}
        isVisibleModalMove={isVisibleModalMove}
        {...props}
      />
      <SettingsContainer>
        <div className="title">Ajustes</div>

        <form onSubmit={handleSubmit(saveChanges)}>
          <div className="main-container">
            <div className="left-side">
              <div className="w-[100%] flex items-center mt-4 justify-between mt-4 text-[15px] leading-[18px] font-[700] text-blackDarken">{t("save")}</div>
              <div className="path">
                {get(props, "parent.name", t("my-games"))}
                <ButtonAnt className="btn-move" onClick={() => setIsVisibleModalMove(true)}>
                  {t("change")}
                </ButtonAnt>
              </div>
              {/*<div className="w-[100%] flex items-center mt-4 justify-between mt-4 text-[15px] leading-[18px] font-[700] text-blackDarken">Branding</div>*/}
              {/*<div className="branding">*/}
              {/*  Usar branding propio*/}
              {/*  <Switch defaultChecked={props.ownBranding} onChange={() => props.setOwnBranding(!props.ownBranding)} />*/}
              {/*</div>*/}
              {/*<div className="w-[100%] flex items-center mt-4 justify-between mt-4 text-[15px] leading-[18px] font-[700] text-blackDarken">Video del Lobby</div>*/}
              {/*<div className="input-container">*/}
              {/*  <Input*/}
              {/*    type="url"*/}
              {/*    name="video"*/}
              {/*    defaultValue={get(props, "video", "")}*/}
              {/*    placeholder="Pegar link de youtube"*/}
              {/*    ref={register}*/}
              {/*    error={errors.video}*/}
              {/*  />*/}
              {/*</div>*/}
              <div className="w-[100%] flex items-center mt-4 justify-between mt-4">
                <div className="text-[15px] leading-[18px] font-[700] text-blackDarken">
                  {t("allow-duplicate")}
                </div>
                <Switch
                  size="medium"
                  checked={props.allowDuplicate}
                  onChange={(event) => {
                    event.preventDefault();
                    props.setAllowDuplicate(!props.allowDuplicate);
                  }}
                />
              </div>

              <div className="w-[100%] flex items-center mt-4 justify-between mt-4 text-[15px] leading-[18px] font-[700] text-blackDarken">{t("lobby-music")}</div>
              <div className="input-container">
                <Controller
                  name="audioId"
                  control={control}
                  as={
                    <Select
                      placeholder="Seleccione Audio"
                      showSearch
                      virtual={false}
                      error={errors.audioId}
                      defaultValue={get(props, "audio.id", "")}
                      optionFilterProp="children"
                      optionsdom={audios.map((audio) => ({
                        key: audio.id,
                        code: audio.id,
                        name: audio.title,
                      }))}
                    />
                  }
                />
              </div>
              <div className="w-[100%] flex items-center mt-4 justify-between mt-4 text-[15px] leading-[18px] font-[700] text-blackDarken">{t("visibility")}</div>
              <Radio.Group onChange={() => props.setVisibility(!props.visibility)} value={props.visibility}>
                <Radio value={true}>{t("organization")}</Radio>
                <Radio value={false}>{t("nobody")}</Radio>
              </Radio.Group>
            </div>

            <div className="right-side">
              <div className="w-[100%] flex items-center mt-4 justify-between mt-4 mb-2 text-[15px] leading-[18px] font-[700] text-blackDarken">{t("cover-image")}</div>
              <FileUpload
                file={props.coverImgUrl}
                preview={true}
                fileName="coverImgUrl"
                filePath={props.path}
                sizes="300x350"
                disabled={props.isLoading}
                afterUpload={(coverImgs) => props.setCoverImgUrl(coverImgs[0].url)}
              />
            </div>
          </div>
          <div className="btns-container">
            <ButtonAnt
              variant="contained"
              color="default"
              className="btn"
              onClick={() => props.setIsVisibleModalSettings(false)}
            >
              {t("close")}
            </ButtonAnt>
            <ButtonAnt variant={"contained"} color={"secondary"} htmlType="submit" className="btn">
              {t("ready")}
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
    position: relative;

    .btn-move {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 10px;
      line-height: 12px;
      width: 60px;
      height: 18px;
      padding: 5px;
    }
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

  .btn {
    padding: 5px 40px;
  }

  .input-container {
    margin-top: 5px;

    .ant-select {
      margin-bottom: 0 !important;
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
