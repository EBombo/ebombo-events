import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { Icon } from "../../../components/common/Icons";
import { Image } from "../../../components/common/Image";
import { ModalContainer } from "../../../components/common/ModalContainer";
import { Modal } from "antd";
import { firestore } from "../../../firebase";
import { Desktop, mediaQuery, Tablet } from "../../../constants";
import { ButtonAnt } from "../../../components/form";
import EditComment from "./EditComment";
import { spinLoaderMin } from "../../../components/common/loader";

export const Comments = (props) => {
  const [authUser] = useGlobal("user");

  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);

  const [currentComment, setCurrentComment] = useState(null);
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  useEffect(() => {
    const fetchComments = () =>
      firestore.collection("settings/landing/comments").onSnapshot((snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()));
        setLoading(false);
      });

    fetchComments();
  }, []);

  if (loading) return spinLoaderMin();

  return (
    <CommentsContainer>
      {isVisibleModal && get(authUser, "isAdmin") && (
        <ModalContainer footer={null} visible={isVisibleModal} onCancel={() => setIsVisibleModal(!isVisibleModal)}>
          <EditComment
            setIsVisibleModal={setIsVisibleModal}
            isVisibleModal={isVisibleModal}
            currentComment={currentComment}
            {...props}
          />
        </ModalContainer>
      )}
      <div className="main-container">
        <div className="title">¡Únete a quienes ya han confiado en nosotros!</div>
        <div className="comments">
          <div className="comments-container">
            {(comments ?? []).map((comment) => (
              <Comment backgroundImage={comment.backgroundImageUrl} key={comment.id}>
                <div className="card-header">
                  <Desktop>
                    <Image
                      src={comment.imageUrl}
                      width="70px"
                      height="70px"
                      borderRadius="50%"
                      margin="0.5rem 0.5rem"
                      size="cover"
                      className="profile-photo"
                    />
                  </Desktop>
                  <Tablet>
                    <Image
                      src={comment.imageUrl}
                      width="51px"
                      height="51px"
                      borderRadius="50%"
                      margin="0.1 rem"
                      size="cover"
                      className="profile-photo"
                    />
                  </Tablet>
                  <div className="subject">
                    <h3>{comment.subjectName}</h3>
                    <h4>{comment.subjectJob}</h4>
                  </div>
                </div>
                <div className="description">{comment.description}</div>
                {get(comment, "logoUrl") && (
                  <div className="logo-container">
                    {/* TODO use <Image .../> */}
                    <img src={comment.logoUrl} height="32px" />
                  </div>
                )}
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
                        Modal.confirm({
                          title: "¿Seguro que quieres eliminar este item?",
                          content: "Una vez eliminado no se podrá revertir el cambio",
                          onOk: async () => {
                            await firestore.collection(`settings/landing/comments`).doc(comment.id).delete();
                          },
                          onCancel() {},
                        });
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
    margin: 0 auto;
    position: relative;
    z-index: 999;

    .title {
      font-family: Lato, sans-serif;
      font-weight: 700;
      font-size: 20px;
      line-height: 25px;
      text-align: center;
      color: ${(props) => props.theme.basic.primaryDark};
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
      top: 12px;
      right: 10px;

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
  margin: 1rem;
  position: relative;
  font-family: Lato, sans-serif;
  background: ${(props) => props.theme.basic.whiteLight};
  padding: 1rem 1.2rem 0.5rem;
  box-shadow: -4.63898px 3.31356px 19.8813px -1.32542px rgba(0, 0, 0, 0.14);
  border-radius: 0.4rem;

  .card-header {
    display: grid;
    grid-template-columns: min-content minmax(180px, 250px);

    ${mediaQuery.afterTablet} {
      grid-template-columns: min-content minmax(200px, 250px);
    }

    .profile-photo {
      align-self: center;
      display: inline-block;
      margin-right: 0.5rem;
    }
  }

  ${mediaQuery.afterTablet} {
    max-width: 400px;
    padding: 3rem 3rem 0.5rem;
    margin: 1rem 0.75rem;
  }

  .subject {
    text-align: left;

    h3,
    h4 {
      margin: 1px 0.25rem;
    }

    h3 {
      font-weight: 700;
      font-size: 0.85rem;

      ${mediaQuery.afterTablet} {
        font-size: 1.125rem;
        line-height: 1.25rem;
      }
    }

    h4 {
      font-weight: 400;
      font-size: 0.7rem;
      line-height: 0.875rem;

      ${mediaQuery.afterTablet} {
        font-size: 1rem;
        line-height: 1.25rem;
      }
    }
  }

  .logo-container {
    margin-bottom: 1rem;
  }

  .description {
    padding-top: 1rem;
    padding-bottom: 1.2rem;

    font-style: normal;
    font-weight: 400;
    font-size: 0.8rem;
    line-height: 16px;
    color: ${(props) => props.theme.basic.grayLight};

    ${mediaQuery.afterTablet} {
      font-size: 18px;
      line-height: 22px;
    }
  }
`;
