import React, { useState } from "reactn";
import styled from "styled-components";
import { ButtonBombo, FileUpload, TextArea } from "../../components";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import get from "lodash/get";
import { firestore } from "../../firebase";
import defaultTo from "lodash/defaultTo";

const EditComment = (props) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const schema = object().shape({
    description: string().required(),
  });

  const { register, handleSubmit, errors } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveComment = async (data) => {
    setLoading(true);

    let comments;

    if (
      defaultTo(get(props, "home.comments"), []).some(
        (game) => game.id === props.currentComment.id
      )
    ) {
      comments = defaultTo(get(props, "home.comments"), []).map((game) =>
        game.id === props.currentComment.id ? mapComment(data, game) : game
      );
    } else {
      comments = defaultTo(get(props, "home.comments"), []);
      comments.push(mapComment(data));
    }

    await firestore.doc(`landings/events`).update({
      comments,
    });

    props.setIsVisibleModal(false);
    setLoading(false);
  };

  const mapComment = (data, oldGame = null) => {
    if (oldGame) {
      const comment = {
        ...props.currentComment,
        description: data.description,
      };
      if (imageUrl) comment["imageUrl"] = imageUrl;
      return comment;
    }
    return {
      ...props.currentComment,
      description: data.description,
      imageUrl: imageUrl,
    };
  };

  return (
    <Container>
      <div className="title">Comentarios</div>
      <form onSubmit={handleSubmit(saveComment)}>
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
        <div className="image-component">
          <FileUpload
            file={get(props, "currentComment.imageUrl", "")}
            fileName="imageUrl"
            filePath={`/events/comments/${props.currentComment.id}`}
            bucket="landings"
            sizes="300x300"
            afterUpload={(imageUrls) => setImageUrl(imageUrls[0].url)}
          />
        </div>
        <div className="buttons-container">
          <ButtonBombo
            variant="contained"
            color="primary"
            loading={loading}
            disabled={loading}
            htmlType="submit"
          >
            Guardar
          </ButtonBombo>
          <ButtonBombo
            variant="outlined"
            color="danger"
            loading={loading}
            disabled={loading}
            onClick={() => props.setIsVisibleModal(false)}
          >
            Cancelar
          </ButtonBombo>
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
  }
`;

export default EditComment;
