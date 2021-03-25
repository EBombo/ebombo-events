import {config} from "../firebase";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import {showMoney} from "../utils/showMoney";
import {UserImageProfile} from "./users/UserImageProfile";
import React, {useEffect, useGlobal, useState} from "reactn";
import styled from "styled-components";
import {mediaQuery} from "../styles/constants";
import {Container} from "./Container";
import {useHistory, useLocation} from "react-router";
import {Anchor} from "./common/Anchor";

export const ContentBarDesktop = (props) => {
  const history = useHistory();
  const location = useLocation();
  const [authUser] = useGlobal("user");
  const [currentGame] = useGlobal("currentGame");
  const [, setIsVisibleLoginModal] = useGlobal("isVisibleLoginModal");
  const [openSidebarMobile, setOpenSidebarMobile] = useGlobal(
    "openSidebarMobile"
  );
  const [openSidebarMenuLeft, setOpenSidebarMenuLeft] = useGlobal(
    "openSidebarMenuLeft"
  );
  const [currentCurrency] = useGlobal("currentCurrency");
  const [tournamentTeams] = useGlobal("tournamentTeams");
  const [matches] = useGlobal("matches");
  const [challenges] = useGlobal("challenges");
  const [received, setReceived] = useState(0);
  const [tournamentInvitations, setTournamentInvitations] = useState([]);
  const [tournamentInscriptions, setTournamentInscriptions] = useState([]);

  useEffect(() => {
    const invitations_ = tournamentTeams.filter(
      (team) => !team.playerIdsAcceptInvitation.includes(get(authUser, "id"))
    );
    const inscriptions_ = tournamentTeams.filter((team) =>
      team.playerIdsAcceptInvitation.includes(get(authUser, "id"))
    );

    setTournamentInvitations(invitations_);
    setTournamentInscriptions(inscriptions_);
  }, [tournamentTeams]);

  useEffect(() => {
    const received_ = challenges.filter(
      (challenge) =>
        get(challenge, "challenged.id") === get(authUser, "id") &&
        challenge.challengedReady === false
    );
    setReceived(received_.length);
  }, [challenges]);

  return (
    <HeaderGridDesktop pathname={location.pathname}>
      <div className="content-menu-left">
        <MenuLeftContent
          onClick={() => setOpenSidebarMenuLeft(!openSidebarMenuLeft)}
        >
          <img
            src={`${config.storageUrl}/resources/menu-left-icon.svg`}
            className="img-logo"
            alt="menu left Bombo"
          />
        </MenuLeftContent>
        <div className={"content-logo"}>
          <img
            src={`${config.storageUrl}/resources/ebombo-fulllogo.svg`}
            className="img-logo"
            onClick={() => history.push("/games")}
            alt="Logo Bombo"
          />
        </div>
      </div>
      <div className="content-menu-center">
        <Anchor
          type="secondary"
          className={`content-menu-item ${
            location.pathname.includes("/games") &&
            location.pathname.includes("/consoles") &&
            location.pathname.includes("/challenges") &&
            !location.pathname.includes("my-challenges")
              ? "underline"
              : ""
          }`}
          onClick={() =>
            history.push(
              `/games/${currentGame.id}/consoles/${currentGame.consoleIds[0]}/challenges`
            )
          }
        >
          <img
            src={`${config.storageUrl}/resources/home-icon.svg`}
            alt="Logo Bombo"
          />
          <div className="content-name">Desafíos</div>
        </Anchor>
        <Anchor
          type="secondary"
          className={`content-menu-item ${
            location.pathname.includes("/tournaments") ? "underline" : ""
          }`}
          onClick={() =>
            history.push(`/games/${currentGame.id}/tournaments/open`)
          }
        >
          <img
            src={`${config.storageUrl}/resources/tournament-icon.svg`}
            alt="Logo Bombo"
          />
          <div className="content-name">Torneos</div>
          {!matches.some((match) => match.tournamentId) &&
          isEmpty(tournamentInscriptions) ? null : (
            <div className="notification">{tournamentInscriptions.length}</div>
          )}
        </Anchor>
        <Anchor
          type="secondary"
          className={
            authUser
              ? `content-menu-item fifth-step ${
                  location.pathname.includes("/notifications")
                    ? "underline"
                    : ""
                }`
              : "content-hide"
          }
          onClick={() => {
            history.push("/notifications/received");
          }}
        >
          <img
            src={`${config.storageUrl}/resources/match-icon.svg`}
            alt="Logo Bombo"
          />
          <div className="content-name">Encuentros</div>
          {received <= 0 &&
          isEmpty(matches.filter((match) => !match.tournamentId)) ? null : (
            <div className="notification">
              {received + matches.filter((match) => !match.tournamentId).length}
            </div>
          )}
        </Anchor>
      </div>
      {authUser ? (
        <div className="content-menu-right">
          <div className="charge-button">
            <Anchor
              type="primary"
              onClick={() =>
                history.push({
                  hash: "#right-menu",
                  search: "?tab=top-up-money",
                })
              }
            >
              Depositar
            </Anchor>
          </div>
          <div
            className="money-info"
            onClick={() => setOpenSidebarMobile(!openSidebarMobile)}
          >
            <span key={`key-money-${showMoney(authUser)}`}>
              {currentCurrency} {showMoney(authUser).toFixed(2)}
            </span>
            <span className="name">{get(authUser, "nickname", "...")}</span>
          </div>
          <div
            onClick={() => setOpenSidebarMobile(!openSidebarMobile)}
            className="open-menu-container profile-container"
          >
            <UserImageProfile
              url={
                authUser.profileImageUrlThumb
                  ? authUser.profileImageUrlThumb
                  : `${config.storageUrl}/resources/perfil-icon.svg`
              }
              size="medium"
              borderRadius="50%"
            />
            {isEmpty(tournamentInvitations) ? null : (
              <div className="notification">{tournamentInvitations.length}</div>
            )}
          </div>
        </div>
      ) : (
        <div className="content-menu-right">
          <HeaderLink onClick={() => props.visibleRegistration()}>
            Regístrate
          </HeaderLink>
          <HeaderLinkLogin
            onClick={() => {
              setIsVisibleLoginModal(true);
            }}
          >
            Iniciar sesión
          </HeaderLinkLogin>
        </div>
      )}
    </HeaderGridDesktop>
  );
};

