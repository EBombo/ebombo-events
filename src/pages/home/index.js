import React, { useEffect, useGlobal, useRef, useState } from "reactn";
import styled from "styled-components";
import { HeaderLanding } from "./HeaderLanding";
import { firestore } from "../../firebase";
import { HeldEvents } from "./HeldEvents";
import { Comments } from "./comments/Comments";
import { ContactForm } from "./ContactForm";
import { spinLoader } from "../../components/common/loader";
import { useRouter } from "next/router";
import { Plans } from "../subscriptions/Plans";
import { Products } from "./Products";

export const Home = (props) => {
  const router = useRouter();
  const [authUser] = useGlobal("user");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const servicesRef = useRef(null);
  const gamesRef = useRef(null);
  const eventsRef = useRef(null);
  const contactRef = useRef(null);
  const contactFormRef = useRef(null);

  useEffect(() => {
    if (!authUser || authUser.isAdmin) return;

    router.push("/library");
  }, [authUser]);

  useEffect(() => {
    const fetchComments = () =>
      firestore.collection("settings/landing/comments").onSnapshot((snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()));
        setLoading(false);
      });

    fetchComments();
  }, []);

  const deleteDocument = async (document, collection) => {
    await firestore.collection(`settings/landing/${collection}`).doc(document.id).delete();
  };

  const executeScroll = (section) =>
    section === "services"
      ? servicesRef.current.scrollIntoView()
      : section === "games"
      ? gamesRef.current.scrollIntoView()
      : section === "events"
      ? eventsRef.current.scrollIntoView()
      : contactRef.current.scrollIntoView();

  // TODO: If the data is static consider remove spin [it can be better to SEO].
  if (loading) return spinLoader();

  return (
    <LandingContainer>
      <div className="landing-container">
        <HeaderLanding executeScroll={executeScroll} />
        <Products />
        <Plans {...props} />
        <HeldEvents />
        <Comments comments={comments} deleteDocument={deleteDocument} />
        <ContactForm refProp={contactFormRef} />
      </div>
    </LandingContainer>
  );
};

const LandingContainer = styled.div`
  width: 100%;

  .landing-container {
    position: relative;
    z-index: 1;
  }
`;
