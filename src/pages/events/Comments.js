import React, {useGlobal, useState} from "reactn";
import {lazy, Suspense} from "react";
import styled from "styled-components";
import {spinLoader} from "../../utils";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import {Icon} from "../../components/common/Icons";
import {config, firestore} from "../../firebase";
import {mediaQuery} from "../../styles/constants";
import {Image} from "../../components/common/Image";
import {Desktop, Tablet} from "../../styles/utils";
import {ButtonBombo} from "../../components";
import {ModalContainer} from "../../components/common/ModalContainer";

const EditComment = lazy(() => import("./EditComment"));

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
          <Suspense fallback={spinLoader()}>
            <EditComment
              setIsVisibleModal={setIsVisibleModal}
              isVisibleModal={isVisibleModal}
              currentComment={currentComment}
              {...props}
            />
          </Suspense>
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
                <div className="description">{comment.description}</div>
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
              <ButtonBombo
                type="action"
                onClick={() => {
                  setCurrentComment({
                    id: firestore.collection("events").doc().id,
                  });
                  setIsVisibleModal(true);
                }}
              >
                Añadir
              </ButtonBombo>
            )}
          </div>
        </div>
      </div>
    </CommentsContainer>
  );
};

const CommentsContainer = styled.section`
  width: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  background-image: url(${config.storageUrl + "/resources/b2bLanding/8.png"});
  padding: 1rem;
  margin: 0 auto;

  .main-container {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    .title {
      font-weight: bold;
      font-size: 15px;
      line-height: 19px;
      text-align: center;
      color: ${(props) => props.theme.basic.white};
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
        align-items: center;
        justify-content: center;
        margin: 1rem 0;
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
        color: ${(props) => props.theme.basic.white};
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
  width: 150px;
  margin: 1rem;
  position: relative;

  ${mediaQuery.afterTablet} {
    width: 250px;
  }

  .description {
    padding-top: 1rem;
    font-weight: normal;
    font-size: 12px;
    line-height: 15px;
    text-align: center;
    color: ${(props) => props.theme.basic.white};
    ${mediaQuery.afterTablet} {
      font-size: 18px;
      line-height: 22px;
    }
  }
`;
