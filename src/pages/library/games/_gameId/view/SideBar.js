import React, { useState } from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { useRouter } from "next/router";
import { Image } from "../../../../../components/common/Image";
import { LinkOutlined } from "@ant-design/icons";
import { config, hostNameBomboGames } from "../../../../../firebase";
import { Anchor, ButtonAnt } from "../../../../../components/form";
import { darkTheme } from "../../../../../theme";
import { Tooltip } from "antd";

export const SideBar = (props) => {
  const router = useRouter();
  const { adminGameId, folderId } = router.query;

  const [copied, setCopied] = useState(false);

  return (
    <div>
      <div className="pb-8 bg-whiteLight md:h-[calc(100vh-50px)]">
        <Image
          src={
            props.game.coverImgUrl ??
            `${config.storageUrl}/resources/games/${get(props, "game.adminGame.name", "")}.png`
          }
          width="100%"
          height="194px"
          size="cover"
        />
        <div className="p-4 text-['Lato'] font-bold text-[24px] leading-[29px] text-blackDarken">
          {get(props.game, "name", "")}
        </div>

        <div className="flex items-center justify-between px-4">
          <div className="flex items-center">
            <ButtonAnt
              color="secondary"
              onClick={() => {
                get(props, "game.parentId", null)
                  ? router.push(`/library/games/${props.game.id}?adminGameId=${adminGameId}&folderId=${folderId}`)
                  : router.push(`/library/games/${props.game.id}?adminGameId=${adminGameId}`);
              }}
            >
              Editar
            </ButtonAnt>
            <ButtonAnt variant="contained" color="primary" margin="0 0 0 10px" onClick={props.createTokenToPlay}>
              Jugar
            </ButtonAnt>
          </div>
          <div className="flex items-center">
            {props.game.isFavorite ? (
              <Image
                src={`${config.storageUrl}/resources/yellow-star.svg`}
                width="20px"
                height="20px"
                className="icon"
                margin="0 10px 0 0"
                onClick={() => props.toggleFavorite()}
              />
            ) : (
              <Image
                src={`${config.storageUrl}/resources/star.svg`}
                width="20px"
                height="20px"
                className="icon"
                margin="0 10px 0 0"
                onClick={() => props.toggleFavorite()}
              />
            )}
            <Tooltip
              placement="bottomRight"
              trigger="click"
              title={
                <ToolTipContent>
                  <div className="option" onClick={() => props.setIsVisibleModalMove(true)}>
                    <Image
                      src={`${config.storageUrl}/resources/move.svg`}
                      width={"16px"}
                      height={"16px"}
                      size={"contain"}
                      margin={"0 15px 0 0"}
                    />
                    Mover
                  </div>
                  <div className="option">
                    <Image
                      src={`${config.storageUrl}/resources/duplicate.svg`}
                      width={"16px"}
                      height={"16px"}
                      size={"contain"}
                      margin={"0 15px 0 0"}
                    />
                    Duplicar
                  </div>
                  <div className="option" onClick={() => props.deleteGame()}>
                    <Image
                      src={`${config.storageUrl}/resources/delete.svg`}
                      width={"16px"}
                      height={"16px"}
                      size={"contain"}
                      margin={"0 15px 0 0"}
                    />
                    Borrar
                  </div>
                </ToolTipContent>
              }
              color={darkTheme.basic.whiteLight}
            >
              <div className="h-[18px] flex justify-evenly flex-col items-center cursor-pointer px-[5px] py-0">
                <div className="w-[4px] h-[4px] rounded-[50%] bg-black" />
                <div className="w-[4px] h-[4px] rounded-[50%] bg-black" />
                <div className="w-[4px] h-[4px] rounded-[50%] bg-black" />
              </div>
            </Tooltip>
          </div>
        </div>
        <div className="m-4 flex items-center">
          <ButtonAnt
            variant="contained"
            color="primary"
            onClick={() => {
              window.open(
                `https://www.${hostNameBomboGames}/register/${props.game?.adminGame?.name?.toLowerCase()}/${props.game.id}`,
                "_blank"
              );
            }}
          >
            <LinkOutlined style={{ fontSize: "18px" }} />
            Link de Inscripción
          </ButtonAnt>
          <div className="ml-[10px] flex items-center gap-[5px]">
            <Image
              src={`${config.storageUrl}/resources/duplicate.svg`}
              width="18px"
              height="21px"
              size="contain"
              cursor="pointer"
              margin="0"
              onClick={() => {
                setCopied(true);
                navigator.clipboard.writeText(
                  `${hostNameBomboGames}/register/${props.game?.adminGame?.name?.toLowerCase()}/${props.game.id}`
                );
              }}
            />
            <div className="text-['Lato'] text-[12px] leading-[15px] text-gray">{copied && "Copiado!"}</div>
          </div>
        </div>
        <div className="px-4">
          <Anchor
            underlined
            variant="dark"
            onClick={() => props.setIsVisibleInscriptions(!props.isVisibleInscriptions)}
            key={props.isVisibleInscriptions}
          >
            {!props.isVisibleInscriptions ? "Ver Inscritos" : "Vista Previa"}
          </Anchor>
        </div>
      </div>
    </div>
  );
};

const ToolTipContent = styled.div`
  background: ${(props) => props.theme.basic.whiteLight};
  box-sizing: border-box;
  color: ${(props) => props.theme.basic.grayLight};

  .option {
    display: flex;
    align-items: center;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    padding: 0.5rem;
    cursor: pointer;
  }
`;