const HeaderGridDesktop = styled.div`
  display: flex;
  justify-content: space-between;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  background: ${(props) => props.theme.basic.blackLighten};
  color: ${(props) => props.theme.basic.white};
  align-items: center;
  height: 3rem;
  padding: 0 1rem;

  .content-menu-left {
    display: flex;
    align-items: center;
    justify-content: start;
    height: 100%;

    .content-hide {
      min-width: 36.3px;
      height: auto;
      visibility: hidden;
    }

    .content-logo {
      display: flex;
      align-items: center;
      justify-content: start;
      height: 100%;
      margin-left: 3rem;

      .img-logo {
        cursor: pointer;
        justify-self: center;
        width: auto;
        height: 20px;

        ${mediaQuery.afterTablet} {
          height: 25px;
        }
      }
    }

    .content-menu-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: 100%;
      cursor: pointer;
      position: relative;

      img {
        width: auto;
        height: 1.3rem;
      }

      .content-name {
        font-size: 0.7rem;
        font-weight: 400;
        height: auto;
        min-width: 44.23px;
        margin: 0 10px;
      }

      .notification {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 9px;
        top: 3px;
        right: -4px;
        margin: auto 5px;
        width: 12px;
        height: 12px;
        border-radius: 6px;
        background: ${(props) => props.theme.basic.primary};
        color: ${(props) => props.theme.basic.blackDarken};
      }
    }

    .underline {
      border-bottom: 2px solid ${(props) => props.theme.basic.primary};
    }
  }

  .content-menu-center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    flex-grow: 1;

    .content-hide {
      min-width: 36.3px;
      height: auto;
      visibility: hidden;
    }

    .content-menu-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: 100%;
      cursor: pointer;
      position: relative;
      margin-right: 1rem;

      img {
        width: auto;
        height: 1.3rem;
      }

      .content-name {
        font-size: 0.7rem;
        font-weight: 400;
        height: auto;
        min-width: 44.23px;
        margin: 0 10px;
      }

      .notification {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 9px;
        top: 6px;
        right: -5px;
        margin: auto 5px;
        width: 10px;
        height: 10px;
        border-radius: 6px;
        background: ${(props) => props.theme.basic.primary};
        color: ${(props) => props.theme.basic.blackDarken};
      }
    }

    .underline {
      border-bottom: 2px solid ${(props) => props.theme.basic.primary};
    }
  }

  .content-menu-right {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;

    .type-money-info {
      display: flex;
      align-items: center;
      position: relative;
    }

    .money-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-left: 1rem;
      padding-right: 0.5rem;
      cursor: pointer;

      span {
        display: block;
        font-size: 11px;
        line-height: 14px;
        font-weight: 500;
      }

      .name {
        font-weight: bold;
      }
    }

    .open-menu-container {
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;

      span {
        margin-right: 5px;
      }

      .notification {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 10px;
        top: 6px;
        right: -5px;
        margin: 0;
        width: 12px;
        height: 12px;
        border-radius: 6px;
        background: ${(props) => props.theme.basic.primary};
        color:${(props) => props.theme.basic.blackDarken};
    }

    .charge-button {
      span {
        height: 100%;
        padding: 0.5rem;
        color: ${(props) => props.theme.basic.primary};
        cursor: pointer;
        font-size: 12px;
        line-height: 15px;
      }
    }
  }
`;

