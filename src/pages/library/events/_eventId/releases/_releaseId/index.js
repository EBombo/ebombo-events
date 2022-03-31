import React, { useEffect, useGlobal, useMemo, useState } from "reactn";
import { useRouter } from "next/router";
import { config, firestore } from "../../../../../../firebase";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { useSendError } from "../../../../../../hooks";
import { useFetch } from "../../../../../../hooks/useFetch";
import { FileUpload } from "../../../../../../components/common/FileUpload";
import { ButtonAnt, Input, TextArea } from "../../../../../../components/form";

export const Release = (props) => {
  const router = useRouter();

  const { releaseId, eventId } = router.query;

  const { sendError } = useSendError();
  const { Fetch } = useFetch();

  const [authUser] = useGlobal("user");

  const [release, setRelease] = useState({});
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const documentId = useMemo(() => {
    return releaseId === "new" ? firestore.collection("events").doc().id : releaseId;
  }, [releaseId]);

  useEffect(() => {
    if (releaseId === "new") return;

    const fetchRelease = async () => {
      const releaseRef = firestore.collection("events").doc(eventId).collection("releases").doc(releaseId).get();

      const _release = releaseRef.data();
      setRelease(_release);
      setImageUrl(_release.imageUrl);
    };

    fetchRelease();
  }, [releaseId]);

  const schema = object().shape({
    subject: string().required(),
    content: string(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveRelease = async (data, e) => {
    if (!imageUrl) return props.showNotification("Error", "Debe subir una imagen para el comunicado.");

    try {
      setLoading(true);

      const { error } = await Fetch(`${config.serverUrl}/api/events/${eventId}/releases/${documentId}`, "POST", {
        ...data,
        imageUrl,
        id: documentId,
        sentEmail: e.nativeEvent?.submitter?.name === "saveAndSent",
      });

      props.showNotification(
        error ? "ERROR" : "OK",
        error ? "Algo salió mal" : "Enviado!",
        error ? "error" : "success"
      );

      router.push(`/library/events/${eventId}/view`);
    } catch (error) {
      sendError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items center bg-cover bg-no-repeat bg-white bg-pattern-gray p-4 md:p-8 h-[calc(100vh-50px)] overflow-auto">
      <div className="text-primary text-['Lato'] font-[700] text-[20px] leading-[24px] md:text-[44px] md:leading-[53px] tracking-[.03em] flex items-center justify-between">
        Comunicado
        <div className="hidden md:block">
          <ButtonAnt width="130px" color="default" onClick={() => router.back()} disabled={loading}>
            Descartar
          </ButtonAnt>
        </div>
      </div>

      <div className="text-['Lato'] font-[400] text-[14px] leading-[18px] md:text-[18px] md:leading-[22px] text-secondary my-4">
        Personaliza un comunicado para enviar a tus invitados
      </div>

      <form onSubmit={handleSubmit(saveRelease)}>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <div className="w-fit mx-auto md:mx-0">
            <FileUpload
              width="300px"
              height="380px"
              preview={true}
              file={imageUrl}
              fileName="imageUrl"
              filePath={`/events/${eventId}/releases/${documentId}`}
              sizes="300x380"
              afterUpload={(imageUrls) => setImageUrl(imageUrls[0].url)}
            />
            <div className="text-['Lato'] font-[400] text-[13px] leading-[15px] md:text-[16px] md:leading-[18px] text-secondary my-4">
              *Sube un banner para el comunicado
            </div>
          </div>
          <div className="w-full max-w-[400px]">
            <div className="text-['Lato'] font-[400] text-[14px] leading-[18px] md:text-[18px] md:leading-[22px] text-secondary my-4">
              Asunto del correo:
            </div>
            <Input
              type="text"
              name="subject"
              defaultValue={release.subject}
              ref={register}
              variant="primary"
              placeholder="Escribe aquí el asunto"
              error={errors.subject}
            />

            <div className="text-['Lato'] font-[400] text-[14px] leading-[18px] md:text-[18px] md:leading-[22px] text-secondary my-4">
              Contenido del correo:
            </div>
            <TextArea
              color="black"
              defaultValue={release.content}
              background={"#FAFAFA"}
              border={"1px solid #C4C4C4"}
              rows="10"
              name="content"
              ref={register}
              error={errors.content}
              placeholder="Escribe aquí el contenido (opcional)"
            />
          </div>
        </div>

        <div className="w-full flex items-center gap-4 justify-end flex-col md:flex-row">
          <ButtonAnt htmlType="submit" name="save" width="130px" disabled={loading}>
            Guardar
          </ButtonAnt>
          <ButtonAnt
            htmlType="submit"
            name="saveAndSent"
            color="success"
            width="130px"
            loading={loading}
            disabled={loading}
          >
            Guardar e Enviar
          </ButtonAnt>
          <div className="block md:hidden">
            <ButtonAnt color="default" width="130px" disabled={loading} onClick={() => router.back()}>
              Descartar
            </ButtonAnt>
          </div>
        </div>
      </form>
    </div>
  );
};
