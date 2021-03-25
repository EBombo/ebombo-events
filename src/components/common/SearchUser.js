import React, {useEffect, useGlobal, useState} from "reactn";
import {InputSearch} from "../index";
import {config, firestore} from "../../firebase";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import {snapshotToArray, spinLoader} from "../../utils";
import styled from "styled-components";
import {SpinLoader} from "../../styles";
import {useHistory} from "react-router";
import {Image} from "./Image";

export const SearchUser = (props) => {
  const [games] = useGlobal("games");
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [notFound, setNotFound] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [filterUsers] = useState(get(props, "playerIds", []));
  const [, setOpenSidebarMobile] = useGlobal("openSidebarMobile");

  const history = useHistory();

  useEffect(() => {
    if (isEmpty(searchUser.trim())) return;

    fetchUserByNickNameUppercase();
  }, [searchUser]);

  const fetchUserByNickNameUppercase = async () => {
    setLoadingUsers(true);

    const usersQuerySnapShot = await firestore
      .collection("users")
      .where("nicknameUppercase", "==", searchUser.toUpperCase())
      .limit(1)
      .get();

    usersQuerySnapShot.empty
      ? setNotFound(searchUser + " no encontrado")
      : setNotFound(null);

    setUsers(snapshotToArray(usersQuerySnapShot));

    setLoadingUsers(false);
  };

  return (
    <SearchUserContainer>
      <h1>Buscar usuario:</h1>
      <InputSearchUser>
        <InputSearch
          type={props.type}
          onSearch={(value) => setSearchUser(value)}
          placeholder="Nombre de usuario"
        />
      </InputSearchUser>
      <UserResults>
        {notFound && (
          <div style={{ color: "white", textAlign: "center" }}>{notFound}</div>
        )}
        {loadingUsers ? (
          <SpinLoader>{spinLoader()}</SpinLoader>
        ) : (
          <>
            {users.map((user) => (
              <UserResult key={user.id} type={props.type}>
                <div
                  className="user-info"
                  onClick={() => history.push(`/users/${user.id}`)}
                >
                  <Image
                    size="cover"
                    src={
                      user.profileImageUrlThumb
                        ? user.profileImageUrlThumb
                        : `${config.storageUrl}/resources/perfil-icon.svg`
                    }
                    height="35px"
                    width="35px"
                    borderRadius="50%"
                  />
                  <div className="user-name">{user.nickname}</div>
                </div>
                {!filterUsers.includes(user.id) && (
                  <span
                    className="span-button"
                    onClick={() => {
                      props.sendInvitation
                        ? props.completeUser
                          ? props.sendInvitation(user)
                          : props.sendInvitation(user.id)
                        : history.push(
                            `/games/${games[0].id}/consoles/${games[0].consoleIds[0]}/challenges/new/users/${user.id}`
                          );
                      setOpenSidebarMobile(false);
                    }}
                  >
                    Invitar
                  </span>
                )}
                {!filterUsers.includes(user.id) &&
                  isEmpty(filterUsers) &&
                  !props.sendInvitation && (
                    <span
                      className="span-button"
                      onClick={() => history.push(`/users/${user.id}`)}
                    >
                      Ver perfil
                    </span>
                  )}
              </UserResult>
            ))}
          </>
        )}
      </UserResults>
    </SearchUserContainer>
  );
};

const InputSearchUser = styled.div`
  width: 100%;
  padding: 10px 0;
`;

const SearchUserContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  padding: 0.5rem 1rem;

  h1 {
    font-weight: 600;
    font-size: 12px;
    line-height: 15px;
    color: ${(props) => props.theme.basic.blackLighten};
    margin: 0.5rem 0;
  }

  h4 {
    font-size: 12px;
    color: ${(props) => props.theme.basic.white};
  }
`;

const UserResults = styled.div`
  margin: 0;
`;

const UserResult = styled.div`
  align-items: center;
  color: ${(props) => props.theme.basic.white};
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
  margin-right: 1rem;

  .user-info {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .user-name {
      font-weight: 500;
      font-size: 11px;
      line-height: 14px;
      color: ${(props) =>
        props.type === "primary"
          ? props.theme.basic.white
          : props.theme.basic.blackLighten};
      margin-left: 5px;
    }
  }

  .span-button {
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    cursor: pointer;
    color: ${(props) =>
      props.type === "primary"
        ? props.theme.basic.primary
        : props.theme.basic.blackLighten};
    height: 100%;
    padding: 0 1rem;
  }
`;
