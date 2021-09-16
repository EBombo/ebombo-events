import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import { Icon } from "../../components/common/Icons";
import { Image } from "../../components/common/Image";
import { ModalContainer } from "../../components/common/ModalContainer";
import { firestore } from "../../firebase";
import { mediaQuery } from "../../constants";
import { Desktop, Tablet } from "../../constants";
import { ButtonAnt } from "../../components/form";
import EditComment from "./EditComment";

export const Comments = (props) => {
  const [authUser] = useGlobal("user");
  const [currentComment, setCurrentComment] = useState(null);
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  return (
    <CommentsContainer>
      {isVisibleModal && get(authUser, "isAdmin") && (
        <ModalContainer
          footer={null}
          visible={isVisibleModal}
          onCancel={() => setIsVisibleModal(!isVisibleModal)}
        >
          <EditComment
            setIsVisibleModal={setIsVisibleModal}
            isVisibleModal={isVisibleModal}
            currentComment={currentComment}
            {...props}
          />
        </ModalContainer>
      )}
      <div className="main-container">
        <div className="title">COMENTARIOS</div>
        <div className="comments">
          <div className="comments-container">
            {defaultTo(get(props, "events.comments"), []).map((comment) => (
              <Comment
                backgroundImage={comment.backgroundImageUrl}
                key={comment.id}
              >
                <Desktop>
                  <Image
                    src={comment.imageUrl}
                    width="123px"
                    height="123px"
                    borderRadius="50%"
                    margin="0.5rem auto"
                    size="cover"
                  />
                </Desktop>
                <Tablet>
                  <Image
                    src={comment.imageUrl}
                    width="74px"
                    height="74px"
                    borderRadius="50%"
                    margin="0.5rem auto"
                    size="cover"
                  />
                </Tablet>
                <div className="description">
                  <strong> {comment.description.split("-")[0]} </strong>
                  <br />
                  {comment.description.split("-")[1]}
                </div>
                {get(authUser, "isAdmin") && (
                  <div className="container-edit">
                    <Icon
                      className="icon-edit"
                      type="edit"
                      onClick={() => {
                        setCurrentComment(comment);
                        setIsVisibleModal(true);
                      }}
                    />
                    <Icon
                      className="icon-delete"
                      type="delete"
                      onClick={() => {
                        props.deleteElement(comment, "comments");
                      }}
                    />
                  </div>
                )}
              </Comment>
            ))}
            {get(authUser, "isAdmin") && (
              <div className="btn-container">
                <ButtonAnt
                  variant="outlined"
                  color="warning"
                  onClick={() => {
                    setCurrentComment({
                      id: firestore.collection("events").doc().id,
                    });
                    setIsVisibleModal(true);
                  }}
                >
                  Añadir
                </ButtonAnt>
              </div>
            )}
          </div>
        </div>
      </div>
    </CommentsContainer>
  );
};

const CommentsContainer = styled.section`
  width: 100%;
  background: ${(props) => props.theme.basic.white};
  padding: 1rem;
  margin: 0 auto;

  .main-container {
    width: 100%;
    max-width: 1300px;
    margin: 0 auto;
    position: relative;
    z-index: 999;
    .title {
      font-weight: bold;
      font-size: 20px;
      line-height: 25px;
      text-align: center;
      color: ${(props) => props.theme.basic.black};
      margin-bottom: 1rem;
    }

    ${mediaQuery.afterTablet} {
      .title {
        font-size: 33px;
        line-height: 41px;
      }
    }

    .comments {
      max-width: 100%;
      overflow: auto;
      text-align: center;

      .comments-container {
        display: inline-flex;
        justify-content: center;
        margin: 1rem 0;
      }

      .btn-container {
        margin: 1rem;
      }

      ::-webkit-scrollbar {
        display: none;
      }
    }

    .container-edit {
      position: absolute;
      height: 15px;
      cursor: pointer;
      top: 0;
      right: -11px;

      svg {
        width: 15px;
        height: 15px;
        color: ${(props) => props.theme.basic.action};
      }

      .icon-delete {
        margin-left: 5px;

        svg {
          color: ${(props) => props.theme.basic.danger};
        }
      }
    }
  }
`;

const Comment = styled.div`
  width: 250px;
  margin: 1rem;
  position: relative;

  ${mediaQuery.afterTablet} {
    width: 250px;
  }

  .description {
    padding-top: 1rem;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
    color: ${(props) => props.theme.basic.black};

    ${mediaQuery.afterTablet} {
      font-size: 18px;
      line-height: 22px;
    }
  }
`;
