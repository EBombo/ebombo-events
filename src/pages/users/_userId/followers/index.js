import React, {useEffect, useGlobal, useState} from "reactn";
import {BackButton, InputSearch} from "../../../../components";
import {config, firestore} from "../../../../firebase";
import {snapshotToArray, spinLoader} from "../../../../utils";
import styled from "styled-components";
import {rgbaPrimary} from "../../../../styles/constants";
import {SpinLoader} from "../../../../styles";
import {useHistory, useParams} from "react-router";
import defaultTo from "lodash/defaultTo";
import isEmpty from "lodash/isEmpty";
import {darkTheme} from "../../../../styles/theme";
import {Image} from "../../../../components/common/Image";

export const Followers = (props) => {
  const {userId} = useParams();
  const history = useHistory();

  const [authUser] = useGlobal("user");
  const [games] = useGlobal("games");

  const [followers, setFollowers] = useState([]);
  const [searchFollower, setSearchFollower] = useState("");
  const [notFound, setNotFound] = useState(null);
  const [loadingFollowers, setLoadingFollowers] = useState(true);

  useEffect(() => {
    fetchFollowers();
  }, []);

  const fetchFollowers = async () => {
    setLoadingFollowers(true);

    const followersQuerySnapShot = await firestore
      .collection("followers")
      .where("user.id", "==", defaultTo(props.userId, userId))
      .orderBy("createAt", "desc")
      .limit(10)
      .get();

    setFollowers(snapshotToArray(followersQuerySnapShot));

    setLoadingFollowers(false);
  };

  useEffect(() => {
    if (isEmpty(searchFollower.trim())) return;

    fetchFollower();
  }, [searchFollower]);

  const fetchFollower = async () => {
    setLoadingFollowers(true);

    const followersQuerySnapShot = await firestore
      .collection("followers")
      .where(
        "followerUser.nicknameUppercase",
        "==",
        searchFollower.toUpperCase()
      )
      .limit(1)
      .get();

    followersQuerySnapShot.empty
      ? setNotFound(searchFollower + " no encontrado")
      : setNotFound(null);

    setFollowers(snapshotToArray(followersQuerySnapShot));

    setLoadingFollowers(false);
  };

  return (
    <Container>
      <div className="back-container">
        <BackButton
          onClick={() => props.setTabContainer("menu")}
          color={darkTheme.basic.blackLighten}
        />
      </div>
      <div className="title">Seguidores</div>
      <div className="search-user">
        <InputFollowers>
          <InputSearch
            onSearch={(value) => setSearchFollower(value)}
            placeholder="Nombre de usuario"
          />
        </InputFollowers>
        <UserResults>
          {notFound && (
            <div style={{ color: "white", textAlign: "center" }}>
              {notFound}
            </div>
          )}
          {loadingFollowers ? (
            <SpinLoader>{spinLoader()}</SpinLoader>
          ) : (
            followers.map((follower) => (
              <UserResult key={follower.followerUser.id}>
                <div
                  className="user-info"
                  onClick={() =>
                    history.push(`/users/${follower.followerUser.id}`)
                  }
                >
                  <Image
                    size="cover"
                    src={
                      follower.followerUser.profileImageUrlThumb
                        ? follower.followerUser.profileImageUrlThumb
                        : `${config.storageUrl}/resources/perfil-icon.svg`
                    }
                    height="35px"
                    width="35px"
                    borderRadius="50%"
                  />
                  <div className="user-name">
                    {follower.followerUser.nickname}
                  </div>
                </div>

                {follower.followerUser.id !== authUser.id && (
                  <>
                    <span
                      className="span-button"
                      onClick={() =>
                        history.push(`/users/${follower.followerUser.id}`)
                      }
                    >
                      Ver Perfil
                    </span>
                    <span
                      className="span-button"
                      onClick={() =>
                        history.push(
                          `/games/${games[0].id}/consoles/${games[0].consoleIds[0]}/challenges/new/users/${follower.followerUser.id}`
                        )
                      }
                    >
                      Invitar
                    </span>
                  </>
                )}
              </UserResult>
            ))
          )}
        </UserResults>
      </div>
    </Container>
  );
};

const InputFollowers = styled.div`
  width: 100%;
  padding: 10px 0;

  span {
    input {
      width: 100%;
      height: 100%;
      ${rgbaPrimary(0.06)};
      border: 1px solid ${(props) => props.theme.basic.primary};
      border-radius: 7px;
      padding: 8px 10px;
      color: ${(props) => props.theme.basic.primary};
    }

    input:focus {
      outline: none;
    }

    .ant-input-suffix {
      i {
        color: ${(props) => props.theme.basic.primary} !important;
      }
    }
  }
`;

const Container = styled.div`
  width: 100%;
  margin: auto;

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

  .search-user {
    padding: 1rem;
    overflow: auto;
    max-height: calc(70vh - 3rem);
  }
`;

const UserResults = styled.div`
  margin: 0.5rem 0;
  display: grid;
  grid-gap: 0.5rem;
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
    padding: 0 1rem;
  }
`;