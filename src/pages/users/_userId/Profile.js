import React, { useGlobal, useState } from "reactn";
import { config } from "../../../firebase";
import styled from "styled-components";
import { darkTheme } from "../../../styles/theme";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import UrlAssembler from "url-assembler";
import { useHistory, useParams } from "react-router";
import { BackButton, ButtonBombo } from "../../../components";
import { useErrorHandler } from "react-error-boundary";
import { useOwnFetch } from "../../../utils/useFetch/useFetch";
import { Image } from "../../../components/common/Image";
import moment from "moment";

export const UserProfile = (props) => {
  const history = useHistory();
  const { userId } = useParams();

  const [authUser] = useGlobal("user");
  const [games] = useGlobal("games");

  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [isLoadingUnfollow, setIsLoadingUnfollow] = useState(false);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  const userGames = () => history.push(`/users/${authUser.id}/user-accounts`);

  const updatedProfile = () => history.push(`/users/${authUser.id}/edit`);

  const follow = async () => {
    try {
      setIsLoadingFollow(true);

      await postFollower();

      console.log("following");
    } catch (error) {
      handleError({ ...error, action: "follow" });
    } finally {
      setIsLoadingFollow(false);
    }
  };

  const postFollower = async () =>
    await ownFetch(urlApiUserFollowers(), "POST");

  const unfollow = async () => {
    try {
      setIsLoadingUnfollow(true);
      await deleteFollower();
      console.log("unfollowing");
    } catch (error) {
      handleError({ ...error, action: "unfollow" });
    } finally {
      setIsLoadingUnfollow(false);
    }
  };

  const deleteFollower = async () =>
    await ownFetch(urlApiUserFollowers(), "DELETE");

  const urlApiUserFollowers = () =>
    new UrlAssembler(`${config.serverUrl}`)
      .template("/followers")
      .query({
        userId: userId,
        followerUserId: authUser.id,
      })
      .toString();

  const inviteToPlay = () =>
    history.push(
      `/games/${games[0].id}/consoles/${games[0].consoleIds[0]}/challenges/new/users/${userId}`
    );

  const goToFollowers = () =>
    history.push({
      hash: "#right-menu",
      search: "?tab=followers",
    });

  const goToFollowings = () =>
    history.push({
      hash: "#right-menu",
      search: "?tab=followings",
    });

  const winRatio = () => {
    const matchesTotal = get(props.user, "matchesTotal", 0);
    const wonMatches = get(props.user, "wonMatches", 0);
    const loseMatches =
      matchesTotal - wonMatches <= 0 ? 1 : matchesTotal - wonMatches;

    return (wonMatches / loseMatches).toFixed(2);
  };

  return (
    <Container>
      <div className="back-container">
        <BackButton />
      </div>
      <div className="header">
        <div className="user-name">
          <Image
            borderRadius="50%"
            src={
              props.user.profileImageUrlThumb
                ? props.user.profileImageUrlThumb
                : `${config.storageUrl}/resources/perfil-icon.svg`
            }
            height="50px"
            width="50px"
            margin="0"
            size="cover"
          />
          <h3>{get(props, "user.nickname", "")}</h3>
        </div>
        <div className="follow-container">
          <div className="followers" onClick={() => goToFollowers()}>
            <span className="green">{props.user.followersAmount}</span>
            <span>Seguidores</span>
          </div>
          <div className="following" onClick={() => goToFollowings()}>
            <span className="green">{props.user.followingsAmount}</span>
            <span>Siguiendo</span>
          </div>
        </div>
      </div>

      <div className="active-container">
        <div className="last-session">
          <span>Último inicio de sesión:</span>
          <span>
            {moment(get(props, "user.updateAt", new Date()).toDate()).format(
              "DD-MM-YYYY"
            )}
          </span>
        </div>
        <div className="member-since">
          <span>Miembro desde:</span>
          <span>
            {moment(get(props, "user.createAt", new Date()).toDate()).format(
              "DD-MM-YYYY"
            )}
          </span>
        </div>
      </div>

      <div className="profile-statistics">
        <div className="win-matches">
          <span className="green">{get(props, "user.wonMatches", 0)}</span>
          <span>W</span>
        </div>
        <div className="lose-matches">
          <span className="green">
            {get(props, "user.matchesTotal", 0) -
              get(props, "user.wonMatches", 0)}
          </span>
          <span>L</span>
        </div>
        <div className="ratio-matches">
          <span className="green">{winRatio()}</span>
          <span>Ratio</span>
        </div>
      </div>

      <div className="favorite-game">
        <div className="game">
          <span>Juego preferido:</span>
          <span className="action">
            {isEmpty(get(props, "user.favoriteGameIds", []))
              ? "Sin Juegos Favoritos"
              : get(
                  games.find(
                    (game) =>
                      game.id === get(props, "user.favoriteGameIds[0]", "")
                  ),
                  "name",
                  ""
                ).toUpperCase()}
          </span>
        </div>
      </div>

      <div className="buttons-container">
        <ButtonBombo
          margin="0"
          background={"transparent"}
          border={`1px solid ${
            props.isOwnProfile
              ? darkTheme.basic.primary
              : darkTheme.basic.action
          }`}
          color={
            props.isOwnProfile
              ? darkTheme.basic.primary
              : darkTheme.basic.action
          }
          bgColorEvents={
            props.isOwnProfile
              ? darkTheme.basic.primary
              : darkTheme.basic.action
          }
          colorEvents={darkTheme.basic.blackDarken}
          onClick={() =>
            props.isOwnProfile
              ? updatedProfile()
              : !isEmpty(props.following)
              ? unfollow()
              : follow()
          }
          loading={isLoadingUnfollow || isLoadingFollow}
          disabled={isLoadingUnfollow || isLoadingFollow}
        >
          {props.isOwnProfile
            ? "Editar Perfil"
            : !isEmpty(props.following)
            ? "Dejar de Seguir"
            : "Seguir"}
        </ButtonBombo>
        <ButtonBombo
          background={
            props.isOwnProfile ? "transparent" : darkTheme.basic.primary
          }
          border={`1px solid ${
            props.isOwnProfile
              ? darkTheme.basic.primary
              : darkTheme.basic.primary
          }`}
          color={
            props.isOwnProfile
              ? darkTheme.basic.primary
              : darkTheme.basic.blackLighten
          }
          bgColorEvents={darkTheme.basic.primary}
          colorEvents={darkTheme.basic.blackDarken}
          margin="0.5rem 0"
          width="100%"
          onClick={() => (props.isOwnProfile ? userGames() : inviteToPlay())}
        >
          {props.isOwnProfile ? "IDs de Juegos" : "Invitar a jugar"}
        </ButtonBombo>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .back-container {
    padding: 0.5rem;
  }

  .header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    border-bottom: 0.3px solid ${(props) => props.theme.basic.whiteDarken};

    .user-name {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0.5rem 1rem;
      h3 {
        margin-left: 10px !important;
        font-weight: bold;
        font-size: 14px;
        line-height: 17px;
        color: ${(props) => props.theme.basic.white};
      }
    }

    .follow-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;

      .followers,
      .following {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        span {
          font-size: 12px;
          line-height: 15px;
          color: ${(props) => props.theme.basic.white};
        }
        .green {
          color: ${(props) => props.theme.basic.primary};
        }
      }
    }
  }

  .active-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    border-bottom: 0.3px solid ${(props) => props.theme.basic.whiteDarken};

    .member-since,
    .last-session {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      padding: 1rem;
      span {
        font-size: 12px;
        line-height: 15px;
        color: ${(props) => props.theme.basic.white};
      }
    }
  }

  .profile-statistics {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    justify-content: center;
    align-items: center;
    border-bottom: 0.3px solid ${(props) => props.theme.basic.whiteDarken};

    .win-matches,
    .lose-matches,
    .ratio-matches {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      padding: 1rem;
      span {
        font-size: 12px;
        line-height: 15px;
        color: ${(props) => props.theme.basic.white};
      }
      .green {
        color: ${(props) => props.theme.basic.primary};
      }
    }
  }

  .favorite-game {
    border-bottom: 0.3px solid ${(props) => props.theme.basic.whiteDarken};
    display: flex;
    justify-content: space-between;

    .game {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 1rem;
      span {
        padding-left: 10px;
        font-size: 12px;
        line-height: 15px;
        color: ${(props) => props.theme.basic.white};
      }
      .green {
        color: ${(props) => props.theme.basic.primary};
      }
      .action {
        color: ${(props) => props.theme.basic.action};
      }
    }
  }

  .buttons-container {
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }
`;
