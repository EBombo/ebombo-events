import {config} from "../firebase";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import {showMoney} from "../utils/showMoney";
import React, {useEffect, useGlobal, useState} from "reactn";
import styled from "styled-components";
import {useHistory, useLocation} from "react-router";
import {Container} from "./Container";
import {Banner} from "./banner";
import {Image} from "./common/Image";

export const ContentBarTablet = (props) => {
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
  const [received, setReceived] = useState(0);
  const [challenges] = useGlobal("challenges");
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
    <>
      <Banner />
      <TopHeader>
        <HeaderGridTablet pathname={location.pathname}>
          <section className="main-menu">
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
            </div>
            <div className="content-layout">
              <div
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
                  <div className="notification">
                    {tournamentInscriptions.length}
                  </div>
                )}
              </div>
              <div
                className={`content-logo ${
                  location.pathname.includes("/games") &&
                  location.pathname.includes("/consoles") &&
                  location.pathname.includes("/challenges") &&
                  !location.pathname.includes("my-challenges")
                    ? "underline"
                    : ""
                }`}
              >
                <img
                  src={`${config.storageUrl}/resources/imalogo-green.svg`}
                  className="img-logo"
                  onClick={() =>
                    history.push(
                      `/games/${currentGame.id}/consoles/${currentGame.consoleIds[0]}/challenges`
                    )
                  }
                  alt="Logo Bombo"
                />
              </div>

              <div
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
                {authUser && (
                  <>
                    <img
                      src={`${config.storageUrl}/resources/match-icon.svg`}
                      alt="Logo Bombo"
                    />
                    <div className="content-name">Encuentros</div>
                    {received <= 0 &&
                    isEmpty(
                      matches.filter((match) => !match.tournamentId)
                    ) ? null : (
                      <div className="notification">
                        {received +
                          matches.filter((match) => !match.tournamentId).length}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            {authUser ? (
              <HeaderProfileContainer>
                <div
                  className="user-info"
                  onClick={() => setOpenSidebarMobile(!openSidebarMobile)}
                >
                  <span key={`key-money-${showMoney(authUser)}`}>
                    <div className="money-content no-wrap">
                      {`${currentCurrency} ${showMoney(authUser).toFixed(2)}`}
                    </div>
                  </span>
                  <Image
                    src={
                      authUser.profileImageUrlThumb
                        ? authUser.profileImageUrlThumb
                        : `${config.storageUrl}/resources/perfil-icon.svg`
                    }
                    margin="0"
                    height="25px"
                    width="25px"
                    borderRadius="50%"
                  />
                  {isEmpty(tournamentInvitations) ? null : (
                    <div className="notification">
                      {tournamentInvitations.length}
                    </div>
                  )}
                </div>
              </HeaderProfileContainer>
            ) : (
              <HeaderProfileContainer>
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
              </HeaderProfileContainer>
            )}
          </section>
        </HeaderGridTablet>
      </TopHeader>
    </>
  );
};

const TopHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderGridTablet = styled.div`
  height: auto;
  width: 100%;
  background: ${(props) => props.theme.basic.blackLighten};

  .main-menu {
    display: grid;
    grid-template-columns: repeat(3, auto);
    color: ${(props) => props.theme.basic.white};
    align-items: center;
    padding: 0 0.5rem;
    height: 3rem;

    .content-menu-left {
      min-width: 36.3px;
      height: auto;
    }

    .content-layout {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;

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
          height: 1rem;
          margin-right: 5px;
        }

        .notification {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 9px;
          top: 5px;
          right: -15px;
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

      .content-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        margin: 0 10px;

        .img-logo {
          cursor: pointer;
          justify-self: center;
          width: auto;
          height: 2rem;
        }
      }

      .content-left {
        margin-right: 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 100%;
        cursor: pointer;

        img {
          width: auto;
          height: 0.8rem;
        }

        .content-name {
          font-size: 0.7rem;
          color: ${(props) => props.theme.basic.primary};
          margin: 0 1px;
          font-weight: 400;
          height: auto;
          min-width: 44.23px;
        }
      }
    }
  }
`;

const MenuLeftContent = styled(Container)`
  cursor: pointer;
  padding: 0;
`;

const HeaderProfileContainer = styled(Container)`
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row-reverse;
  width: auto;

  .type-money-info {
    display: flex;
    align-items: center;
  }

  .user-info {
    cursor: pointer;
    justify-self: flex-end;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    position: relative;

    span {
      font-size: 12px;
      color: ${(props) => props.theme.basic.white};
      margin-right: 3px;
    }

    img {
      height: 20px;
      width: 20px;
    }

    .money-content {
      font-size: 10px;

      img {
        margin-left: 5px;
        width: 15px;
      }
    }
    .notification {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 9px;
      top: -2px;
      right: 0px;
      margin: 0;
      width: 12px;
      height: 12px;
      border-radius: 6px;
      background: ${(props) => props.theme.basic.primary};
      color: ${(props) => props.theme.basic.blackDarken};
    }
  }
`;

const HeaderLinkLogin = styled.span`
  text-align: center;
  cursor: pointer;
  color: ${(props) => props.theme.basic.white};
  font-size: 12px;
  font-weight: 300;
`;

const HeaderLink = styled.span`
  display: block;
  cursor: pointer;
  color: ${(props) => props.theme.basic.primary};
  font-size: 12px;
  font-weight: 300;
  margin: auto;
`;
