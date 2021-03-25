import React, {useEffect, useGlobal, useRef, useState} from "reactn";
import styled from "styled-components";
import moment from "moment";
import {useHistory} from "react-router";
import {config, firestore} from "../../firebase";
import {snapshotToArray, spinLoader} from "../../utils";
import UrlAssembler from "url-assembler";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import {SpinLoader} from "../../styles";
import {ButtonBombo, Levels} from "../index";
import Linkify from "react-linkify";
import {darkTheme} from "../../styles/theme";
import {collectionToDate, useChats} from "../../hoc/useLocalStorageState";
import {mediaQuery} from "../../styles/constants";
import {useErrorHandler} from "react-error-boundary";
import {useOwnFetch} from "../../utils/useFetch/useFetch";

export const Chat = (props) => {
  const history = useHistory();

  const [globalUser] = useGlobal("user");
  const [games] = useGlobal("games");

  const chatRef = useRef(null);

  const [message, setMessage] = useState("");
  const [selectedGame, setSelectedGame] = useState(
    get(props, "selectedGame", null)
  );
  const [chatId, setChatId] = useState(get(props, "chatId", "public"));
  const [chat, setChat] = useState([]);
  const [isLoadingChat, setIsLoadingChat] = useState(true);
  const [isLoadingSendMessage, setIsLoadingSendMessage] = useState(false);
  const [chats, setChatsLocalStorage] = useChats();

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  useEffect(() => {
    const currentChat = chats.find((chat_) => chat_.id === chatId);
    if (currentChat) {
      setChat(get(collectionToDate(currentChat), "chats", []));
      setIsLoadingChat(false);
    }
    const unsubscribeChat = fetchChat(chatId);
    return () => unsubscribeChat();
  }, [chatId]);

  useEffect(() => {
    if (isEmpty(selectedGame)) return;
    setIsLoadingChat(true);
    setChatId(selectedGame.id);
  }, [selectedGame]);

  useEffect(() => {
    setTimeout(scrollToBottom, 200);
  }, [chat]);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current
        ? chatRef.current.scrollHeight
        : null;
    }
  };

  const fetchChat = (chatId_) =>
    firestore
      .collection("chats")
      .doc(chatId_)
      .collection("messages")
      .orderBy("createAt", "desc")
      .limit(30)
      .onSnapshot((snapshot) => {
        const allChats = snapshotToArray(snapshot);
        setChat(allChats);
        setIsLoadingChat(false);
        setChatsLocalStorage([
          ...chats.filter((chat_) => chat_.id !== chatId_),
          { id: chatId_, chats: snapshotToArray(snapshot) },
        ]);
      });

  const sendMessage = async (event) => {
    event.preventDefault();

    try {
      setIsLoadingSendMessage(true);

      await ownFetch(urlApiChatMessage(), "POST", bodyChatMessage());

      setMessage("");
    } catch (error) {
      handleError({ ...error, action: "sendMessage" });
    }
    setIsLoadingSendMessage(false);
  };

  const urlApiChatMessage = () =>
    new UrlAssembler(`${config.serverUrl}`)
      .template("/chats/:chatId/messages")
      .param({
        chatId: chatId,
      })
      .toString();

  const bodyChatMessage = () => ({
    content: message,
    userId: globalUser.id,
  });

  const messages = () => orderBy(chat, ["createAt"], ["asc"]);

  return (
    <Container>
      {props.showGames ? (
        <>
          <div className="title" key={`key-title1-${chatId}`}>
            Chat
            <span className="no-wrap">
              {get(
                games.find((game) => game.id === chatId),
                "name",
                " del juego"
              )}
            </span>
          </div>
        </>
      ) : (
        <div className="title" key={`key-title1-${chatId}`}>
          CHAT
          {props.tournament ? (
            <span className="no-wrap">{props.tournament.name}</span>
          ) : (
            <span>DEL DESAFIO</span>
          )}
        </div>
      )}
      <Content>
        <div className="chat-body" ref={chatRef}>
          {isLoadingChat ? (
            <SpinLoader>{spinLoader()}</SpinLoader>
          ) : isEmpty(chat) ? (
            <div className="chat-empty">Comienza a chatear</div>
          ) : (
            messages().map((message, index) => (
              <Messages
                isOwn={message.user.id === get(globalUser, "id", "")}
                key={message.id}
              >
                {get(messages()[index - 1], "user.id") !== message.user.id && (
                  <div className="space" />
                )}
                <div className="user-info">
                  {(index === 0 ||
                    messages()[index - 1].user.id !== message.user.id) && (
                    <>
                      <Nickname
                        isOwn={message.user.id === get(globalUser, "id", "")}
                        className="pre-wrap"
                      >
                        {message.user.id !== get(globalUser, "id") &&
                          !get(message, "user.isAdmin", false) && (
                            <ButtonBombo
                              fontWeight="9"
                              borderRadius="3px"
                              type="secondary"
                              padding="1px 5px"
                              border={`1px solid ${darkTheme.basic.primary} !important`}
                              bgColorEvents={darkTheme.basic.black}
                              colorEvents={darkTheme.basic.primary}
                              color={darkTheme.basic.primary}
                              bgColorBefore={true}
                              margin={"3px 5px"}
                              lineHeight={"auto"}
                              fontSize={"8px"}
                              onClick={() =>
                                history.push(
                                  `/games/${games[0].id}/consoles/${games[0].consoleIds[0]}/challenges/new/users/${message.user.id}`
                                )
                              }
                            >
                              Invitar
                            </ButtonBombo>
                          )}
                        <div
                          className="no-wrap"
                          onClick={() =>
                            history.push(`/users/${message.user.id}`)
                          }
                        >
                          {message.user.nickname.replace(" ", "").trim()}
                          {get(message, "user.isAdmin", false) && (
                            <span className="admin">[admin]</span>
                          )}
                        </div>
                      </Nickname>
                      <Levels
                        gamesStatistics={get(
                          message,
                          "user.gamesStatistics",
                          []
                        )}
                        gameId={chatId}
                        key={chatId}
                      />
                    </>
                  )}
                </div>

                <div className="message">
                  <div className="item-message">
                    <Linkify>{message.content}</Linkify>
                  </div>
                  <div className="time">
                    {moment(message.createAt.toDate()).format("hh:mma")}
                  </div>
                </div>
              </Messages>
            ))
          )}
        </div>
      </Content>
      <div className="footer">
        {isEmpty(globalUser) ? (
          <div className="alert-message">
            Se necesita iniciar sesión para usar el chat
          </div>
        ) : (
          <form className="send-message" onSubmit={sendMessage}>
            <input
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="input-message"
              required
            />
            <ButtonBombo
              disabled={isLoadingSendMessage}
              htmlType="submit"
              borderRadius="50%"
              margin="0 10px"
              padding="0"
              width="20px"
              height="20px"
            >
              <img
                src={`${config.storageUrl}/resources/chat-send.svg`}
                alt="send"
              />
            </ButtonBombo>
          </form>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  background: ${(props) => props.theme.basic.blackLighten};

  ${mediaQuery.afterTablet} {
    background: transparent;
  }

  .chat-info {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;

    div:first-child {
      width: auto;
      color: ${(props) => props.theme.basic.primary};
    }

    div:nth-child(2n) {
      width: auto;
      color: ${(props) => props.theme.basic.white};
    }
  }

  .information {
    font-weight: bold;
    font-size: 0.8rem;
    color: ${(props) => props.theme.basic.action};
    margin-bottom: 0.5rem;
  }

  .title {
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.basic.primary};
    font-weight: bold;
    font-size: 17px;
    line-height: 20px;
    padding: 1rem;
    border-bottom: 2px solid ${(props) => props.theme.basic.primaryDark};

    span {
      font-size: 17px;
      line-height: 20px;
      margin-left: 5px;
    }

    .sub-title {
      font-size: 10px;
      color: ${(props) => props.theme.basic.action};
    }
  }

  .footer {
    padding: 0.5rem;
    border-bottom: 2px solid ${(props) => props.theme.basic.primaryDark};
    width: 100%;

    input {
      color: ${(props) => props.theme.basic.white};
    }

    .alert-message {
      text-align: center;
      color: ${(props) => props.theme.basic.action};
    }

    .send-message {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      justify-content: center;

      .input-message {
        background: transparent;
        border: none;
        padding: 6px 10px;
        font-size: 0.7rem;

        ::placeholder {
          color: ${(props) => "#F3F1F2"};
        }
      }
    }
  }
`;

const Content = styled.div`
  color: ${(props) => props.theme.basic.white};
  padding: 0.5rem;
  border-bottom: 1px solid #afafaf;

  .chat-body {
    height: 400px;
    overflow-y: auto;
    scroll-behavior: smooth;

    ::-webkit-scrollbar-track {
      background: ${(props) => props.theme.basic.default};
    }

    ::-webkit-scrollbar-thumb {
      background-color: ${(props) => props.theme.basic.primary};
    }

    ${mediaQuery.afterTablet} {
      height: 75vh;
    }

    .chat-empty {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      text-align: center;
      font-weight: 500;
      font-size: 1rem;
    }

    .helper {
      height: 400px;
      width: 100%;
      background: ${(props) => props.theme.basic.danger};
    }
  }
`;

const Messages = styled.div`
  width: 60%;

  ${(props) => (props.isOwn ? "margin-left: 40%;" : "")}
  .time {
    font-size: 0.4rem;
    ${(props) => (props.isOwn ? "text-align: left;" : "text-align: right;")};
  }

  .space {
    margin-top: 10px;
  }

  .user-info {
    margin-top: 5px;
    display: grid;
    grid-template-columns: 70% auto;
    justify-content: space-between;
    ${(props) => (props.isOwn ? "direction: rtl;" : "")};

    div {
      display: flex;
      align-items: center;
    }

    div:first-child {
      ${(props) => (props.isOwn ? "text-align: right;" : "text-align: left;")};
    }

    div:nth-child(2n) {
      ${(props) => (props.isOwn ? "text-align: left;" : "text-align: right;")};
    }
  }

  .message {
    max-width: 100%;
    background: ${(props) => props.theme.basic.grayDarken};
    border-radius: 4px;
    display: grid;
    grid-template-columns: auto auto;

    .time {
      font-size: 8px;
      padding: 5px;
      color: ${(props) => props.theme.basic.grayDark};
      ${(props) => props.isOwn && "grid-row: 1;"}
    }

    .item-message {
      color: ${(props) => props.theme.basic.white};
      text-align: justify;
      ${(props) => (props.isOwn ? "text-align: end;" : "")};
      padding: 5px;
      font-weight: 500;
      width: 100%;
      position: relative;
      font-size: 11px;
      white-space: normal;
      word-break: break-all;
      hyphens: auto;
      ${(props) =>
        props.isOwn ? "margin-right: 0.5rem;" : "margin-left: 0.5rem;"}
    }
  }
`;

const Nickname = styled.div`
  cursor: pointer;
  font-weight: bold;
  font-size: 11px;
  color: ${(props) => props.theme.basic.primary};

  .admin {
    margin-left: 5px;
    margin-right: 5px;
  }
`;
