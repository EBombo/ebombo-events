import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { firestore } from "../../../firebase";
import { useHistory, useParams } from "react-router";
import { snapshotToArray } from "../../../utils";
import { Desktop, Tablet } from "../../../styles/utils";
import { UserProfile } from "./Profile";
import { BackButton, Game, MatchesHistory } from "../../../components";
import { Button as ButtonAntd } from "antd";
import {
  btnPrimary,
  fontWeightFont,
  mediaQuery,
} from "../../../styles/constants";
import defaultTo from "lodash/defaultTo";

export const User = (props) => {
  const history = useHistory();
  const { userId } = useParams();

  const [authUser] = useGlobal("user");
  const [games] = useGlobal("games");

  const [gameId, setGameId] = useState("");
  const [user, setUser] = useState({});
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [following, setFollowing] = useState({});
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(true);
  const [game, setGame] = useState("");
  const [favoriteGames, setFavoriteGames] = useState([]);

  const isOwnProfile = userId === authUser.id;

  useEffect(() => {
    if (!user) return;
    const favoriteGames_ = games.filter((game) =>
      defaultTo(user.favoriteGameIds, []).includes(game.id)
    );

    setFavoriteGames(favoriteGames_);
  }, [user]);

  useEffect(() => {
    const unsubscribeUser = fetchUser();
    const unsubscribeFollowing = fetchFollowing();

    return () => {
      unsubscribeFollowing();
      unsubscribeUser();
    };
  }, [userId]);

  const fetchUser = () =>
    firestore
      .collection("users")
      .doc(userId)
      .onSnapshot((userSnapshot) => {
        if (!userSnapshot.exists) return history.push("/vs");

        setUser(userSnapshot.data());
        setIsLoadingUser(false);
      });

  const fetchFollowing = () =>
    firestore
      .collection("followers")
      .where("user.id", "==", userId)
      .where("followerUser.id", "==", authUser.id)
      .onSnapshot((followersQuerySnapShot) => {
        setFollowing(snapshotToArray(followersQuerySnapShot));

        setIsLoadingFollowing(false);
      });

  const hiddenMatchesHistory = () => {
    setGameId("");
    setGame("");
  };

  const showMatchesHistory = (game) => {
    setGameId(game.id);
    setGame(game);
  };

  const isActiveGame = (game) => gameId === game.id;

  const inviteToPlay = () =>
    history.push(
      `/games/${games[0].id}/consoles/${games[0].consoleIds[0]}/challenges/new/users/${user.id}`
    );

  if (isLoadingUser || isLoadingFollowing) return null;

  return (
    <ProfileContainer>
      <div className="left-content">
        <div className="profile-content">
          <UserProfile
            isOwnProfile={isOwnProfile}
            user={user}
            following={following}
          />
        </div>
        <Desktop>
          <div className="divider">
            <VerticalLine />
          </div>
        </Desktop>
        <div className="games-content">
          <div className="games">
            <div className="title">Juegos</div>
            {favoriteGames.map((game) => (
              <div key={game.id}>
                <Game
                  game={game}
                  user={user}
                  button={{
                    content: isActiveGame(game)
                      ? "Ocultar partidas"
                      : "Ver partidas",
                    onClick: () =>
                      isActiveGame(game)
                        ? hiddenMatchesHistory()
                        : showMatchesHistory(game),
                  }}
                />
                {isActiveGame(game) && (
                  <MatchesHistory gameId={game.id} user={user} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="right-content" />
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 80% 20%;
  }

  .right-content {
    background: ${(props) => props.theme.basic.blackDarken};
  }

  .left-content {
    ${mediaQuery.afterTablet} {
      display: grid;
      grid-template-columns: 4fr 1fr 4fr;
    }

    .divider {
      display: flex;
      justify-content: center;
      position: relative;
    }

    .games-content {
      ${mediaQuery.afterTablet} {
        padding: 2rem;
      }

      .title {
        font-size: 12px;
        line-height: 15px;
        color: ${(props) => props.theme.basic.white};
        margin: 1rem 0;
        font-weight: bold;
        padding-left: 1rem;

        ${mediaQuery.afterTablet} {
          padding-left: 0;
          font-size: 14px;
          line-height: 17px;
        }
      }
    }
  }
`;

const VerticalLine = styled.div`
  width: 0.3px;
  height: 60vh;
  position: absolute;
  top: 2rem;
  background: ${(props) => props.theme.basic.whiteDarken};
`;

const WrapperBackButton = styled.div`
  padding: 1.5rem 1rem;
`;

const ContainerDesktop = styled.div`
  margin: 2rem auto;
  color: ${(props) => props.theme.basic.primary};
  width: 65%;
  min-width: 875px;

  .games {
    margin: 1rem 0;
    display: grid;
    grid-gap: 1rem;
  }
`;

const ContainerMobile = styled.div`
  color: ${(props) => props.theme.basic.primary};
  text-align: center;

  h1 {
    font-size: 19px;
    font-weight: bold;
  }

  h2 {
    font-size: 15px;
    font-weight: 600;
    color: ${(props) => props.theme.basic.white};
    margin-top: 2rem;
    margin-bottom: 0.5rem;
  }

  .wrapper-back-button {
    padding: 1.25rem 1.25rem;
  }
`;

const Button = styled(ButtonAntd)`
    ${fontWeightFont(700)};
    ${btnPrimary("12px", 500, "0.8rem 0.8rem 0.8rem auto", "auto", "100%")};
    padding: 0.5rem 1.8rem;
    border-radius: 10px;
    border: 1px solid ${(props) =>
      props.type === "action"
        ? props.theme.basic.action
        : props.theme.basic.primary};
    background: ${(props) => props.theme.basic.blackDarken};
    color: ${(props) =>
      props.type === "action"
        ? props.theme.basic.action
        : props.theme.basic.primary};
    
    &:hover,  &:focus{
        background: ${(props) => props.theme.basic.blackDarken};
        border: 1px solid ${(props) =>
          props.type === "action"
            ? props.theme.basic.action
            : props.theme.basic.primary};
        color: ${(props) =>
          props.type === "action"
            ? props.theme.basic.action
            : props.theme.basic.primary};
    }
    
    &:disabled, &:disabled:hover {
        background: ${(props) => props.theme.basic.blackDarken};
        border: 1px solid ${(props) => props.theme.basic.default};
        color: ${(props) => props.theme.basic.default};
`;
