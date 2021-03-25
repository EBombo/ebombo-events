import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../../../styles/constants";
import get from "lodash/get";
import { ButtonBombo, Levels } from "../../../../../components";
import { ModalContainer } from "../../../../../components/common/ModalContainer";
import { Followings } from "../../../../users/_userId/followings";
import { config } from "../../../../../firebase";
import { SearchUser } from "../../../../../components/common/SearchUser";
import { Image } from "../../../../../components/common/Image";
import { Icon } from "../../../../../components/common/Icons";
import { darkTheme } from "../../../../../styles/theme";
import { useErrorHandler } from "react-error-boundary";
import { useOwnFetch } from "../../../../../utils/useFetch/useFetch";

export const CardMatchContainer = (props) => {
  const [authUser] = useGlobal("user");
  const [modalInvitation, setModalInvitation] = useState(false);
  const [loadingInvitation, setLoadingInvitation] = useState(false);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  const modalInvitationUser = () => (
    <ModalContainer
      footer={null}
      visible={modalInvitation}
      onCancel={() => setModalInvitation(false)}
      primary={"true"}
    >
      {authUser.followingsAmount > 0 ? (
        <Followings
          sendInvitation={sendInvitation}
          playerIds={get(props, "playerIds", [])}
          userId={authUser.id}
        />
      ) : (
        <SearchUser
          sendInvitation={sendInvitation}
          playerIds={get(props, "playerIds", [])}
        />
      )}
    </ModalContainer>
  );

  const sendInvitation = async (userId) => {
    setLoadingInvitation(true);
    try {
      setModalInvitation(false);
      await ownFetch(
        `${config.serverUrlMatches}/matches/${props.id}/users/${authUser.id}/invitation/${userId}`,
        "GET"
      );
    } catch (error) {
      handleError({ ...error, action: "sendInvitation" });
    }
    setLoadingInvitation(false);
  };

  const teamsSection = () => (
    <Container>
      <div className="challenger-container">
        <div className="grid-container-challenger">
          <div>
            <h4 className="user-nickname">
              {get(props, "challenger[0].nickname")}
            </h4>
            <div className="user-info">
              <h3>{get(props, "requiredUserAccount.description", "")}</h3>
              <h4 className="no-wrap">
                {get(props, "requiredUserAccount.description", "").includes(
                  "SUPER CELL"
                ) ? (
                  <a
                    href={get(
                      props,
                      `challenger[0].userAccounts.${get(
                        props,
                        "requiredUserAccount.id",
                        null
                      )}`,
                      "-"
                    )}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "underline" }}
                  >
                    Link
                  </a>
                ) : (
                  get(
                    props,
                    `challenger[0].userAccounts.${get(
                      props,
                      "requiredUserAccount.id",
                      null
                    )}`,
                    "-"
                  )
                )}
              </h4>
            </div>
            <Levels
              gamesStatistics={get(props, "challenger[0].gamesStatistics", [])}
              gameId={get(props, "game.id", "")}
              key={get(props, "game.id", "")}
              style={{ textAlign: "left" }}
            />
          </div>
          <Image
            src={
              props.challenger[0].profileImageUrlThumb
                ? props.challenger[0].profileImageUrlThumb
                : `${config.storageUrl}/resources/perfil-icon.svg`
            }
            size="cover"
            height="43px"
            width="40px"
            desktopWidth={"60px"}
            desktopHeight={"63px"}
            borderRadius="5px"
          />
        </div>
      </div>
      <div className="line-container">
        <Line />
      </div>
      <div className="challenged-container">
        <div className="grid-container-challenged">
          <Image
            src={
              props.challenged[0].profileImageUrlThumb
                ? props.challenged[0].profileImageUrlThumb
                : `${config.storageUrl}/resources/perfil-icon.svg`
            }
            size="cover"
            height="43px"
            width="40px"
            desktopWidth={"60px"}
            desktopHeight={"63px"}
            borderRadius="5px"
          />
          <div>
            <h4 className="user-nickname">
              {get(props, "challenged[0].nickname")}
            </h4>
            <div className="user-info">
              <h3>{get(props, "requiredUserAccount.description", "")}</h3>
              <h4 className="no-wrap">
                {get(props, "requiredUserAccount.description", "").includes(
                  "SUPER CELL"
                ) ? (
                  <a
                    href={get(
                      props,
                      `challenged[0].userAccounts.${get(
                        props,
                        "requiredUserAccount.id",
                        null
                      )}`,
                      "-"
                    )}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "underline" }}
                  >
                    Link
                  </a>
                ) : (
                  get(
                    props,
                    `challenged[0].userAccounts.${get(
                      props,
                      "requiredUserAccount.id",
                      null
                    )}`,
                    "-"
                  )
                )}
              </h4>
            </div>
            <Levels
              gamesStatistics={get(props, "challenged[0].gamesStatistics", [])}
              gameId={get(props, "game.id", "")}
              key={get(props, "game.id", "")}
              style={{ textAlign: "right" }}
            />
          </div>
        </div>
      </div>
    </Container>
  );

  const inviteTeam = () => {
    return (
      <InviteContainer>
        <div className="buttons-container">
          <div>
            <ButtonBombo
              className={`${
                props.isChallenger() &&
                authUser.id === get(props, "challengerIds[0]", null) &&
                props.challenger.length < props.totalPlayers()
                  ? ""
                  : "hidden"
              }`}
              primary="true"
              height="auto"
              margin="0"
              lineHeight="14px"
              fontWeight="normal"
              borderRadius="3px"
              onClick={() => setModalInvitation(true)}
              disabled={loadingInvitation}
              loading={loadingInvitation}
            >
              Invitar Compañero
            </ButtonBombo>
          </div>
          <div>
            <ButtonBombo
              className={`${
                !props.isChallenger() &&
                authUser.id === get(props, "challengedIds[0]", null) &&
                props.challenged.length < props.totalPlayers()
                  ? ""
                  : "hidden"
              }`}
              primary
              height="auto"
              margin="0"
              lineHeight="14px"
              fontWeight="normal"
              borderRadius="3px"
              onClick={() => setModalInvitation(true)}
              disabled={loadingInvitation}
              loading={loadingInvitation}
            >
              Invitar Compañero
            </ButtonBombo>
          </div>
        </div>
        <div className="invited-container">
          <div className="challenger-container">
            {props.challenger.map(
              (challenger, idx) =>
                idx !== 0 && (
                  <div className="user-content" key={`key-user-content-${idx}`}>
                    <Image
                      src={
                        challenger.profileImageUrlThumb
                          ? challenger.profileImageUrlThumb
                          : `${config.storageUrl}/resources/perfil-icon.svg`
                      }
                      size={
                        challenger.profileImageUrlThumb ? "cover" : "contain"
                      }
                      width="40px"
                      height="43px"
                      desktopWidth={"50px"}
                      desktopHeight={"53px"}
                      borderRadius="5px"
                      margin="0 10px 0 0"
                    />
                    <div>
                      <div className="level-nickname">
                        <h4>{challenger.nickname}</h4>
                        <Levels
                          gamesStatistics={get(
                            challenger,
                            "gamesStatistics",
                            []
                          )}
                          gameId={get(props, "game.id", "")}
                          key={get(props, "game.id", "")}
                          padding="0 0.5rem"
                          border
                        />
                      </div>
                      <div className="game-account">
                        <h3>{`${get(
                          props,
                          "requiredUserAccount.description",
                          ""
                        )}: `}</h3>
                        <h4>
                          {get(
                            challenger,
                            `userAccounts.${get(
                              props,
                              "requiredUserAccount.id",
                              null
                            )}`,
                            "-"
                          )}
                        </h4>
                      </div>
                    </div>
                    <div className="status">
                      <img
                        src={
                          get(props, "challengerAcceptInvitation", []).includes(
                            challenger.id
                          )
                            ? `${config.storageUrl}/resources/circle-check.svg`
                            : `${config.storageUrl}/resources/pending-invitation.svg`
                        }
                        alt=""
                      />
                    </div>
                    {authUser.id === get(props, "challengerIds[0]", null) &&
                      props.step === 0 && (
                        <div
                          className="delete-user"
                          onClick={() => props.rejectInvitation(challenger.id)}
                        >
                          <Icon
                            type="close-circle"
                            style={{ color: `${darkTheme.basic.danger}` }}
                          />
                        </div>
                      )}
                  </div>
                )
            )}
          </div>
          <div className="challenged-container">
            {props.challenged.map(
              (challenged, idx) =>
                idx !== 0 && (
                  <div
                    className="user-content team-b"
                    key={`key-user-contet-challenge-${idx}`}
                  >
                    <Image
                      src={
                        challenged.profileImageUrlThumb
                          ? challenged.profileImageUrlThumb
                          : `${config.storageUrl}/resources/perfil-icon.svg`
                      }
                      size={
                        challenged.profileImageUrlThumb ? "cover" : "contain"
                      }
                      width="40px"
                      height="43px"
                      desktopWidth={"50px"}
                      desktopHeight={"53px"}
                      borderRadius="5px"
                      margin="0 10px 0 0"
                    />
                    <div>
                      <div className="level-nickname">
                        <h4>{challenged.nickname}</h4>
                        <Levels
                          gamesStatistics={get(
                            challenged,
                            "gamesStatistics",
                            []
                          )}
                          gameId={get(props, "game.id", "")}
                          key={get(props, "game.id", "")}
                          padding="0 0.5rem"
                          border
                        />
                      </div>
                      <div className="game-account">
                        <h3>{`${get(
                          props,
                          "requiredUserAccount.description",
                          ""
                        )}: `}</h3>
                        <h4>
                          {get(
                            challenged,
                            `userAccounts.${get(
                              props,
                              "requiredUserAccount.id",
                              null
                            )}`,
                            "-"
                          )}
                        </h4>
                      </div>
                    </div>
                    <div className="status">
                      <img
                        src={
                          get(props, "challengedAcceptInvitation", []).includes(
                            challenged.id
                          )
                            ? `${config.storageUrl}/resources/circle-check.svg`
                            : `${config.storageUrl}/resources/pending-invitation.svg`
                        }
                        alt=""
                      />
                    </div>
                    {authUser.id === get(props, "challengedIds[0]", null) &&
                      props.step === 0 && (
                        <div
                          className="delete-user"
                          onClick={() => props.rejectInvitation(challenged.id)}
                        >
                          <Icon
                            type="close-circle"
                            style={{ color: `${darkTheme.basic.danger}` }}
                          />
                        </div>
                      )}
                  </div>
                )
            )}
          </div>
        </div>
      </InviteContainer>
    );
  };

  return (
    <CardMatch>
      {modalInvitationUser()}
      {teamsSection()}
      {props.challengedReady && props.challengerReady && inviteTeam()}
    </CardMatch>
  );
};

