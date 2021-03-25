import React, {forwardRef, useEffect, useState} from "react";
import styled from "styled-components";
import {Button as ButtonAntd, Modal as ModalAntd, Upload as AntUpload,} from "antd";
import {
  advertisementsStorageBucket,
  claimsStorageBucket,
  documentsStorageBucket,
  gamesStorageBucket,
  landingStorageBucket,
  settingsStorageBucket,
  storage as storageDefault,
  tournamentsStorageBucket,
  tournamentTeamsStorageBucket,
  usersStorageBucket,
} from "../../firebase";
import {timeoutPromise} from "../../utils";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import defaultTo from "lodash/defaultTo";
import {v4 as uuid} from "uuid";
import {btnPrimaryGeneral, mediaQuery} from "../../styles/constants";
import {Icon} from "./Icons";

const buckets = {
  claims: claimsStorageBucket,
  documents: documentsStorageBucket,
  advertisements: advertisementsStorageBucket,
  games: gamesStorageBucket,
  users: usersStorageBucket,
  landing: landingStorageBucket,
  tournaments: tournamentsStorageBucket,
  tournamentTeams: tournamentTeamsStorageBucket,
  settings: settingsStorageBucket,
};

export const Upload = forwardRef((props, ref) => {
  const storage = get(buckets, props.bucket, storageDefault);

  const [isUploading, setIsUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [isErrorUpload, setIsErrorUpload] = useState(false);
  const [files, setFiles] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const [fileUrlThumb, setFileUrlThumb] = useState("");

  useEffect(() => {
    const _fileUrl = get(props.document, props.name, null);

    let _fileUrlThumb = null;
    if (props.isImage) {
      _fileUrlThumb = get(props.document, `${props.name}Thumb`, null);
    }

    if (!_fileUrl || (props.isImage && !_fileUrlThumb)) return;

    setFiles([
      {
        name: props.fileName,
        thumbUrl: _fileUrl,
        uid: uuid(),
      },
    ]);

    setFileUrl(_fileUrl);
    setFileUrlThumb(_fileUrlThumb);
  }, [props.document]);

  const uploadFile = async (file) => {
    const fileSuffix = file.name.split(".").pop();

    _setIsUploading(true);
    setIsErrorUpload(false);

    console.log("file", `${props.filePath}/${props.fileName}.${fileSuffix}`);

    const uploadTask = storage
      .ref(`${props.filePath}/${props.fileName}.${fileSuffix}`)
      .put(file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log("Progress", progress);
      },
      (error) => {
        console.log("Error uploading", error);
        setIsErrorUpload(true);
        setFiles([]);

        _setIsUploading(false);
      },
      async () => {
        try {
          const _fileUrl = await storage
            .ref(props.filePath)
            .child(`${props.fileName}.${fileSuffix}`)
            .getDownloadURL();
          let _fileUrlThumb = null;

          if (props.isImage) {
            const sizeResized = defaultTo(props.sizeResized, "400x400");
            const fileUrlThumbRef = await storage
              .ref(`${props.filePath}/thumbs`)
              .child(`${props.fileName}_${sizeResized}.${fileSuffix}`);
            _fileUrlThumb = await keepTryingGetThumbURL(10, fileUrlThumbRef);
          }

          setFileUrl(_fileUrl);
          setFileUrlThumb(_fileUrlThumb);

          //When using useState use this props.setImageUrlToDocument
          // props.setImageUrlToDocument && props.setImageUrlToDocument(_fileUrl, _fileUrlThumb, props.document.id);
          props.setImageUrlToDocument &&
            props.setImageUrlToDocument(
              _fileUrl,
              _fileUrlThumb,
              get(props, "document.id", null)
            );

          props.afterUpload &&
            (await props.afterUpload({
              [props.name]: _fileUrl,
              [`${props.name}Thumb`]: _fileUrlThumb,
            }));
        } catch (error) {
          setIsErrorUpload(true);
          setFiles([]);
          console.error(error);
        } finally {
          _setIsUploading(false);
        }
      }
    );
  };

  const keepTryingGetThumbURL = async (triesCount, storageRef) => {
    console.log("Getting thumb download URL...");

    if (triesCount < 0) {
      return Promise.reject("out of tries");
    }

    try {
      return await storageRef.getDownloadURL();
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        await timeoutPromise(1000);
        return keepTryingGetThumbURL(triesCount - 1, storageRef);
      } else {
        console.error(error);
        return Promise.reject(error);
      }
    }
  };

  const _setIsUploading = (value) => {
    setIsUploading(value);
    props.statusUploading && props.statusUploading(value);
  };

  const onRemove = () => {
    setFileUrl("");
    setFileUrlThumb("");
    //When using useState use this props.setImageUrlToDocument
    // props.setImageUrlToDocument && props.setImageUrlToDocument("", "", props.document.id);
    props.onRemove && props.onRemove(get(props, "document.id"));
  };

  const onChange = (info) => {
    const uploadFileList = [...info.fileList];

    setFiles(uploadFileList.slice(-1));
  };

  return (
    <React.Fragment>
      <Container>
        {props.label && <Label required={props.required}>{props.label}</Label>}
        <StyledUpload
          styled={props.styled}
          listType={get(props, "listType", "picture")}
          accept={get(props, "accept", "*")}
          action={uploadFile}
          onChange={onChange}
          onPreview={() => setPreviewVisible(true)}
          fileList={files}
          onRemove={onRemove}
        >
          {isEmpty(files) && (
            <Button disabled={isUploading}>
              {props.icon !== false && <Icon type="upload" />}
              {props.buttonText}
            </Button>
          )}
        </StyledUpload>
        <input type="hidden" ref={ref} name={props.name} value={fileUrl} />
        {props.isImage && (
          <input
            type="hidden"
            ref={ref}
            name={`${props.name}Thumb`}
            value={fileUrlThumb}
          />
        )}
        {isUploading && (
          <UploadingImage>
            <Icon type="loading" spin /> Subiendo imagen ...
          </UploadingImage>
        )}
        {isErrorUpload && (
          <UploadError>
            Error al subir la imagen!. Inténtelo de nuevo.
          </UploadError>
        )}
        {get(props.errors, props.name, false) && (
          <Error>{get(props.errors, `${props.name}.message`, "")}</Error>
        )}
      </Container>
      {previewVisible && (
        <Modal
          footer={null}
          onCancel={() => setPreviewVisible(false)}
          visible={previewVisible}
        >
          <br />
          {props.isImage ? (
            <ModalImage src={fileUrl} alt="thumbImage" />
          ) : (
            "Solo se puede visualizar las imagenes subidas"
          )}
          {props.download !== false && (
            <Button
              key="download"
              width="150px"
              onClick={() => {
                console.log("fileUrl", fileUrl);
                window.open(fileUrl, "_blank");
              }}
            >
              <Icon type="download" />
              Descargar imagen
            </Button>
          )}
        </Modal>
      )}
    </React.Fragment>
  );
});

