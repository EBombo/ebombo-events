import React, { useEffect, useState } from "reactn";
import { useRouter } from "next/router";
import { firestore } from "../../../../../firebase";
import { snapshotToArray } from "../../../../../utils";
import moment from "moment";
import { spinLoader } from "../../../../../components/common/loader";
import { Anchor } from "../../../../../components/form";

export const TemplatesGames = (props) => {
  const router = useRouter();
  const { adminGameId } = router.query;

  const [isLoading, setIsLoading] = useState(true);
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
      setTemplates(templates_);
      setIsLoading(false);
    };

    fetchTemplates();
  }, [adminGameId]);

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
              <div key={template.id} className="border border-primary p-2 rounded">
                <div>Nombre de juego: {template.adminGame.name.toUpperCase()}</div>
                <div>Creado: {moment(template.createAt.toDate()).format("LLL")}</div>
                <Anchor href={`/admin/games/${adminGameId}/templates/${template.id}`} display="block" margin="auto">
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

// TODO: plantilla crear pagina con tailwind
// TODO: plantilla const [isLoading, setIsLoading] = useState(true);
/** TODO: plantilla:
 {
 templates
 .map((template) => {
          return <div key={template.id}></div>;
 })
}
  **/