const MenuLeftContent = styled(Container)`
  cursor: pointer;
  padding: 0;
`;

const HeaderLink = styled.span`
  display: block;
  cursor: pointer;
  color: ${(props) => props.theme.basic.primary};
  font-size: 0.6rem;
  font-weight: 600;
  margin: auto;

  ${mediaQuery.afterTablet} {
    font-size: 1rem;
  }
`;

const HeaderLinkLogin = styled.span`
  text-align: center;
  cursor: pointer;
  color: ${(props) => props.theme.basic.white};
  font-size: 0.6rem;
  font-weight: 600;
  padding: 0 8px;

  ${mediaQuery.afterTablet} {
    font-size: 1rem;
  }
`;

const SwitchMoney = styled.div`
  height: 20px;
  text-align: left;
  font-size: 11px;

  .ant-switch {
    width: 40px;
    background: ${(props) => props.theme.basic.blackLighten};
  }

  .ant-switch.ant-switch-checked {
    border: 1px solid ${(props) => props.theme.basic.default};
    font-size: 11px;
    margin: 0 5px;
    padding: 0 0 0 4px;

    .ant-switch-inner {
      margin-right: 60px;
      margin-left: 4px;
      color: ${(props) => props.theme.basic.white};
    }
  }

  .ant-switch.ant-switch-checked::after {
    content: "$";
    font-weight: bold;
    font-size: 13px;
    background: ${(props) => props.theme.basic.primary};
    color: ${(props) => props.theme.basic.blackDarken};
    width: 25px;
    height: 20px;
    margin-top: -2px;
    margin-left: 2px;
  }

  .ant-switch[class$="switch"] {
    border: 1px solid ${(props) => props.theme.basic.default};
    background: ${(props) => props.theme.basic.blackLighten};
    font-size: 11px;
    margin: 0 5px;
    height: 20px;

    .ant-switch-inner {
      margin-right: 2px;
      color: ${(props) => props.theme.basic.white};
    }
  }

  .ant-switch::after {
    content: "K";
    font-weight: bold;
    font-size: 13px;
    background: ${(props) => props.theme.basic.primary};
    color: ${(props) => props.theme.basic.blackDarken};
    width: 25px;
    height: 20px;
    margin-top: -2px;
    margin-left: -2px;
  }
`;
