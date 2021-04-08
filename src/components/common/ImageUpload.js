import React, {useEffect, useRef, useState} from "reactn";
import {useResizeImage, useUploadToStorage} from "../../utils/useHooks";
import styled from "styled-components";
import {Image} from "./Image";
import {CloudUploadOutlined} from "@ant-design/icons";
import {ButtonBombo} from "./ButtonBombo";

export const ImageUpload = (props) => {
    const {resize} = useResizeImage();
    const {uploadToStorageAndGetURL} = useUploadToStorage();

    const inputRef = useRef(null);

    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        props.file && setPreviewImage(props.file);
    }, []);

    const manageImage = async (event) => {
        if (
            !event.target.files ||
            event.target.files.length === 0 ||
            !event.target.files[0]
        )
            return setPreviewImage(null);

        setLoading(true);

        const sizes = props.sizes.split(",");
        const fileSuffix = event.target.files[0].name.split(".")[1];
        setPreviewImage(URL.createObjectURL(event.target.files[0]));

        const promisesImages = sizes.map(async (size) => {
            const width = parseInt(size.split("x")[0]);
            const height = parseInt(size.split("x")[1]);

            const images64 = await resize(event, width, height);

            return props.afterUpload
                ? await uploadImage(images64.split(",")[1], fileSuffix, size)
                : images64;
        });

        const images = await Promise.all(promisesImages);

        setLoading(false);

        if (props.afterUpload) return props.afterUpload(images);
        if (props.onChange) return props.onChange(images);
    };

    const uploadImage = async (imgBase64, fileSuffix, size) =>
        await uploadToStorageAndGetURL(
            imgBase64,
            props.filePath,
            `${props.fileName}_${size}`,
            fileSuffix,
            props.bucket
        );

  return (
    <UploadContainer>
      {previewImage ? (
        <div className="image-container">
          <Image
            src={previewImage}
            height="100px"
            width="100px"
            margin="0"
            borderRadius="5px"
          />
        </div>
      ) : (
        <div className="dashed">
          <CloudUploadOutlined />
        </div>
      )}
      <div className="input-container">
        <ButtonBombo
          onClick={() => inputRef.current.click()}
          loading={loading}
          key={loading}
        >
          Subir Imagen
        </ButtonBombo>
        <input type="file" ref={inputRef} onChange={manageImage} hidden />
      </div>
    </UploadContainer>
  );
};

const UploadContainer = styled.div`
  width: 200px;
  display: flex;
  align-items: center;
  flex-direction: column;

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
