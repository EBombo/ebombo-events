import React from "reactn";
import { useParams } from "react-router-dom";
import { Chat } from "../../components/chat/Chat";
import { Games, WhiteSpace } from "../../components";
import { useHistory } from "react-router";

export const MobileChat = (props) => {
  const history = useHistory();
  const { gameId } = useParams();

  const onClickGame = (game) => history.push(`/games/${game.id}/chat`);

  return (
    <div>
      <Games onClick={onClickGame} />
      <WhiteSpace />
      <Chat key={gameId} chatId={gameId} showGames />
    </div>
  );
};
