import React, {useEffect, useGlobal, useState} from "reactn";
import {BackButton, InputSearch} from "../../../../components";
import {config, firestore} from "../../../../firebase";
import {snapshotToArray, spinLoader} from "../../../../utils";
import styled from "styled-components";
import {SpinLoader} from "../../../../styles";
import {useHistory, useParams} from "react-router";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import {Image} from "../../../../components/common/Image";
import {darkTheme} from "../../../../styles/theme";

export const Followings = (props) => {
  const {userId} = useParams();
  const history = useHistory();

  const [authUser] = useGlobal("user");
  const [games] = useGlobal("games");

  const [followings, setFollowings] = useState([]);
  const [searchFollowing, setSearchFollowing] = useState("");
  const [notFound, setNotFound] = useState(null);
  const [loadingFollowing, setLoadingFollowing] = useState(true);
  const [filterUsers] = useState(get(props, "playerIds", []));

  const isOwnProfile = defaultTo(props.userId, userId) === authUser.id;

  useEffect(() => {
    fetchFollowings();
  }, []);

  const fetchFollowings = async () => {
    setLoadingFollowing(true);

    const usersQuerySnapShot = await firestore
      .collection("followers")
      .where("followerUser.id", "==", defaultTo(props.userId, userId))
      .orderBy("createAt", "desc")
      .limit(10)
      .get();

    setFollowings(snapshotToArray(usersQuerySnapShot));

    setLoadingFollowing(false);
  };

  useEffect(() => {
    if (isEmpty(searchFollowing.trim())) return;

    fetchFollowing();
  }, [searchFollowing]);

  const fetchFollowing = async () => {
    setLoadingFollowing(true);

    const followersQuerySnapShot = await firestore
      .collection("followers")
      .where("user.nicknameUppercase", "==", searchFollowing.toUpperCase())
      .limit(1)
      .get();

    followersQuerySnapShot.empty
      ? setNotFound(searchFollowing + " no encontrado")
      : setNotFound(null);

    setFollowings(snapshotToArray(followersQuerySnapShot));

    setLoadingFollowing(false);
  };

  return (
    <Container>
      {!props.sendInvitation && (
        <div className="back-container">
          <BackButton
            onClick={() => props.setTabContainer("menu")}
            color={darkTheme.basic.blackLighten}
          />
        </div>
      )}
      <h1>Siguiendo</h1>
      {!props.hideSearch && (
        <InputFollowers>
          <InputSearch
            onSearch={(value) => setSearchFollowing(value)}
            placeholder="Nombre de usuario"
          />
        </InputFollowers>
      )}
      <UserResults>
        {notFound && (
          <div style={{ color: "white", textAlign: "center" }}>{notFound}</div>
        )}
        {loadingFollowing ? (
          <SpinLoader>{spinLoader()}</SpinLoader>
        ) : (
          followings.map((following) => (
            <UserResult key={following.user.id}>
              <div
                className="user-info"
                onClick={() => history.push(`/users/${following.user.id}`)}
              >
                <Image
                  size="cover"
                  src={
                    following.user.profileImageUrlThumb
                      ? following.user.profileImageUrlThumb
                      : `${config.storageUrl}/resources/perfil-icon.svg`
                  }
                  height="35px"
                  width="35px"
                  borderRadius="50%"
                />
                <div className="user-name">{following.user.nickname}</div>
              </div>
              {following.user.id !== authUser.id && !props.sendInvitation && (
                <span
                  className="span-button"
                  onClick={() => history.push(`/users/${following.user.id}`)}
                >
                  {!isOwnProfile
                    ? "Ver perfil"
                    : following.followerUser.id === authUser.id
                    ? "Siguiendo"
                    : "Seguir"}
                </span>
              )}
              {following.user.id !== authUser.id &&
                !filterUsers.includes(following.user.id) && (
                  <span
                    className="span-button"
                    onClick={() =>
                      props.sendInvitation
                        ? props.sendInvitation(following.user.id)
                        : history.push(
                            `/games/${games[0].id}/consoles/${games[0].consoleIds[0]}/challenges/new/users/${following.user.id}`
                          )
                    }
                  >
                    Invitar
                  </span>
                )}
            </UserResult>
          ))
        )}
      </UserResults>
    </Container>
  );
};

const InputFollowers = styled.div`
  width: 100%;
  padding: 10px 0;
`;

const Container = styled.div`
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

  .back-container {
    padding: 1rem 0;
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
      color: ${(props) => props.theme.basic.blackLighten};
      margin-left: 5px;
    }
  }

  .span-button {
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    cursor: pointer;
    color: ${(props) => props.theme.basic.blackLighten};
    height: 100%;
    padding: 0 1rem;
  }
`;
