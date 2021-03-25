import React, {useEffect, useState} from "reactn";
import {useHistory, useParams} from "react-router";
import styled from "styled-components";
import {centerFlexBox, mediaQuery} from "../../../../styles/constants";
import {config, firestore} from "../../../../firebase";
import {SpinLoader} from "../../../../styles";
import {spinLoader} from "../../../../utils";
import {Divider, Modal} from "antd";
import {ValidateAccount} from "../../users/_userId/ValidateAccount";

export const AdminDocument = () => {
  const history = useHistory();
  const { documentId } = useParams();

  const [user, setUser] = useState({});
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      setIsLoadingUser(true);

      await fetchUser();
    } catch (error) {
      console.error("Fetch user", error);

      history.goBack();
    } finally {
      setIsLoadingUser(false);
    }
  };

  const fetchUser = async () => {
    await firestore
      .collection("users")
      .doc(documentId)
      .onSnapshot((userSnapshot) => {
        if (userSnapshot.exists) {
          setUser(userSnapshot.data());
        } else {
          throw new Error("User no exists");
        }
      });
  };

  if (isLoadingUser) return <SpinLoader>{spinLoader()}</SpinLoader>;

  return (
    <ContainerDocument>
      <h2 className="title-information-user">Documento</h2>
      <Divider />
      <ContainerItem verifiedDocument={user.verifiedDocument}>
        <section className="section-left">
          <ValidateAccount user={user} isVisibleImageDocument={false} />
        </section>
        <section className="section-right">
          <div className="item-img-document">
            {user.documentImageUrl ? (
              <img
                src={user.documentImageUrl}
                alt="Image document"
                onClick={() => setIsVisibleModal(true)}
              />
            ) : (
              <img
                src={`${config.storageUrgl}/resources/img-no-found.png`}
                alt="Image document"
              />
            )}
          </div>
        </section>
      </ContainerItem>

      <ContainerModal
        visible={isVisibleModal}
        onCancel={() => setIsVisibleModal(false)}
      >
        <img
          src={user.documentImageUrl}
          alt="Image document"
          onClick={() => setIsVisibleModal(true)}
        />
      </ContainerModal>
    </ContainerDocument>
  );
};

const ContainerDocument = styled.section`
  width: 100%;
`;

const ContainerItem = styled.section`
  display: grid;
  grid-template-columns: 100%;
  ${mediaQuery.afterTablet} {
    grid-template-columns: 50% 50%;
  }
  .section-left {
    padding: 10px;

    .item-user-name {
      font-size: 1rem;
      margin: 0 0 1rem 0;
      .item {
        padding: 5px;
      }
    }

    .item-state-document {
      display: flex;
      justify-content: flex-start;
      .state-document {
        width: auto;
        background: ${(props) =>
          props.verifiedDocument
            ? `${props.theme.basic.primary}CC`
            : props.theme.colorRed.lighten_3};
        color: rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(0, 0, 0, 0.3);
        border-radius: 20px;
        padding: 2px 9px;
        font-size: 0.7rem;
        font-weight: bold;
      }
    }
    .item-buttons {
      padding: 1.3rem 0;
      button {
        margin: 5px;
      }
    }
  }
  .section-right {
    padding: 10px;
    ${centerFlexBox};
    .item-img-document {
      border-radius: 5px;
      border: 1px solid ${(props) => props.theme.colorBlack.lighten_3};
      padding: 3px;
      img {
        width: 100%;
        height: auto;
        max-width: 100%;
        cursor: pointer;
      }
    }
  }
`;

const ContainerModal = styled(Modal)`
  width: 90% !important;
  .ant-modal-content {
    .ant-modal-body {
      background: ${(props) => props.theme.colorBlack.lighten_3};
      color: ${(props) => props.theme.basic.white};
      img {
        width: 100%;
        height: auto;
        max-width: 100%;
      }
    }

    .ant-modal-close-x {
      color: ${(props) => props.theme.basic.primary};
    }
    .ant-modal-footer {
      display: none;
    }
  }
`;
