import React, { useGlobal, useMemo } from "reactn";
import { darkTheme } from "../../theme";
import { ModalContainer } from "../common/ModalContainer";
import { useTranslation } from "../../hooks";
import get from "lodash/get";
import { config } from "../../firebase";
import { ButtonAnt } from "../form";
import { Image } from "../common/Image";
import { useRouter } from "next/router";

const defaultGameName = "trivia";

export const ModalNewDynamic = (props) => {
  const router = useRouter();
  const { folderId } = router.query;

  const { t } = useTranslation("userLayout");

  const [adminGames] = useGlobal("adminGames");
  const [adminTemplates] = useGlobal("adminTemplates");

  const templates = useMemo(() => {
    return adminTemplates.filter((template) => !!template.isDynamic);
  }, [adminTemplates]);

  const triviaAdminGame = useMemo(() => {
    return adminGames.find((game) => game.name === defaultGameName);
  }, [adminGames]);

  return (
    <ModalContainer
      top="10%"
      footer={null}
      closable={false}
      width="fit-content"
      padding={"0 0 1rem 0"}
      visible={props.isVisibleModal}
      background={darkTheme.basic.whiteLight}
      onCancel={() => props.setIsVisibleModal(false)}
    >
      <div className="text-black p-2">{t("create-new-game")}</div>

      <div className="grid grid-cols-[1fr_1fr_1fr] text-black">
        {/** Crear trivia desde cero. **/}
        <div
          className="rounded-[8px] shadow-md min-w-[300px] cursor-pointer p-3 m-3 bg-secondary"
          onClick={(e) => {
            e.preventDefault();

            let urlRedirect = `/library/games/new?adminGameId=${triviaAdminGame.id}`;

            if (folderId) {
              urlRedirect = `${urlRedirect}&folderId=${folderId}`;
            }

            router.push(urlRedirect);

            props.setIsVisibleModal(false);
          }}
        >
          <Image src={`${config.storageUrl}/resources/ebombo-icon-new-game.svg`} height="160px" size="contain" />
          <ButtonAnt variant="contained" width="140px" margin="10px auto">
            {t("create-from-scratch")}
          </ButtonAnt>
        </div>

        {/** Lista de templates. **/}
        {templates.map((template) => {
          return (
            <div
              className="rounded-[8px] shadow-md min-w-[300px] cursor-pointer -3 m-3 grid "
              key={template.id}
              onClick={(e) => {
                e.preventDefault();

                const templateId = template.id;

                let urlRedirect = `/library/games/new?adminGameId=${template.adminGame.id}`;

                if (folderId) {
                  urlRedirect = `${urlRedirect}&folderId=${folderId}`;
                }

                if (templateId) {
                  urlRedirect = `${urlRedirect}&templateId=${templateId}`;
                }

                router.push(urlRedirect);

                props.setIsVisibleModal(false);
              }}
            >
              {/*TODO: AdminGame | game | template must use coverImgUrl.*/}
              <Image src={get(template, "coverImgUrl", null)} height="180px" borderRadius="8px 8px 0 0" size="cover" />
              <div className="text-center text-bold mx-auto my-3 text-primary">{template.name}</div>
            </div>
          );
        })}
      </div>
    </ModalContainer>
  );
};
