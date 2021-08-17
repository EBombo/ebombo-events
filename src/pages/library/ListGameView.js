import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { ButtonAnt, Checkbox } from "../../components/form";
import { config } from "../../firebase";
import { Tooltip } from "antd";
import { darkTheme } from "../../theme";
import get from "lodash/get";
import moment from "moment";
import { Desktop, mediaQuery } from "../../constants";

export const ListGameView = (props) => {
  const [authUser] = useGlobal("user");

  const getTimeCreation = () => {
    const still = moment();
    const time = moment(still).diff(moment(props.game.createAt));

    const newTime = moment.duration(time);

    return newTime.days() > 0
      ? `Creado hace ${newTime.days()} día${newTime.days() > 1 ? "s" : ""}`
      : newTime.hours() > 0
      ? `Creado hace ${newTime.hours()} hora${newTime.hours() > 1 ? "s" : ""}`
      : `Creado hace ${newTime.minutes()} minutos`;
  };

  const getTimesPlayed = () => {
    return "7 reproducciones";
  };

  const toggleFavorite = () => {
    console.log("toggle favorite");
  };

  return (
    <>
      {props.listType === "icons" && (
        <IconsContainer>
          <Image
            src={
              get(props, "game.coverImgUrl.file", null)
                ? URL.createObjectURL(get(props, "game.coverImgUrl.file", null))
                : `${config.storageUrl}/resources/empty-cover.svg`
            }
            width="91px"
            height="65px"
            desktopWidth="164px"
            desktopHeight="141px"
            margin="0"
            size="cover"
            borderRadius="4px 0px 0px 4px"
          />
          <div className="main-content">
            <div className="description">{props.game.name}</div>
            <div className="bottom-container">
              <Desktop>
                <div className="company">
                  <Image
                    src={get(authUser, "company.imageUrl", "")}
                    height={"30px"}
                    width={"30px"}
                    borderRadius={"50%"}
                    margin={"0 5px 0 0"}
                    size="cover"
                  />
                  <div className="name">
                    {get(props, "game.company.name", "")}
                  </div>
                </div>
              </Desktop>
              <div className="dates">
                {getTimeCreation()}{" "}
                <ul>
                  <li>
                    <span>{getTimesPlayed()}</span>
                  </li>
                </ul>
              </div>
              <Desktop>
                <div className="btns-container">
                  <ButtonAnt
                    variant="contained"
                    color="secondary"
                    margin="0 1rem"
                  >
                    Editar
                  </ButtonAnt>
                  <ButtonAnt variant="contained" color="primary">
                    Jugar
                  </ButtonAnt>
                </div>
              </Desktop>
            </div>
          </div>
        </IconsContainer>
      )}
      {props.listType === "list" && (
        <ListContainer>
          <div className="left-content">
            <div className="select">
              <Checkbox />
            </div>
            <div className="description">{props.game.name}</div>
          </div>
          <div className="right-content">
            <ButtonAnt variant="contained" color="secondary" margin="0 1rem">
              Editar
            </ButtonAnt>
            <ButtonAnt variant="contained" color="primary" margin="0 1rem">
              Jugar
            </ButtonAnt>
            {props.game.isFavorite ? (
              <Image
                src={`${config.storageUrl}/resources/yellow-star.svg`}
                width="20px"
                height="20px"
                className="icon"
                margin="0 20px 0 0"
                onClick={() => toggleFavorite()}
              />
            ) : (
              <Image
                src={`${config.storageUrl}/resources/star.svg`}
                width="20px"
                height="20px"
                className="icon"
                margin="0 20px 0 0"
                onClick={() => toggleFavorite()}
              />
            )}
            <Tooltip
              placement="bottomLeft"
              trigger="click"
              title={<ToolTipContent>Eliminar</ToolTipContent>}
              color={darkTheme.basic.whiteLight}
            >
              <div className="more">
                <div />
                <div />
                <div />
              </div>
            </Tooltip>
          </div>
        </ListContainer>
      )}
    </>
  );
};

const ToolTipContent = styled.div``;

const ListContainer = styled.div`
  width: 100%;
  background: ${(props) => props.theme.basic.whiteLight};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  height: 52px;
  margin: 1rem 0;

  .left-content {
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    .description {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 15px;
      line-height: 18px;
      color: ${(props) => props.theme.basic.black};
      margin-left: 1rem;
    }
  }

  .right-content {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    .more {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      height: 18px;

      div {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: ${(props) => props.theme.basic.black};
      }
    }
  }
`;

const IconsContainer = styled.div`
  width: 100%;
  background: ${(props) => props.theme.basic.whiteLight};
  display: grid;
  grid-template-columns: 91px auto;
  align-items: center;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  margin: 1rem 0;

  .select {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .main-content {
    position: relative;
    height: 100%;
    width: 100%;
    padding: 0 !important;

    .description {
      font-weight: bold;
      font-size: 13px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.black};
      padding: 10px;
    }

    .bottom-container {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
      background: ${(props) => props.theme.basic.whiteDark};
      border-radius: 0px 0px 5px 0px;

      .company {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        .name {
          font-family: Lato;
          font-style: normal;
          font-weight: normal;
          font-size: 13px;
          line-height: 16px;
          color: ${(props) => props.theme.basic.grayLight};
        }
      }

      .dates {
        font-family: Lato;
        font-style: normal;
        font-weight: normal;
        font-size: 11px;
        line-height: 13px;
        color: ${(props) => props.theme.basic.grayLight};
        display: flex;
        align-items: center;
        ul {
          margin: 0 0 0 10px;
          list-style-position: inside;

          span {
            position: relative;
            left: -10px;
          }
        }
      }

      .btns-container {
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
    }
  }

  ${mediaQuery.afterTablet} {
    grid-template-columns: 164px auto;

    .main-content {
      .description {
        padding: 1rem;
        font-size: 15px;
        line-height: 18px;
        color: ${(props) => props.theme.basic.black};
      }

      .bottom-container {
        height: 45px;

        .dates {
          font-size: 13px;
          line-height: 16px;
        }
      }
    }
  }
`;