const CardMatch = styled.div`
  .award {
    span {
      color: ${(props) => props.theme.basic.primary};
      font-weight: bold;
    }
  }

  hr {
    border: 1px solid ${(props) => props.theme.basic.primary};
    margin: 10px auto;
  }
`;

const InviteContainer = styled.div`
  .buttons-container {
    display: flex;
    justify-content: space-between;
    padding: 0 1rem;

    ${mediaQuery.afterTablet} {
      padding: 0 2rem;
    }

    .hidden {
      display: none;
    }
  }

  .invited-container {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
    padding: 0 1rem;

    ${mediaQuery.afterTablet} {
      padding: 0 2rem;
    }

    .user-content {
      margin: 1rem 0;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: relative;

      .delete-user {
        position: absolute;
        top: -10px;
        left: -10px;
        cursor: pointer;
      }

      .status {
        margin-left: 10px;
      }

      .level-nickname {
        display: flex;
        align-items: center;

        h4 {
          font-size: 10px;
          line-height: 14px;
          margin-right: 8px;
          color: ${(props) => props.theme.basic.white};

          ${mediaQuery.afterTablet} {
            font-size: 14px;
            line-height: 16px;
          }
        }
      }

      .game-account {
        ${mediaQuery.afterTablet} {
          display: flex;
        }

        margin-top: 5px;

        h3 {
          font-size: 10px;
          line-height: 13px;
          color: ${(props) => props.theme.basic.primary};

          ${mediaQuery.afterTablet} {
            font-size: 14px;
            line-height: 16px;
          }
        }

        h4 {
          font-size: 10px;
          line-height: 13px;
          color: ${(props) => props.theme.basic.white};

          ${mediaQuery.afterTablet} {
            font-size: 14px;
            line-height: 16px;
          }
        }
      }
    }

    .team-b {
      justify-content: flex-end;
    }
  }
`;

