import React, {useEffect, useGlobal, useState} from "reactn";
import {Image} from "../common/Image";
import {config} from "../../firebase";
import {showExpiringMoney, showMoney} from "../../utils/showMoney";
import {Icon} from "../common/Icons";
import {ButtonBombo} from "../common";
import styled from "styled-components";
import get from "lodash/get";
import {Container} from "../Container";
import {Tabs} from "antd";
import {useAcl} from "../../acl";
import {useHistory} from "react-router";
import {mediaQuery} from "../../styles/constants";
import {Anchor} from "../common/Anchor";
import moment from "moment";
import isEmpty from "lodash/isEmpty";

export const MenuProfile = (props) => {
  const { userAcls } = useAcl();
  const { TabPane } = Tabs;
  const history = useHistory();

  const [authUser] = useGlobal("user");
  const [, setOpenSidebarMobile] = useGlobal("openSidebarMobile");
  const [currentCurrency] = useGlobal("currentCurrency");
  const [tournamentTeams] = useGlobal("tournamentTeams");
  const [, setIsVisibleEditProfilePicture] = useGlobal(
    "isVisibleEditProfilePicture"
  );
  const [tournamentInvitations, setTournamentInvitations] = useState([]);

  useEffect(() => {
    const invitations_ = tournamentTeams.filter(
      (team) => !team.playerIdsAcceptInvitation.includes(authUser.id)
    );

    setTournamentInvitations(invitations_);
  }, [tournamentTeams]);

  return (
    <>
      <ProfileContainer>
        <div className="first-container">
          <div className="image-profile">
            <Image
              src={
                authUser
                  ? authUser.profileImageUrlThumb
                    ? authUser.profileImageUrlThumb
                    : `${config.storageUrl}/resources/perfil-icon.svg`
                  : `${config.storageUrl}/resources/perfil-icon.svg`
              }
              size={"cover"}
              margin={"0 auto"}
              borderRadius={"50%"}
              height={"50px"}
              width={"50px"}
              onClick={() => {
                authUser && setOpenSidebarMobile(false);
                authUser && history.push(`/users/${authUser.id}`);
              }}
            />
            <img
              className="edit-photo"
              src={`${config.storageUrl}/resources/upload-icon.svg`}
              alt="icon-edit"
              onClick={() => setIsVisibleEditProfilePicture(true)}
            />
          </div>
          <div className="user-info">
            <div className="user-name">
              {authUser ? authUser.nickname : "Visitante"}
            </div>
            <div className="user-money">
              {currentCurrency}
              {authUser ? showMoney(authUser).toFixed(2) : 0}
            </div>
          </div>
        </div>

        <div className="button-container">
          <ButtonBombo
            margin="25px 0"
            fontWeight="bold"
            onClick={() => props.setTabContainer("top-up-money")}
          >
            Depositar
          </ButtonBombo>
        </div>
        <div className="withdraw-money">
          <span>Dinero Retirable:</span>
          {currentCurrency}
          {authUser ? get(authUser, "money", 0).toFixed(2) : 0}
        </div>
        <div className="credit-money">
          <span>
            <Icon
              type="info-circle"
              onClick={() => props.setTabContainer("action-balance")}
            />
            ebombo créditos:
          </span>
          <label>
            {currentCurrency}
            {authUser ? showExpiringMoney(authUser).toFixed(2) : 0}
          </label>
        </div>
      </ProfileContainer>
      <MenuTabs defaultActiveKey="1">
        <TabPane tab={<b>Mi Cuenta</b>} key="1">
          <MenuItem onClick={() => props.setTabContainer("search-user")}>
            <span>Invitar usuario</span>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenSidebarMobile(false);
              history.push(`/users/${authUser.id}`);
            }}
          >
            <span>Perfil</span>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenSidebarMobile(false);
              history.push(`/users/${authUser.id}/user-accounts`);
            }}
          >
            <span>ID de juegos</span>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenSidebarMobile(false);
              history.push(`/users/${authUser.id}/withdraw`);
            }}
          >
            <span>Retirar</span>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenSidebarMobile(false);
              history.push(`/users/${authUser.id}/transactions`);
            }}
          >
            <span>Historial de Transacciones</span>
          </MenuItem>
          {userAcls.some((acl) => acl.includes("admin")) && (
            <MenuItem
              onClick={() =>
                history.push(userAcls.find((acl) => acl.includes("admin")))
              }
            >
              <span>Opciones de administración</span>
            </MenuItem>
          )}
          <MenuItem logout onClick={() => props.logOut()}>
            <span>Cerrar Sesión</span>
          </MenuItem>
        </TabPane>
        <TabPane
          tab={
            <div>
              <b>Mis Mensajes</b>
              {isEmpty(tournamentInvitations) ? null : (
                <div className="notification">
                  {tournamentInvitations.length}
                </div>
              )}
            </div>
          }
          key="2"
        >
          {!isEmpty(tournamentInvitations) && (
            <MessageContainer>
              {tournamentInvitations.map((teamInvitation) => (
                <MenuItemMessage>
                  <div className="tournament-info">
                    <div className="title">Invitación de Torneo</div>
                    <div className="expiration">
                      La invitación vence el{" "}
                      {moment(
                        teamInvitation.tournament.startDate.toDate()
                      ).format("DD-MM-YYYY hh:mm a")}
                    </div>
                    <span className="captain-invitation">
                      <span>{teamInvitation.players[0].nickname}</span> te ha
                      invitado a participar un torneo.
                    </span>
                  </div>
                  <Anchor
                    type="primary"
                    onClick={() => {
                      authUser && setOpenSidebarMobile(false);
                      history.push(
                        `/games/${teamInvitation.tournament.game.id}/consoles/${teamInvitation.tournament.console.id}/tournaments/${teamInvitation.tournamentId}`
                      );
                    }}
                  >
                    Ver >
                  </Anchor>
                </MenuItemMessage>
              ))}
            </MessageContainer>
          )}
          {isEmpty(tournamentInvitations) && (
            <EmptyMessageContainer>
              <div className="message">No tienes mensajes por el momento</div>
            </EmptyMessageContainer>
          )}
        </TabPane>
      </MenuTabs>
    </>
  );
};

