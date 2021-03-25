import React, {useEffect, useGlobal, useState} from "reactn";
import {lazy, Suspense} from "react";
import {CardCustom} from "../common";
import styled from "styled-components";
import moment from "moment";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import {Modal, Tooltip} from "antd";
import {useHistory} from "react-router";
import {config, firestore} from "../../firebase";
import {Icon} from "../common/Icons";
import {Image} from "../common/Image";
import {finishTimeByRule, spinLoader} from "../../utils";
import {ToolTipContent} from "../common/TooltipContent";
import {darkTheme} from "../../styles/theme";

const SteamingUrl = lazy(() => import("./SteamingUrl"));

export const ItemTree = (props) => {
  const history = useHistory();
  const [authUser] = useGlobal("user");
  const [match, setMatch] = useState({});
  const [isVisibleModalStreamUrls, setIsVisibleModalStreamUrls] = useState(
    false
  );
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (isEmpty(props.tournamentGroup.matchIds)) return;

    console.log(props.tournament.rule);

    const date = finishTimeByRule(
      props.tournament.rule,
      props.tournamentGroup.startDate.toDate()
    );
    console.log(date);
    fetchMatch(get(props, "tournamentGroup.matchIds", "-"));
  }, [props.tournamentGroup.matchIds]);

  const getScore = (key) =>
    get(
      props,
      `tournamentGroup.score[${get(
        props,
        `tournamentGroup.tournamentTeams[${key}].id`
      )}]`,
      ""
    );

  const playerInfo = (indexTeam, indexPlayer, key) => {
    let object = get(
      props,
      `tournamentGroup.tournamentTeams[${indexTeam}].players[${indexPlayer}][${key}]`
    );
    const userId = get(
      props,
      `tournamentGroup.tournamentTeams[${indexTeam}].players[${indexPlayer}].id`
    );

    if (key.includes("phone"))
      object =
        "http://wa.me/" +
        get(
          props,
          `tournamentGroup.tournamentTeams[${indexTeam}].players[${indexPlayer}].dialCode`
        ) +
        object;

    if (object)
      return (
        <div
          onClick={() => {
            key.includes("phone")
              ? window.open(object, "_blank")
              : window.open(
                  `http://${window.location.host}/admin/users/${userId}`,
                  "_blank"
                );
          }}
          style={{ cursor: "pointer" }}
        >
          {get(
            props,
            `tournamentGroup.tournamentTeams[${indexTeam}].players[${indexPlayer}][${key}]`
          )}
        </div>
      );
  };

  const fetchMatch = async (matchIds) => {
    try {
      const matchQuerySnapShot = await firestore
        .collection("matches")
        .doc(matchIds[0])
        .get();

      setMatch(matchQuerySnapShot.data());
    } catch (error) {
      setMatch({});
      console.error(error);
    }
  };

  const saveMatch = async () => {
    setIsDisabled(true);
    await firestore.doc("matches/" + match.id).update(match);
    setIsDisabled(false);
    setIsVisibleModalStreamUrls(false);
  };

  const modalEditStreamingUrl = () => (
    <Modal
      footer={null}
      visible={isVisibleModalStreamUrls}
      onCancel={() => {
        setIsVisibleModalStreamUrls(false);
      }}
    >
      <Suspense fallback={spinLoader()}>
        <SteamingUrl
          match={match}
          isDisabled={isDisabled}
          setMatch={setMatch}
          saveMatch={saveMatch}
        />
      </Suspense>
    </Modal>
  );

  const getStartDate = (match) => {
    const date = moment(match.createAt.toDate()).format("ddd D, hh:mma");

    const dates = date.split(",");

    return (
      <div>
        <span className="text-black">
          {dates[0].charAt(0).toUpperCase() + dates[0].slice(1)}
        </span>
        <span className="text-white">{dates[1]}</span>
      </div>
    );
  };

  const getEndDate = (match) => {
    const date = moment(match.finishAt.toDate()).format("ddd D, hh:mm a");
    const dates = date.split(",");

    return (
      <div className="no-wrap">
        <span className="text-black">
          Exp: {dates[0].charAt(0).toUpperCase() + dates[0].slice(1)}
        </span>
        <span className="text-black bold">{" " + dates[1]}</span>
      </div>
    );
  };

  return (
    <>
      {isVisibleModalStreamUrls && modalEditStreamingUrl()}
      <ContainerItemTree
        displayBefore={props.displayBefore}
        displayAfter={props.displayAfter}
        contents={props.contents}
        hiddeTreeLine={props.hiddeTreeLine}
        className="tree-container"
        onClick={() => console.log(props.tournamentGroup)}
        style={{ visibility: props.visibilityHidden ? "hidden" : "visible" }}
      >
        {props.titlePosition && (
          <div
            className={
              props.titlePosition === "Final" ||
              props.titlePosition === "Tercer Puesto"
                ? "title-primary"
                : "title"
            }
          >
            {props.titlePosition}
          </div>
        )}
        <div className="item-match">
          <CardCustom
            width="160px"
            height="65px"
            background="transparent"
            borderRadius="5px"
            padding="0"
            border="none"
            margin="0"
          >
            <div className="content-streaming">
              {get(match, "streamingUrls", []).map((stream) => (
                <ContainerStream key={stream.userId}>
                  <img
                    onClick={() =>
                      window.open(get(stream, "url", ""), "_blank")
                    }
                    src={`${config.storageUrl}/resources/${
                      get(stream, "url", "-").includes("zoom")
                        ? "icon-zoom.svg"
                        : "icon-twitch.svg"
                    }`}
                    alt="streaming-img"
                  />
                </ContainerStream>
              ))}
            </div>
            {props.editMatch && (
              <div className="edit-streaming-url">
                {props.tournamentGroup.matchIds && (
                  <ContainerStream
                    onClick={() => setIsVisibleModalStreamUrls(true)}
                  >
                    <Icon type="upload" />
                  </ContainerStream>
                )}
                {!isEmpty(match) && props.isEdit && (
                  <ContainerStream
                    onClick={() =>
                      history.push(
                        `/admin/matches-history/${props.tournamentGroup.matchIds[0]}/edit`
                      )
                    }
                  >
                    <Icon className="icon" type="edit" />
                  </ContainerStream>
                )}
                {props.tournamentGroup.matchIds &&
                  !match.isClosed &&
                  !match.isCanceled && (
                    <ContainerStream
                      onClick={() =>
                        history.push(`/notifications/matches/${match.id}`)
                      }
                    >
                      <Icon className="icon" type="play-circle" />
                    </ContainerStream>
                  )}
              </div>
            )}
            <ul className="list-items">
              <li className="item-player">
                <div
                  className={
                    getScore(0) >= getScore(1) &&
                    !isEmpty(getScore(0)) &&
                    !isEmpty(getScore(1))
                      ? "item-left border-top-left-primary"
                      : "item-left border-top-left"
                  }
                >
                  <div className="name-item no-wrap">
                    {!isEmpty(
                      get(props, "tournamentGroup.tournamentTeams", [])
                    ) && (
                      <Image
                        src={
                          props.tournament.rule.totalPlayers > 1
                            ? props.tournamentGroup.tournamentTeams[0]
                                .teamImageUrlThumb
                              ? props.tournamentGroup.tournamentTeams[0]
                                  .teamImageUrlThumb
                              : `${config.storageUrl}/resources/teams-default.svg`
                            : get(
                                props,
                                "tournamentGroup.tournamentTeams[0].players[0].profileImageUrlThumb",
                                null
                              )
                            ? props.tournamentGroup.tournamentTeams[0]
                                .players[0].profileImageUrlThumb
                            : `${config.storageUrl}/resources/perfil-icon.svg`
                        }
                        width="20px"
                        margin="0 5px 0 0"
                        height="20px"
                        borderRadius="50%"
                        size={
                          props.tournament.rule.totalPlayers > 1
                            ? props.tournamentGroup.tournamentTeams[0]
                                .teamImageUrlThumb
                              ? "cover"
                              : "contain"
                            : get(
                                props,
                                "tournamentGroup.tournamentTeams[0].players[0].profileImageUrlThumb",
                                null
                              )
                            ? "cover"
                            : "contain"
                        }
                      />
                    )}
                    {props.tournament.rule.totalPlayers > 1 ? (
                      <Tooltip
                        placement="bottomLeft"
                        title={
                          <ToolTipContent
                            title="Información del Usuario"
                            description={
                              <p>
                                {get(authUser, "isAdmin", false) &&
                                  playerInfo(0, 0, "phoneNumber")}{" "}
                                <br />
                                {get(authUser, "isAdmin", false) &&
                                  playerInfo(0, 0, "email")}
                              </p>
                            }
                          />
                        }
                        color={darkTheme.basic.gray}
                      >
                        <div
                          className={`${
                            get(
                              props,
                              "tournamentGroup.tournamentTeams[0].playerIds",
                              ""
                            ).includes(authUser.id)
                              ? "my-team"
                              : ""
                          }`}
                        >
                          {get(
                            props,
                            "tournamentGroup.tournamentTeams[0].name",
                            ""
                          )}
                        </div>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        placement="bottomLeft"
                        title={
                          <ToolTipContent
                            title="Información del Usuario"
                            description={
                              <p>
                                Número:{" "}
                                {get(authUser, "isAdmin", false) &&
                                  playerInfo(0, 0, "phoneNumber")}
                                <br />
                                Email:{" "}
                                {get(authUser, "isAdmin", false) &&
                                  playerInfo(0, 0, "email")}
                              </p>
                            }
                          />
                        }
                        color={darkTheme.basic.gray}
                      >
                        <div
                          className={`${
                            get(
                              props,
                              "tournamentGroup.tournamentTeams[0].playerIds",
                              ""
                            ).includes(authUser.id)
                              ? "my-team"
                              : ""
                          }`}
                        >
                          {get(
                            props,
                            "tournamentGroup.tournamentTeams[0].players[0].nickname",
                            ""
                          )}
                        </div>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <div
                  className={
                    getScore(0) >= getScore(1) &&
                    getScore(0) !== "" &&
                    getScore(1) !== ""
                      ? "item-right primary-background top-right-radius"
                      : "item-right top-right-radius"
                  }
                  key={`key-score-1-${getScore(1)}-${getScore(0)}`}
                >
                  <div className="item-number">
                    <span>{getScore(0) !== "" ? getScore(0) : "-"}</span>
                  </div>
                </div>
              </li>
              <li className="item-player">
                <div
                  className={
                    getScore(1) >= getScore(0) &&
                    getScore(0) !== "" &&
                    getScore(1) !== ""
                      ? "item-left border-bottom-primary"
                      : "item-left border-bottom"
                  }
                >
                  <div className="name-item">
                    {!isEmpty(
                      get(props, "tournamentGroup.tournamentTeams", [])
                    ) && (
                      <Image
                        src={
                          props.tournament.rule.totalPlayers > 1
                            ? props.tournamentGroup.tournamentTeams[1]
                                .teamImageUrlThumb
                              ? props.tournamentGroup.tournamentTeams[1]
                                  .teamImageUrlThumb
                              : `${config.storageUrl}/resources/teams-default.svg`
                            : get(
                                props,
                                "tournamentGroup.tournamentTeams[1].players[1].profileImageUrlThumb",
                                null
                              )
                            ? props.tournamentGroup.tournamentTeams[1]
                                .players[1].profileImageUrlThumb
                            : `${config.storageUrl}/resources/perfil-icon.svg`
                        }
                        width="20px"
                        margin="0 5px 0 0"
                        height="20px"
                        borderRadius="50%"
                        size={
                          props.tournament.rule.totalPlayers > 1
                            ? props.tournamentGroup.tournamentTeams[1]
                                .teamImageUrlThumb
                              ? "cover"
                              : "contain"
                            : get(
                                props,
                                "tournamentGroup.tournamentTeams[1].players[1].profileImageUrlThumb",
                                null
                              )
                            ? "cover"
                            : "contain"
                        }
                      />
                    )}
                    {props.tournament.rule.totalPlayers > 1 ? (
                      <Tooltip
                        placement="bottomLeft"
                        title={
                          <ToolTipContent
                            title="Información del Usuario"
                            description={
                              <p>
                                Número:{" "}
                                {get(authUser, "isAdmin", false) &&
                                  playerInfo(1, 0, "phoneNumber")}
                                <br />
                                Email:{" "}
                                {get(authUser, "isAdmin", false) &&
                                  playerInfo(1, 0, "email")}
                              </p>
                            }
                          />
                        }
                        color={darkTheme.basic.gray}
                      >
                        <div
                          className={`${
                            get(
                              props,
                              "tournamentGroup.tournamentTeams[1].playerIds",
                              ""
                            ).includes(authUser.id)
                              ? "my-team"
                              : ""
                          }`}
                        >
                          {get(
                            props,
                            "tournamentGroup.tournamentTeams[1].name",
                            ""
                          )}
                        </div>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        placement="bottomLeft"
                        title={
                          <ToolTipContent
                            title="Información del Usuario"
                            description={
                              <p>
                                Número:{" "}
                                {get(authUser, "isAdmin", false) &&
                                  playerInfo(1, 0, "phoneNumber")}
                                <br />
                                Email:{" "}
                                {get(authUser, "isAdmin", false) &&
                                  playerInfo(1, 0, "email")}
                              </p>
                            }
                          />
                        }
                        color={darkTheme.basic.gray}
                      >
                        <div
                          className={`${
                            get(
                              props,
                              "tournamentGroup.tournamentTeams[1].playerIds",
                              ""
                            ).includes(authUser.id)
                              ? "my-team"
                              : ""
                          }`}
                        >
                          {get(
                            props,
                            "tournamentGroup.tournamentTeams[1].players[0].nickname",
                            ""
                          )}
                        </div>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <div
                  className={
                    getScore(1) >= getScore(0) &&
                    getScore(0) !== "" &&
                    getScore(1) !== ""
                      ? "item-right primary-background"
                      : "item-right"
                  }
                  key={`key-score-1-${getScore(1)}-${getScore(0)}`}
                >
                  <div className="item-number">
                    <span>{getScore(1) !== "" ? getScore(1) : "-"}</span>
                  </div>
                </div>
              </li>
              <li className="item-footer-dates">
                <div className="footer-left">
                  {match && match.createAt && getStartDate(match)}
                </div>
                <div className="footer-right">
                  {match && match.finishAt && getEndDate(match)}
                </div>
              </li>
            </ul>
          </CardCustom>
        </div>
      </ContainerItemTree>
    </>
  );
};

const ContainerItemTree = styled.section`
  position: relative;
  z-index: 990;
  padding: 0.5em 1em;
  // flex-grow: 2;
  width: 100%;
  height: 100%;

  ${(props) => props.contents && "display: contents;"}
  .title {
    color: ${(props) => props.theme.basic.white};
    font-size: 15px;
    font-weight: 600;
    padding-left: 2.3rem;
  }

  .title-primary {
    color: ${(props) => props.theme.basic.primary};
    font-size: 15px;
    font-weight: 600;
  }

  .content-streaming {
    position: absolute;
    display: flex;
    flex-direction: column;
    left: -11px;
    top: -4px;
  }

  .edit-streaming-url {
    position: absolute;
    display: flex;
    flex-direction: column;
    right: -11px;
    top: -4px;
    z-index: 99999;
  }

  .list-items {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;

    li {
      width: 100%;
    }

    .item-date {
      font-size: 7px;
      font-weight: 600;
      text-align: center;
      color: ${(props) => props.theme.basic.white};
    }

    .item-player {
      display: flex;
      align-items: center;

      .item-left {
        display: flex;
        align-items: center;
        width: 130px;
        height: 26px;
        background: ${(props) => props.theme.basic.blackLighten};

        .name-item {
          padding: 0 0.5rem;
          text-align: left;
          font-weight: 600;
          font-size: 11px;
          line-height: 14px;
          color: ${(props) => props.theme.basic.white};
          display: flex;
          align-items: center;
          .my-team {
            color: ${(props) => props.theme.basic.action};
          }
        }
      }
      .border-top-left {
        border-left: 4px solid ${(props) => props.theme.basic.whiteDarken};
        border-top-left-radius: 5px;
      }
      .border-top-left-primary {
        border-left: 4px solid ${(props) => props.theme.basic.primary};
        border-top-left-radius: 5px;
      }
      .border-bottom {
        border-left: 4px solid ${(props) => props.theme.basic.whiteDarken};
      }
      .border-bottom-primary {
        border-left: 4px solid ${(props) => props.theme.basic.primary};
      }

      .item-right {
        background: ${(props) => props.theme.basic.whiteDarken};
        overflow: hidden;

        .item-number {
          width: 30px;
          height: 26px;
          color: ${(props) => props.theme.basic.black};
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 13px;
          font-weight: bold;
        }
      }
      .primary-background {
        background: ${(props) => props.theme.basic.primary};
      }
      .top-right-radius {
        border-top-right-radius: 5px;
      }
    }

    .item-footer-dates {
      display: flex;
      align-items: center;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      padding: 0 5px;
      font-weight: normal;
      font-size: 8px;
      line-height: 10px;
      background: ${(props) => props.theme.basic.whiteDarken};
      height: 11px;
      .footer-left {
        display: flex;
        align-items: center;
        color: ${(props) => props.theme.basic.white};
        border-right: 1px solid ${(props) => props.theme.basic.black};
        height: 100%;
        padding-right: 2px;
      }
      .footer-right {
        display: flex;
        align-items: center;
        padding-left: 5px;
        height: 100%;
        color: ${(props) => props.theme.basic.white};
        .bold {
          font-weight: bold;
        }
      }
      .text-black {
        color: ${(props) => props.theme.basic.black};
      }
    }
  }

  &:nth-child(odd),
  &:nth-child(even) {
    margin: 0;
  }

  &::after {
    position: absolute;
    right: 0;
    content: "";
    width: 1em;
    height: 50%;
    border-right: 2px solid ${(props) => props.theme.basic.grayLighten};
    z-index: 980;
    display: ${(props) => (props.displayAfter ? "none" : "block")};
  }

  &:nth-child(even)::after {
    top: 50%;
    border-top: 2px solid ${(props) => props.theme.basic.grayLighten};
    transform: translateY(-1px);
  }

  &:nth-child(odd)::after {
    bottom: 50%;
    border-bottom: 2px solid ${(props) => props.theme.basic.grayLighten};
    transform: translateY(1px);
  }

  //MatchItem
  .item-match {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    outline: none;

    &::before,
    &::after {
      position: absolute;
      left: -2px;
      content: "";
      width: 1em;
      height: 10%;
      //border-left: 2px solid ${(props) => props.theme.basic.primary};
      z-index: 980;
    }

    &::before {
      bottom: 50%;
      border-bottom: 2px solid ${(props) => props.theme.basic.grayLighten};
      transform: translate(0, 1px);
      display: ${(props) => (props.displayBefore ? "none" : "block")};
    }

    &::after {
      top: 50%;
      border-top: 2px solid ${(props) => props.theme.basic.grayLighten};
      transform: translate(0, -1px);
      display: ${(props) => (props.displayAfter ? "none" : "block")};
      visibility: ${(props) => (props.hiddeTreeLine ? "hidden" : "visible")};
    }
  }
`;

const ContainerStream = styled.div`
  background-color: ${(props) => props.theme.basic.blackDarken};
  border-radius: 50%;
  height: 20px;
  width: 20px;
  margin-top: 2px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    margin: auto;
    height: 12px;
    width: 12px;
  }
`;