const Container = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 45% 10% 45%;
  align-items: center;
  margin: 1rem 0;
  padding: 0 1rem;

  ${mediaQuery.afterTablet} {
    padding: 0 2rem;
    grid-template-columns: 40% 20% 40%;
  }

  .challenger-container {
    .grid-container-challenger {
      display: grid;
      grid-template-columns: repeat(2, auto);

      ${mediaQuery.afterTablet} {
        grid-template-columns: 75% 25%;
      }

      img {
        height: 100%;
      }

      .user-nickname {
        font-size: 11px;
        line-height: 13px;
        font-weight: normal;
        color: ${(props) => props.theme.basic.white};

        ${mediaQuery.afterTablet} {
          font-size: 14px;
          line-height: 16px;
        }
      }

      .user-info {
        background: ${(props) => props.theme.basic.blackDarken};
        text-align: right;
        border-radius: 5px;
        padding: 0.5rem 1rem;

        h3 {
          font-weight: normal;
          font-size: 10px;
          line-height: 12px;
          color: ${(props) => props.theme.basic.primary};
        }

        h4 {
          font-weight: normal;
          font-size: 10px;
          line-height: 12px;
          color: ${(props) => props.theme.basic.white};
        }

        ${mediaQuery.afterTablet} {
          h3 {
            font-size: 12px;
            line-height: 15px;
          }

          h4 {
            font-size: 12px;
            line-height: 14px;
          }
        }
      }
    }
  }

  .challenged-container {
    h4 {
      font-weight: bold;
      font-size: 14px;
      line-height: 17px;
      color: ${(props) => props.theme.basic.white};
      text-align: right;
    }

    .grid-container-challenged {
      display: grid;
      grid-template-columns: repeat(2, auto);

      ${mediaQuery.afterTablet} {
        grid-template-columns: 25% 75%;
      }

      .user-nickname {
        font-size: 11px;
        line-height: 13px;
        font-weight: normal;
        color: ${(props) => props.theme.basic.white};

        ${mediaQuery.afterTablet} {
          font-size: 14px;
          line-height: 16px;
        }
      }

      .user-info {
        background: ${(props) => props.theme.basic.blackDarken};
        text-align: left;
        border-radius: 5px;
        padding: 0.5rem 1rem;

        h3 {
          font-weight: normal;
          font-size: 10px;
          line-height: 12px;
          color: ${(props) => props.theme.basic.primary};
        }

        h4 {
          font-size: 10px;
          line-height: 12px;
          color: ${(props) => props.theme.basic.white};
          text-align: left;
        }

        ${mediaQuery.afterTablet} {
          h3 {
            font-size: 12px;
            line-height: 15px;
          }

          h4 {
            font-size: 12px;
            line-height: 14px;
          }
        }
      }
    }
  }

  .line-container {
    display: flex;
    justify-content: center;
  }
`;

const Line = styled.div`
  width: 50%;
  height: 3px;
  border-radius: 2px;
  background: #989898;

  ${mediaQuery.afterTablet} {
    width: 15%;
  }
`;
