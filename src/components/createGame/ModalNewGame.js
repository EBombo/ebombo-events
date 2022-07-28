import React, { useEffect, useGlobal, useMemo, useState } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../common/ModalContainer";
import { Anchor, ButtonAnt } from "../form";
import { darkTheme } from "../../theme";
import { Desktop, mediaQuery, sizes, Tablet } from "../../constants";
import { useRouter } from "next/router";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";
import { useTranslation } from "../../hooks";

const defaultLimit = 6;

export const ModalNewGame = (props) => {
  const router = useRouter();
  const { folderId } = router.query;

  const { t } = useTranslation("userLayout");

  const [adminGames] = useGlobal("adminGames");
  const [adminTemplates] = useGlobal("adminTemplates");

  const [limit, setLimit] = useState(defaultLimit);

  const templates = useMemo(() => {
    return adminTemplates.filter((template) => !template.isDynamic);
  }, [adminTemplates]);

  const gamesByGroup = useMemo(() => {
    const mergeGames = adminGames.concat(templates);

    const games = groupBy(mergeGames, "typeGame.id");

    return orderBy(games, ["typeGame.updateAt"], ["desc"]);
  }, [adminGames, templates]);

  useEffect(() => {
    router.prefetch("/contact");
  }, []);

  const createGame = (game) => {
    if (game.isDisabled) {
      props.showNotification("INFO", "Comunícate con nuestro equipo de ventas.", "warning");
      return router.push("/contact");
    }

    const isTemplate = !!game.adminGame;

    let urlRedirect = `/library/games/new?adminGameId=${isTemplate ? game.adminGame?.id : game.id}`;

    if (folderId) {
      urlRedirect = `${urlRedirect}&folderId=${folderId}`;
    }

    if (isTemplate) {
      urlRedirect = `${urlRedirect}&templateId=${game.id}`;
    }

    router.push(urlRedirect);

    props.setIsVisibleModal(!props.isVisibleModal);
  };

  return (
    <ModalContainer
      top="10%"
      footer={null}
      closable={false}
      width="fit-content"
      padding={"0 0 1rem 0"}
      visible={props.isVisibleModal}
      background={darkTheme.basic.whiteLight}
      onCancel={() => props.setIsVisibleModal(!props.isVisibleModal)}
    >
      <NewGameContainer>
        <div className="title">{t("create-new-game")}</div>

        {Object.keys(gamesByGroup).map((typeGameid) => {
          const games = gamesByGroup[typeGameid];

          return (
            <div key={typeGameid}>
              <div className="group-label">{games[0]?.typeGame?.name}</div>

              <div className="games">
                {games.slice(0, limit).map((game) => (
                  <div
                    className={`game ${game.isDisabled ? "-" : ""}`}
                    key={game.id}
                    onClick={(e) => {
                      e.preventDefault();
                      createGame(game);
                    }}
                  >
                    <Desktop>
                      {/*TODO: AdminGame | game | template must use coverImgUrl.*/}
                      <GameImage src={game?.coverUrl ?? game?.coverImgUrl} />
                    </Desktop>

                    <Tablet>
                      <div className="title-game">{game.title}</div>
                      <ButtonAnt margin="5px auto">{t("create")}</ButtonAnt>
                    </Tablet>

                    <Desktop>
                      <ButtonAnt variant="text" margin="5px auto" color="light">
                        {/*TODO: AdminGame | game | template must use name.*/}
                        {game.name ?? game.title}
                      </ButtonAnt>
                    </Desktop>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {limit < adminGames?.length && (
          <Anchor
            variant="primary"
            margin="auto"
            display="block"
            fontSize="14px"
            onClick={() => setLimit(limit + defaultLimit)}
            underlined
          >
            {t("load-more")}
          </Anchor>
        )}

        <ButtonAnt
          margin="20px auto auto auto"
          variant="contained"
          color="default"
          size="big"
          onClick={() => props.setIsVisibleModal(false)}
        >
          {t("close")}
        </ButtonAnt>
      </NewGameContainer>
    </ModalContainer>
  );
};

const NewGameContainer = styled.div`
  .title {
    padding: 0.5rem;
    font-weight: bold;
    font-size: ${sizes.font.normal};
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    color: ${(props) => props.theme.basic.black};

    ${mediaQuery.afterTablet} {
      font-size: ${sizes.font.large};
    }
  }

  .group-label {
    font-weight: bold;
    padding: 10px 20px;
    color: ${(props) => props.theme.basic.black};
  }

  .games {
    font-weight: bold;
    font-size: ${sizes.font.normal};
    color: ${(props) => props.theme.basic.black};
    margin: auto 10px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    .game {
      text-align: center;
      border-radius: 5px;
      margin: 10px;
      box-shadow: 0 0 5px ${(props) => props.theme.basic.black};

      .title-game {
        border-radius: 5px 5px 0 0;
        padding: 10px;
        color: ${(props) => props.theme.basic.white};
        background: ${(props) => props.theme.basic.black};
      }
    }
  }

  ${mediaQuery.afterTablet} {
    .title {
      padding: 1rem 1rem 3rem 1rem;
    }

    .games {
      .game {
        min-width: 300px;
        cursor: pointer;
      }
    }
  }

  .is-disabled {
    filter: grayscale(1);
  }
`;

const GameImage = styled.div`
  height: 126px;
  width: 100%;
  border-radius: 5px 5px 0 0;
  cursor: pointer;
  ${(props) =>
    props.src
      ? `
        background-image: url("${props.src}");
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      `
      : `
        background: ${props.theme.basic.black}
      `};
`;
