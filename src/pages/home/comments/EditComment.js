import React, { useState } from "reactn";
import styled from "styled-components";
import { FileUpload } from "../../../components/common/FileUpload";
import { ButtonAnt, Input, TextArea } from "../../../components/form";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import get from "lodash/get";
import { firestore } from "../../../firebase";

const EditComment = (props) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const schema = object().shape({
    subjectName: string().required(),
    subjectJob: string().default(""),
    description: string().required(),
  });

  const { register, handleSubmit, errors } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveComment = async (data) => {
    setLoading(true);

    await firestore
      .collection(`settings/landing/comments`)
      .doc(props.currentComment.id)
      .set({
        ...mapComment(props.currentComment, data),
      });

    props.setIsVisibleModal(false);
    setLoading(false);
  };

  const mapComment = (oldData = null, data) => ({
    ...props.currentComment,
    subjectName: data.subjectName,
    subjectJob: data.subjectJob,
    description: data.description,
    imageUrl: imageUrl ? imageUrl : oldData.imageUrl,
    logoUrl: logoUrl ? logoUrl : oldData.logoUrl,
  });

  return (
    <Container>
      <div className="title">Comentarios</div>
      <form onSubmit={handleSubmit(saveComment)}>
        <div className="input-container">
          <label>Nombre:</label>
          <Input
            type="text"
            variant="primary"
            name="subjectName"
            ref={register}
            error={errors.subjectName}
            required
            defaultValue={get(props, "currentComment.subjectName", "")}
            placeholder="Nombre"
            border={(props) => `1px solid  ${props.theme.basic.primary}`}
            background="transparent"
          />
        </div>

        <div className="input-container">
          <label>Puesto:</label>
          <Input
            type="text"
            variant="primary"
            name="subjectJob"
            ref={register}
            error={errors.subjectJob}
            label="Puesto:"
            defaultValue={get(props, "currentComment.subjectJob", "")}
            placeholder="Cargo o Puesto de trabajo"
            border={(props) => `1px solid  ${props.theme.basic.primary}`}
            background="transparent"
          />
        </div>

        <TextArea
          variant="primary"
          name="description"
          ref={register}
          error={errors.description}
          required
          label="Descripción:"
          defaultValue={get(props, "currentComment.description", "")}
          placeholder="Descripción del comentario"
        />

        <label>Imagen de perfil</label>
        <div className="image-component">
          <FileUpload
            preview={true}
            file={get(props, "currentComment.imageUrl", "")}
            fileName="imageUrl"
            filePath={`/events/comments/${props.currentComment.id}`}
            bucket="landings"
            sizes="300x300"
            afterUpload={(imageUrls) => setImageUrl(imageUrls[0].url)}
          />
        </div>
        <label>Imagen de logo</label>
        <div className="image-component">
          <FileUpload
            preview={true}
            file={get(props, "currentComment.logoUrl", "")}
            fileName="logoUrl"
            filePath={`/events/comments/${props.currentComment.id}`}
            bucket="landings"
            sizes="300x300"
            afterUpload={(logoUrls) => setLogoUrl(logoUrls[0].url)}
            buttonLabel="Agregar logo"
          />
        </div>
        <div className="buttons-container">
          <ButtonAnt variant="contained" color="primary" loading={loading} disabled={loading} htmlType="submit">
            Guardar
          </ButtonAnt>
          <ButtonAnt
            variant="outlined"
            color="danger"
            loading={loading}
            disabled={loading}
            onClick={() => props.setIsVisibleModal(false)}
          >
            Cancelar
          </ButtonAnt>
        </div>
      </form>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin: 1rem 0;

  .title {
    font-size: 18px;
    line-height: 22px;
    color: ${(props) => props.theme.basic.white};
  }

  form {
    margin-top: 1rem;

    .buttons-container {
      display: flex;
      justify-content: space-around;
    }

    .image-component {
      margin: 1rem auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .input-container {
      margin-bottom: 1rem !important;

      label {
        display: block;
        margin-bottom: 0.5rem !important;
        font-size: 10px;
        color: ${(props) => props.theme.basic.primary};
      }
      Input {
        color: ${(props) => props.theme.basic.white};
      }
    }
  }
`;

export default EditComment;
