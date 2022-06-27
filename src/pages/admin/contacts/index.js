import React, { useEffect, useState } from "reactn";
import styled from "styled-components";
import { firestore } from "../../../firebase";
import { snapshotToArray } from "../../../utils";
import { spinLoaderMin } from "../../../components/common/loader";
import { Anchor } from "../../../components/form";
import { useRouter } from "next/router";
import moment from "moment";

const defaultLimit = 10;

export const Contacts = (props) => {
  const router = useRouter();

  const [limit, setLimit] = useState(defaultLimit);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLimit, setLoadingLimit] = useState(false);

  const fetchContacts = async () => {
    const querySnapshotContacts = await firestore.collection("contacts").orderBy("createAt", "desc").limit(limit).get();

    const contacts_ = snapshotToArray(querySnapshotContacts);
    setContacts(contacts_);
    setLoading(false);
    setLoadingLimit(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchContacts();
  }, []);

  useEffect(() => {
    setLoadingLimit(true);
    fetchContacts();
  }, [limit]);

  if (loading) return spinLoaderMin();

  return (
    <ContactsStyled>
      <div className="container">
        <Anchor variant="primary" onClick={() => router.back()}>
          Volver
        </Anchor>
        <div>Lista de registro de contactanos</div>

        <div className="contact-list">
          {contacts.map((contact) => (
            <div className="contact-item" key={contact.id}>
              <div>
                <b>Creado</b>: {moment(contact.createAt).format("LLL")}
              </div>
              <div>
                <b>Email</b>: {contact.email}
              </div>
              <div>
                <b>Mensaje</b>: {contact.message}
              </div>
              <div>
                <b>Interes</b>: {contact.interests}
              </div>
              <div>
                <b>Tlf</b>: {contact.phoneNumber}
              </div>
              {contact.isBdev ? <div className="is-bdev">Registrado por BDEV</div> : null}
            </div>
          ))}
        </div>

        <div>
          <Anchor
            variant="primary"
            margin="10px 0 10px 0"
            display="block"
            disabled={loading || loadingLimit || contacts?.length < limit}
            loading={loading || loadingLimit}
            onClick={() => {
              setLimit(limit + defaultLimit);
              setLoadingLimit(true);
            }}
          >
            Ver más
          </Anchor>
        </div>
      </div>
    </ContactsStyled>
  );
};

const ContactsStyled = styled.div`
  .container {
    margin: auto;
    padding: 10px;
    width: 100%;
    max-width: 400px;

    .contact-list {
      margin-top: 15px;

      .contact-item {
        padding: 15px;
        border-radius: 10px;
        border: 1px solid ${(props) => props.theme.basic.primary};

        .is-bdev {
          margin: auto;
          padding: 10px;
          width: max-content;
          border-radius: 5px;
          color: ${(props) => props.theme.basic.white};
          background: ${(props) => props.theme.basic.primary};
        }
      }
    }
  }
`;
