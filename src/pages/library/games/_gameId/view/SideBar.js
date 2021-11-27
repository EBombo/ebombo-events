import React from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { useRouter } from "next/router";
import { Desktop, Tablet } from "../../../../../constants";
import { Image } from "../../../../../components/common/Image";
import { CloseCircleOutlined } from "@ant-design/icons";
import { config } from "../../../../../firebase";
import { ButtonAnt } from "../../../../../components/form";
import { darkTheme } from "../../../../../theme";
import { Tooltip } from "antd";

export const SideBar = (props) => {
  const router = useRouter();
  const { adminGameId, folderId } = router.query;

  return (
  <SideBarContainer>
    <Tablet>
      <div className="cover-container">
        <Image
          src={props.game.coverImgUrl ? props.game.coverImgUrl : `${config.storageUrl}/resources/empty-cover.svg`}
          width="100%"
          height="100px"
          size="cover"
        />
        <div className="close">
          <CloseCircleOutlined onClick={() => router.back()} />
        </div>
      </div>
      <div className="game-details">
        <div className="name">{get(props.game, "title", "")}</div>
        <div className="reproductions">
          <div className="times-played">
            <Image
              src={`${config.storageUrl}/resources/purple-play.svg`}
              height="19px"
              width="19px"
              size="contain"
              margin="0 5px 0 0"
            />
            {get(props.game, "timesPlayed", 0)}
          </div>
          {props.game?.adminGame?.name === "bingo" &&
            <div className="amount-numbers">
              <Image
                src={`${config.storageUrl}/resources/amount.svg`}
                height="19px"
                width="19px"
                size="contain"
                margin="0 5px 0 0"
              />
              {get(props.game, "amountNumbers", 75)}
            </div>
          }
        </div>
      </div>
      <div className="actions-container">
        <div className="left-container">
          <ButtonAnt variant="contained" color="default">
            Ver juegos pasados
          </ButtonAnt>
        </div>
        <div className="right-container">
          <div
            className="edit"
            onClick={() => {
              folderId
                ? router.push(`/library/games/${props.game.id}?adminGameId=${adminGameId}&folderId=${folderId}`)
                : router.push(`/library/games/${props.game.id}?adminGameId=${adminGameId}`);
            }}
          >
            <Image
              src={`${config.storageUrl}/resources/pencil.svg`}
              height="18px"
              width="18px"
              size="contain"
              margin="0 5px 0 0"
            />
          </div>
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
            <div className="more-actions">
              <div />
              <div />
              <div />
            </div>
          </Tooltip>
        </div>
      </div>
    </Tablet>
    <Desktop>
      <div className="left-container-desktop">
        <Image
          src={props.game.coverImgUrl ? props.game.coverImgUrl : `${config.storageUrl}/resources/empty-cover.svg`}
          width="100%"
          height="194px"
          size="cover"
        />
        <div className="name">{get(props.game, "name", "")}</div>

        <div className="actions-container">
          <div className="btns-container">
            <ButtonAnt
              color="secondary"
              margin="0 1rem"
              onClick={() => {
                get(props, "game.parentId", null)
                  ? router.push(`/library/games/${props.game.id}?adminGameId=${adminGameId}&folderId=${folderId}`)
                  : router.push(`/library/games/${props.game.id}?adminGameId=${adminGameId}`);
              }}
            >
              Editar
            </ButtonAnt>
            <ButtonAnt variant="contained" color="primary" onClick={props.createTokenToPlay}>
              Jugar
            </ButtonAnt>
          </div>
          <div className="more-actions">
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
              <div className="more">
                <div />
                <div />
                <div />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </Desktop>
  </SideBarContainer>
  )
};

const SideBarContainer = styled.div`
  .left-container-desktop {
    height: calc(100vh - 50px);
    background: ${(props) => props.theme.basic.whiteLight};

    .name {
      padding: 1rem;
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 24px;
      line-height: 29px;
      color: ${(props) => props.theme.basic.blackDarken};
    }

    .actions-container {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .btns-container {
        display: flex;
        align-items: center;
      }

      .more-actions {
        display: flex;
        align-items: center;

        .more {
          height: 18px;
          display: flex;
          justify-content: space-evenly;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          padding: 0 5px;

          div {
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: ${(props) => props.theme.basic.black};
          }
        }
      }
    }
  }
`;

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

