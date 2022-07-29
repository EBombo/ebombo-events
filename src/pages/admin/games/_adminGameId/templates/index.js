import React, { useEffect, useState } from "reactn";
import { useRouter } from "next/router";
import { firestore } from "../../../../../firebase";
import { snapshotToArray } from "../../../../../utils";
import moment from "moment";
import orderBy from "lodash/orderBy";
import { spinLoader } from "../../../../../components/common/loader";
import { Anchor, RadioGroup } from "../../../../../components/form";
import { Image } from "../../../../../components/common/Image";
import { useSendError } from "../../../../../hooks";
import { Radio } from "antd";

export const TemplatesGames = (props) => {
  const router = useRouter();
  const { adminGameId } = router.query;

  const { sendError } = useSendError();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    if (!adminGameId) return setIsLoading(false);

    const fetchTemplates = async () => {
      const querySnapshotTemplates = await firestore
        .collection("templates")
        .where("adminGame.id", "==", adminGameId)
        .where("deleted", "==", false)
        .get();

      const templates_ = snapshotToArray(querySnapshotTemplates);
      setTemplates(orderBy(templates_, ["createAt"], ["desc"]));
      setIsLoading(false);
    };

    fetchTemplates();
  }, [adminGameId]);

  const updateTemplate = async (gameId, isDynamic) => {
    try {
      setIsLoadingUpdate(true);

      await firestore.collection("templates").doc(gameId).update({ isDynamic });

      props.showNotification("Ok", "Success", "success");
    } catch (error) {
      console.error(error);
      sendError(error, "updateTemplate");
      props.showNotification("Ok", "Something was wrong");
    }
    setIsLoadingUpdate(false);
  };

  if (isLoading) return spinLoader();

  return (
    <div>
      <div className="my-4 text-bold text-lg text-center">Lista de juegos predeterminados</div>

      <Anchor href={`/admin/games/${adminGameId}/templates/new`} margin="20px auto" display="block">
        <a>CREAR PLANTILLA</a>
      </Anchor>

      <div className="block m-auto w-[300px]">
        {templates?.length ? (
          templates.map((template) => {
            return (
              <div key={template.id} className="border border-primary p-2 rounded text-center m-2">
                {template.coverImgUrl ? (
                  <Image src={template.coverImgUrl} height="auto" width="125px" size="contain" margin="10px auto" />
                ) : null}
                <div>Nombre del template: {template.name.toUpperCase()}</div>
                <div>Nombre de juego: {template.adminGame.name.toUpperCase()}</div>
                <div>Creado: {moment(template.createAt.toDate()).format("LLL")}</div>

                <div className="mx-auto my-4">
                  <RadioGroup
                    loading={isLoadingUpdate}
                    disabled={isLoadingUpdate}
                    defaultValue={!!template.isDynamic}
                    onChange={(e) => {
                      e.preventDefault();
                      updateTemplate(template.id, e.target.value);
                    }}
                  >
                    <Radio value={false}>Ebombo</Radio>
                    <Radio value={true}>Dinamica</Radio>
                  </RadioGroup>
                </div>

                <Anchor
                  href={`/admin/games/${adminGameId}/templates/${template.id}`}
                  display="block"
                  margin="15px auto"
                >
                  <a>EDITAR PLANTILLA</a>
                </Anchor>
              </div>
            );
          })
        ) : (
          <div className="text-center text-xs text-grayDarken">No hay plantillas</div>
        )}
      </div>
    </div>
  );
};
