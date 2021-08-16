import React, { useEffect, useState } from "reactn";
import styled from "styled-components";
import { FileUpload } from "../../../../components/common/FileUpload";
import get from "lodash/get";
import { useRouter } from "next/router";
import { useSendError } from "../../../../hooks";
import { firestore } from "../../../../firebase";
import { ButtonAnt, Input } from "../../../../components/form";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { mediaQuery } from "../../../../constants";
import { notification } from "antd";

export const Song = (props) => {
  const [songId, setSongId] = useState(null);
  const [songUrl, setSongUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { sendError } = useSendError();

  useEffect(() => {
    const musicRef = firestore.collection("music");
    const songId_ = musicRef.doc().id;

    setSongId(songId_);
  }, []);

  const schema = object().shape({
    title: string().required(),
  });

  const { handleSubmit, register, errors } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveSong = async (data) => {
    if (!songUrl)
      return notification.error({
        message: "Error",
        description: "Añadir musica",
      });

    setLoading(true);
    try {
      await firestore
        .collection("music")
        .doc(songId)
        .set({
          ...data,
          songUrl,
          createAt: new Date(),
          updateAt: new Date(),
          deleted: false,
        });
    } catch (error) {
      await sendError(error);
    }
    router.push("/admin/music");
    setLoading(false);
  };

  return (
    <SongContainer>
      <form onSubmit={handleSubmit(saveSong)}>
        <Input
          type="text"
          name="title"
          label="Titulo de la Canción"
          ref={register}
          variant="primary"
          placeholder="Titulo"
          error={errors.title}
        />
        <FileUpload
          preview={"false"}
          fileName="songUrl"
          filePath={`/Songs/${songId}`}
          buttonLabel={"Subir Canción"}
          afterUpload={(song) => setSongUrl(song)}
        />
        <div className="buttons-container">
          <ButtonAnt
            variant={"outlined"}
            color={"default"}
            onClick={() => router.push("/admin/music")}
            disabled={loading}
          >
            Cancelar
          </ButtonAnt>
          <ButtonAnt loading={loading} disabled={loading} htmlType="submit">
            Guardar
          </ButtonAnt>
        </div>
      </form>
    </SongContainer>
  );
};

const SongContainer = styled.div`
  width: 100%;
  padding: 1rem;

  form {
    width: 100%;

    .buttons-container {
      margin-top: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }
  }

  ${mediaQuery.afterTablet} {
    form {
      max-width: 400px;
      margin: 0 auto;
    }
  }
`;
