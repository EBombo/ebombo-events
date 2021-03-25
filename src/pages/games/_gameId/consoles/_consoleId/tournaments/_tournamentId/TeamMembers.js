import React from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { mediaQuery } from "../../../../../../../styles/constants";
import { UserImageProfile } from "../../../../../../../components/users/UserImageProfile";
import {
  BackButton,
  ButtonBombo,
} from "../../../../../../../components/common";
import { useHistory } from "react-router";
import { config } from "../../../../../../../firebase";
import { Image } from "../../../../../../../components/common/Image";
import { Anchor } from "../../../../../../../components/common/Anchor";

export const TeamMembers = (props) => {
  const history = useHistory();

  return (
    <Container>
      <div className="team-info">
        <Image
          src={
            props.tournamentTeam.teamImageUrlThumb
              ? props.tournamentTeam.teamImageUrlThumb
              : `${config.storageUrl}/resources/teams-default.svg`
          }
          size={props.tournamentTeam.teamImageUrlThumb ? "cover" : "contain"}
          width="53px"
          height="53px"
          margin="0"
          borderRadius={props.tournamentTeam.teamImageUrlThumb ? "50%" : "0"}
        />
        <h1>{get(props, "tournamentTeam.name", "-")}</h1>
      </div>
      <TeamMembersContainer>
        <div className="subtitle">Miembros</div>
        <UserResults>
          {props.tournamentTeam.players.map((user, index) => (
            <UserResult key={user.id}>
              <div className="user-info">
                <Image
                  src={
                    user.profileImageUrlThumb
                      ? user.profileImageUrlThumb
                      : `${config.storageUrl}/resources/perfil-icon.svg`
                  }
                  size={user.profileImageUrlThumb ? "cover" : "contain"}
                  width="30px"
                  height="30px"
                  margin="0"
                  borderRadius="50%"
                />
                <div className="name">
                  {user.nickname}
                  {!user.lastName && <span>ID no registrado en ebombo</span>}
                </div>
              </div>
              {user.lastName && (
                <Anchor
                  type="primary"
                  onClick={() => history.push(`/users/${user.id}`)}
                >
                  Ver perfil
                </Anchor>
              )}
            </UserResult>
          ))}
        </UserResults>
      </TeamMembersContainer>
    </Container>
  );
};

const Container = styled.div`
  padding: 0.5rem 1rem;
  .team-info {
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${(props) => props.theme.basic.grayDarken};
    padding: 1rem;

    h1 {
      font-weight: 600;
      font-size: 20px;
      line-height: 25px;
      margin-left: 10px !important;
      color: ${(props) => props.theme.basic.white};
    }
  }
`;

const TeamMembersContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  padding: 1.25rem 1.5rem;
  .subtitle {
    font-size: 15px;
    line-height: 19px;
    color: ${(props) => props.theme.basic.primary};
  }
`;

const UserResults = styled.div``;

const UserResult = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;

  .user-info {
    display: flex;
    align-items: center;
    .name {
      display: flex;
      flex-direction: column;
      margin-left: 5px;
      font-size: 12px;
      line-height: 15px;
      color: ${(props) => props.theme.basic.white};
      span{
        font-size: 7px;
        line-height: 9px;
        color: ${(props) => props.theme.basic.whiteDarken};
      }
    }
  }
`;
