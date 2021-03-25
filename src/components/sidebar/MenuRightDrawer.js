import React, {useEffect, useGlobal, useState} from "reactn";
import get from "lodash/get";
import {config} from "../../firebase";
import styled from "styled-components";
import {useHistory} from "react-router";
import {TopUpMoneyNuibiz} from "./Deposit/TopUpMoneyNuibiz";
import {SearchUser} from "../common/SearchUser";
import {AccountBalance} from "./AccountBalance";
import {Followers, Followings} from "../../pages";
import UrlAssembler from "url-assembler";
import {currentUrlQuery} from "../../utils/queryUrl";
import {useErrorHandler} from "react-error-boundary";
import {useOwnFetch} from "../../utils/useFetch/useFetch";
import {MenuProfile} from "./MenuProfile";
import {darkTheme} from "../../styles/theme";
import {BackButton} from "../common";

export const MenuDrawerContainer = (props) => {
  const history = useHistory();

  const [authUser] = useGlobal("user");
  const [games] = useGlobal("games");

  const [, setOpenSidebarMobile] = useGlobal("openSidebarMobile");
  const [, setLoadingReceiveEmail] = useState(false);

  const [tabContainer, setTabContainer] = useState("menu");

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  useEffect(() => {
    const newTab = currentUrlQuery("tab");
    newTab && setTabContainer(newTab);
  }, [window.location.search]);

  const resetUrlParams = () =>
    history.push({
      hash: "#right-menu",
      search: "",
    });

  const profileContainer = () => {
    if (tabContainer === "menu")
      return (
        <MenuProfile
          {...props}
          setTabContainer={(value) => {
            setTabContainer(value);
            resetUrlParams();
          }}
        />
      );

    if (tabContainer === "top-up-money")
      return (
        <TopUpMoneyNuibiz
          setTabContainer={(value) => {
            setTabContainer(value);
            resetUrlParams();
          }}
        />
      );

    if (tabContainer === "search-user")
      return (
        <ContainerInvite>
          <div className="back-container">
            <BackButton
              onClick={() => setTabContainer("menu")}
              color={darkTheme.basic.blackLighten}
            />
          </div>
          <div className="title">Invitar Usuario</div>
          <div className="search-container">
            <SearchUser
              setTabContainer={(value) => {
                setTabContainer(value);
                history.push({
                  hash: "#right-menu",
                  search: "",
                });
              }}
            />
          </div>
          <div className="following-container">
            <Followings
              hideSearch={true}
              sendInvitation={(followingUserId) => {
                history.push(
                  `/games/${games[0].id}/consoles/${games[0].consoleIds[0]}/challenges/new/users/${followingUserId}`
                );
                setOpenSidebarMobile(false);
              }}
              userId={get(authUser, "id")}
            />
          </div>
        </ContainerInvite>
      );

    if (tabContainer === "action-balance")
      return (
        <AccountBalance
          setTabContainer={(value) => {
            setTabContainer(value);
            resetUrlParams();
          }}
        />
      );

    if (tabContainer === "followings")
      return (
        <Followings
          setTabContainer={(value) => {
            setTabContainer(value);
            resetUrlParams();
          }}
          userId={authUser.id}
        />
      );

    if (tabContainer === "followers")
      return (
        <Followers
          setTabContainer={(value) => {
            setTabContainer(value);
            resetUrlParams();
          }}
          userId={authUser.id}
        />
      );
  };

  const toggleReceiveEmail = async () => {
    setLoadingReceiveEmail(true);
    await updateUserReceiveEmail();
  };

  const updateUserReceiveEmail = async () => {
    try {
      await ownFetch(urlApiChangeReceiveEmail(authUser.id), "PUT");
    } catch (error) {
      handleError({ ...error, action: "updateUserReceiveEmail" });
    }
    setLoadingReceiveEmail(false);
  };

  const urlApiChangeReceiveEmail = (userId) =>
    new UrlAssembler(`${config.serverUrl}`)
      .template("/users/:userId/received-email")
      .param({
        userId,
      })
      .toString();

  return profileContainer();
};

const ContainerInvite = styled.div`
  .title {
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    color: ${(props) => props.theme.basic.blackLighten};
    padding: 1rem;
    border-bottom: 1px solid #c4c4c4;
  }

  .search-container {
    padding-bottom: 2rem;
    border-bottom: 1px solid #c4c4c4;
  }

  .back-container {
    padding: 1rem 1rem 0 1rem;
  }
`;