const Modal = styled(ModalAntd)`
  top: 0 !important;

  ${mediaQuery.afterTablet} {
    top: 50px !important;
  }

  .ant-modal-content {
    .ant-modal-body {
      background: ${(props) => props.theme.basic.blackDarken};
      color: ${(props) => props.theme.basic.white};
    }

    .ant-modal-close-x {
      color: ${(props) => props.theme.basic.primary};
    }
  }
`;

const ModalImage = styled.img`
  width: 100%;
  margin: 1.5rem auto;
`;

const Container = styled.div`
  text-align: center;
`;

const UploadError = styled.div`
  color: ${(props) => props.theme.basic.danger};
  margin: 5px 0;
  font-size: 15px;
`;

const UploadingImage = styled.div`
  color: ${(props) => props.theme.basic.primary};
  font-size: 12px;
  margin-top: 10px;

  i {
    font-size: 15px !important;
    margin-right: 5px !important;
  }
`;

const StyledUpload = styled(AntUpload)`
  .ant-upload-list {
    background: initial;
    margin: 0 auto;
    width: ${(props) => get(props.styled, "width", "initial")};
    min-width: ${(props) => get(props.styled, "minWidth", "initial")};
  }

  .ant-upload-list-picture {
    .ant-upload-list-item {
      border: 1px solid ${(props) => props.theme.basic.primary};
      color: ${(props) => props.theme.basic.primary};
    }
  }

  .ant-upload-picture-card-wrapper {
    ${(props) =>
      props.listType === "picture-card" &&
      `
            width: initial !important;
        `}
  }

  .ant-upload-select-picture-card {
    background: none;
    border: none;
  }

  .ant-upload-list-item-name {
    cursor: pointer;
    color: ${(props) => props.theme.basic.white} !important;
    font: 0/0 a;

    ::before {
      ${(props) =>
        props.listType === "picture" &&
        `
                display: inline-block;
                margin-right: 4px;
                color: ${(props) => props.theme.basic.white};
                font-size: 14px;
                line-height: 1;
                content: "Imagen";
            `}
    }
  }

  .ant-upload-list-item-card-actions {
    padding-right: 1rem;

    svg {
      color: ${(props) => props.theme.basic.danger};
    }

    .anticon {
      padding-right: 0 !important;
      color: ${(props) => props.theme.basic.blackDarken};
    }
  }

  .ant-upload-list-item-error {
    color: ${(props) =>
      props.isErrorUpload
        ? props.theme.basic.danger
        : props.theme.basic.primary};
    border-color: ${(props) =>
      props.isErrorUpload
        ? props.theme.basic.danger
        : props.theme.basic.primary};
  }

  .ant-upload-list-item-info {
    ::before {
      position: initial;
      z-index: initial;
      width: initial;
      height: initial;
      background-color: initial;
      opacity: initial;
      -webkit-transition: all 0.3s;
      transition: all 0.3s;
      content: "";
    }

    span {
      ${(props) =>
        props.listType === "picture" &&
        `
                display: flex;
                justify-content: center;
                align-items: center;
            `}
    }
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 15px;

  ${(props) =>
    props.required &&
    `
    ::before {
        display: inline-block;
        margin-right: 4px;
        color: #f5222d;
        font-size: 14px;
        line-height: 1;
        content: "*";
    }
  `}
`;

const Error = styled.p`
  font-size: 12px;
  color: ${(props) => props.theme.basic.danger};
`;

const Button = styled(ButtonAntd)`
  cursor: pointer;
  font-weight: normal !important;
  border-radius: 10px;
  padding: 10px 30px;
  border: 2px solid ${(props) => props.theme.basic.primary} !important;
  ${(props) =>
    btnPrimaryGeneral(
      "0.9rem",
      "normal",
      "10px auto",
      "auto",
      "auto",
      props.theme.basic.primary,
      props.theme.basic.blackDarken
    )};
`;
