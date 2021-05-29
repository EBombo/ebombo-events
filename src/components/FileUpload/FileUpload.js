import React, { useEffect, useRef, useState } from "reactn";
import { useResizeImage, useUploadToStorage } from "../../utils/useHooks";
import styled from "styled-components";
import { CloudUploadOutlined } from "@ant-design/icons";
import { ButtonBombo, Icon, Image } from "../../components";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";

export const FileUpload = (props) => {
  const { resize } = useResizeImage();
  const { uploadToStorageAndGetURL } = useUploadToStorage();

  const inputRef = useRef(null);

  const [previewFile, setPreviewFile] = useState(get(props, "file", null));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    props.file && setPreviewFile(props.file);
  }, [props.file]);

  const manageFile = async (event) => {
    if (
      !event.target.files ||
      event.target.files.length === 0 ||
      !event.target.files[0]
    )
      return setPreviewFile(null);

    setLoading(true);

    const file = event.target.files[0];
    const fileSuffix = file.name.split(".")[1];
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

    return props.afterUpload
      ? await uploadFile(file, fileSuffix, null, type)
      : file;
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
            url: await uploadFile(
              images64.split(",")[1],
              fileSuffix,
              size,
              type
            ),
            file,
            size,
            type,
          }
        : {
            image: images64.split(",")[1],
            filePath: props.filePath,
            fileName: `${props.fileName}_${size}`,
            fileSuffix,
            size,
            type,
          };
    });

    return await Promise.all(promisesImages);
  };

  const uploadFile = async (
    fileBase64,
    fileSuffix,
    size,
    type,
    fileName = `${props.fileName}_${size}`
  ) =>
    await uploadToStorageAndGetURL(
      fileBase64,
      props.filePath,
      fileName,
      fileSuffix,
      props.bucket,
      null,
      type
    );

  return (
    <UploadContainer>
      {previewFile ? (
        <div className="image-container">
          {get(props, "accept", "image").includes("image") ? (
            <Image
              src={previewFile}
              height="100px"
              width="100px"
              margin="0"
              borderRadius="5px"
            />
          ) : (
            <>
              {previewFile} <Icon type="check-circle" />
            </>
          )}
        </div>
      ) : (
        <div className="dashed" onClick={() => inputRef.current.click()}>
          <CloudUploadOutlined />
        </div>
      )}
      <div className="input-container">
        <ButtonBombo
          className="btn-upload-image"
          variant="outlined"
          color="primary"
          onClick={() => inputRef.current.click()}
          loading={loading}
          key={loading}
        >
          {props.buttonLabel || "Subir Imagen"}
        </ButtonBombo>
        <input
          type="file"
          ref={inputRef}
          onChange={manageFile}
          accept={props.accept || "image/*" || "application/pdf"}
          hidden
        />
      </div>
    </UploadContainer>
  );
};

const UploadContainer = styled.div`
  width: 200px;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  flex-direction: column;

  .image-container {
    color: ${(props) => props.theme.basic.primary};
    font-family: AdihausDIN;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;

    svg {
      color: ${(props) => props.theme.basic.primary};
    }
  }

  .dashed {
    height: 100px;
    width: 100px;
    border: 1px dashed ${(props) => props.theme.basic.grayLighten};
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      width: 35px;
      height: 35px;
    }
  }

  .input-container {
    margin-top: 0.5rem;
  }
`;
