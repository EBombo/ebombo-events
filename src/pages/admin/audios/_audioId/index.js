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

export const Audio = (props) => {
  const [audioId, setAudioId] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { sendError } = useSendError();

  useEffect(() => {
    const audiosRef = firestore.collection("audios");
    const audioId_ = audiosRef.doc().id;

    setAudioId(audioId_);
  }, []);

  const schema = object().shape({
    title: string().required(),
  });

  const { handleSubmit, register, errors } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveAudio = async (data) => {
    if (!audioUrl)
      return notification.error({
        message: "Error",
        description: "Añadir audio",
      });

    setLoading(true);
    try {
      await firestore
        .collection("audios")
        .doc(audioId)
        .set({
          ...data,
          id: audioId,
          audioUrl,
          createAt: new Date(),
          updateAt: new Date(),
          deleted: false,
        });
    } catch (error) {
      await sendError(error);
    }
    router.push("/admin/audios");
    setLoading(false);
  };

  return (
    <AudioContainer>
      <form onSubmit={handleSubmit(saveAudio)}>
        <Input
          type="text"
          name="title"
          label="Titulo del Audio"
          ref={register}
          variant="primary"
          placeholder="Titulo"
          error={errors.title}
        />
        <FileUpload
          preview={"false"}
          fileName="audio"
          filePath={`/audios/${audioId}`}
          buttonLabel={"Subir Audio"}
          afterUpload={(song) => setAudioUrl(song)}
        />
        <div className="buttons-container">
          <ButtonAnt
            variant={"outlined"}
            color={"default"}
            onClick={() => router.push("/admin/audios")}
            disabled={loading}
          >
            Cancelar
          </ButtonAnt>
          <ButtonAnt loading={loading} disabled={loading} htmlType="submit">
            Guardar
          </ButtonAnt>
        </div>
      </form>
    </AudioContainer>
  );
};

const AudioContainer = styled.div`
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