const EmptyMessageContainer = styled.div`
  height: 280px;
  padding: 0.5rem;
  .message {
    font-weight: 500;
    font-size: 10px;
    line-height: 13px;
    color: ${(props) => props.theme.basic.grayDarken};
  }
`;

const MessageContainer = styled.div`
  height: 280px;
  overflow: auto;
`;

const MenuTabs = styled(Tabs)`
  .ant-tabs-nav::before {
    border-bottom: 2px solid #c4c4c4;
  }

  .ant-tabs-nav {
    margin: 0 !important;
    .ant-tabs-nav-wrap {
      .ant-tabs-nav-list {
        .ant-tabs-tab,
        .ant-tabs-tab-active {
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
          div {
            color: ${(props) => props.theme.basic.blackLighten};
          }
        }

        .ant-tabs-tab {
          padding: 0.5rem 1rem;
          margin: 0 !important;
        }

        .ant-tabs-ink-bar {
          background: ${(props) => props.theme.basic.primary};
        }
      }
    }
  }
`;

const MenuItemMessage = styled(Container)`
  cursor: pointer;
  height: 65px;
  justify-content: space-between;
  align-items: center;

  .tournament-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 0;
    .title {
      font-weight: 600;
      font-size: 13px;
      line-height: 15px;
      color: ${(props) => props.theme.basic.grayDarken};
    }
    .expiration {
      font-weight: 500;
      font-size: 10px;
      line-height: 13px;
      color: ${(props) => props.theme.basic.grayDarken};
    }
    .captain-invitation {
      font-size: 10px;
      line-height: 13px;
      font-weight: 500;
      color: ${(props) => props.theme.basic.grayDarken};
      span {
        font-size: 10px;
        line-height: 13px;
        font-weight: 600;
      }
    }
  }
`;

const MenuItem = styled(Container)`
  cursor: pointer;
  height: 40px;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 1px #c4c4c4;
  padding: 0 16px;

  span {
    display: flex;
    font-size: 14px;
    color: ${(props) =>
      props.logout ? props.theme.basic.danger : props.theme.basic.blackLighten};
    align-items: center;
    height: 100%;
    ${mediaQuery.afterTablet} {
      font-size: 15px;
    }
  }

  .icon-menu {
    height: 22px;
    width: auto !important;
  }
`;

const ProfileContainer = styled(Container)`
  display: grid;
  grid-template-columns: 50% 50%;
  height: auto;
  border-bottom: 1px solid ${(props) => props.theme.basic.grayLighten};

  .image-profile {
    cursor: pointer;
    position: relative;
    .edit-photo {
      position: absolute;
      bottom: 0;
      right: 12px;
      height: 15px;
      cursor: pointer;
      ${mediaQuery.afterTablet} {
        right: 6px;
      }
    }
  }

  .first-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;

    .user-info {
      font-weight: normal;

      .user-name {
        font-size: 12px;
        line-height: 14px;
        font-weight: 300;
        color: ${(props) => props.theme.basic.blackLighten};
      }

      .user-money {
        font-weight: 600;
        font-size: 18px;
        line-height: 20px;
        color: ${(props) => props.theme.basic.grayLight};
      }
    }
  }

  .button-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .withdraw-money,
  .credit-money {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: ${(props) => props.theme.basic.grayLight};
    font-weight: 500;
    font-size: 15px;
    line-height: 16px;

    span {
      font-size: 12px;
      color: ${(props) => props.theme.basic.blackLighten};
      display: flex;
      align-items: center;
      margin-right: 5px;
      font-weight: 300;
    }
    label {
      margin-left: 16px;
    }
  }
`;
