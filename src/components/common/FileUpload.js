import React, { useEffect, useRef, useState } from "reactn";
import styled from "styled-components";
import { Image } from "./Image";
import get from "lodash/get";
import { ButtonAnt } from "../form";
import { useResizeImage, useTranslation, useUploadToStorage } from "../../hooks";
import { Icon } from "./Icons";
import defaultTo from "lodash/defaultTo";
import { config } from "../../firebase";
import { mediaQuery } from "../../constants";

export const FileUpload = (props) => {
  const { resize } = useResizeImage();
  const { uploadToStorageAndGetURL } = useUploadToStorage();

  const { t } = useTranslation("components.file-upload");

  const inputRef = useRef(null);

  const [previewFile, setPreviewFile] = useState(get(props, "file", null));
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);

  useEffect(() => {
    props.file && setPreviewFile(props.file);
  }, [props.file]);

  const manageFile = async (event) => {
    if (!event.target.files || event.target.files.length === 0 || !event.target.files[0]) return setPreviewFile(null);

    setLoading(true);

    //const sizeFile=event.target.files[0].size;
    //if(sizeFile>=props.limitMb)return notfication;
    console.log("event.target.files", event.target.files);

    const file = event.target.files[0];
    const fileSuffix = file.name.split(".")[1];
    setFileName(event.target.files[0].name);
    const type = file.type;

    const response = defaultTo(type, "image").includes("image")
      ? await resizeImage(file, fileSuffix, type)
      : await actionFile(file, fileSuffix, type);

    setLoading(false);

    if (props.afterUpload) return props.afterUpload(response);
    if (props.onChange) return props.onChange(response);
  };

  const actionFile = async (file, fileSuffix, type) => {
    setPreviewFile(file.name);

    return props.afterUpload ? await uploadFile(file, fileSuffix, null, type) : file;
  };

  const resizeImage = async (file, fileSuffix, type) => {
    const sizes = get(props, "sizes", "500x500").split(",");

    setPreviewFile(URL.createObjectURL(file));

    const promisesImages = sizes.map(async (size) => {
      const width = parseInt(size.split("x")[0]);
      const height = parseInt(size.split("x")[1]);

      const images64 = await resize(file, width, height);

      return props.afterUpload
        ? {
            url: await uploadFile(images64.split(",")[1], fileSuffix, size, type),
            file,
            size,
            type,
          }
        : {
            image: images64.split(",")[1],
            fileName: `${props.fileName}_${size}`,
            file,
            fileSuffix,
            size,
            type,
          };
    });

    return await Promise.all(promisesImages);
  };

  const uploadFile = async (fileBase64, fileSuffix, size, type, fileName = `${props.fileName}_${size}`) =>
    await uploadToStorageAndGetURL(fileBase64, props.filePath, fileName, fileSuffix, props.bucket, null, type);

  return (
    <UploadContainer {...props}>
      {previewFile && props.preview && (
        <div className="cover">
          <Image
            className="cover-image"
            src={previewFile}
            width="100%"
            height="100%"
            size="cover"
            margin="0"
            onClick={() => inputRef.current.click()}
            cursor="pointer"
          />
        </div>
      )}
      {!previewFile && props.preview && (
        <div className="upload-file" onClick={() => inputRef.current.click()}>
          <ButtonAnt padding="1rem">
            <Image
              src={`${config.storageUrl}/resources/plus-icon.svg`}
              width="22px"
              height="22px"
              size="contain"
              margin="0"
            />
          </ButtonAnt>
          <div className="text-['Lato'] text-[14px] leading-[15px] items-center text-grayLight">
            {t("insert-multimedia-label") || "Insertar Multimedia"}
          </div>
        </div>
      )}

      {!props.preview && fileName && !loading && (
        <div className="file-name">
          {fileName} <Icon type="check-circle" />
        </div>
      )}
      {!props.preview && (
        <ButtonAnt
          color="secondary"
          onClick={() => inputRef.current.click()}
          loading={loading}
          disabled={props.disabled}
        >
          {props.buttonLabel || "Subir Imagen"}
        </ButtonAnt>
      )}

      <div className="input-container">
        <input
          type="file"
          accept={props.accept || "image/*" || "application/pdf"}
          ref={inputRef}
          onChange={manageFile}
          hidden
        />
      </div>
    </UploadContainer>
  );
};

const UploadContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  margin: 0;
  width: ${(props) => props.width ?? "212px"};

  .cover {
    width: ${(props) => props.width ?? "212px"};
    height: ${(props) => props.height ?? "121"};
    border: 1px solid ${(props) => props.theme.basic.grayLighten};
    box-sizing: border-box;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    cursor: pointer;
    border-radius: 4px;

    ${mediaQuery.afterMobile} {
      width: ${(props) => props.desktopWidth ?? props.width ?? "212px"};
      height: ${(props) => props.desktopHeight ?? props.height ?? "121px"};
    }
  }

  .upload-file {
    margin-top: 0.5rem;
    width: ${(props) => props.width ?? "212px"};
    height: ${(props) => props.height ?? "121"};
    background: ${(props) => props.theme.basic.whiteLight};
    border: 1px solid ${(props) => props.theme.basic.grayLighten};
    box-sizing: border-box;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    cursor: pointer;

    ${mediaQuery.afterMobile} {
      width: ${(props) => props.desktopWidth ?? props.width ?? "212px"};
      height: ${(props) => props.desktopHeight ?? props.height ?? "121px"};
    }
  }
`;
