import { Image } from "../../../../../../../components/common/Image";
import { config } from "../../../../../../../firebase";
import get from "lodash/get";
import React from "reactn";

export const ListPlayersToRegister = (props) => (
  <>
    {(props.editTeam ? props.users : props.tournamentTeam.players).map(
      (player, index) => (
        <div className="member" key={`key-players-${player.id}`}>
          <div className="member-info">
            <Image
              size={player.profileImageUrlThumb ? "cover" : "contain"}
              src={
                player.profileImageUrlThumb
                  ? player.profileImageUrlThumb
                  : `${config.storageUrl}/resources/perfil-icon.svg`
              }
              borderRadius="50%"
              height="25px"
              width="25px"
              margin="0"
            />
            <div className="nickname no-wrap">{player.nickname}</div>
          </div>
          <div className="member-status">
            {get(
              props,
              "tournamentTeam.playerIdsAcceptInvitation",
              []
            ).includes(player.id) ? (
              index === 0 ? (
                <div className="captain">C</div>
              ) : (
                <img
                  src={`${config.storageUrl}/resources/circle-check.svg`}
                  alt=""
                />
              )
            ) : (
              <img
                src={`${config.storageUrl}/resources/circle-empty.svg`}
                alt=""
              />
            )}
            {props.editTeam &&
              get(props, "tournamentTeam.players[0].id", "-") !== player.id && (
                <img
                  className="remove"
                  src={`${config.storageUrl}/resources/close.svg`}
                  alt=""
                  onClick={() =>
                    props.setUsers(
                      props.users.filter((user) => user.id !== player.id)
                    )
                  }
                />
              )}
          </div>
        </div>
      )
    )}
  </>
);
