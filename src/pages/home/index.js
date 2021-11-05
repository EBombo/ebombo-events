import React, { useEffect, useGlobal, useRef, useState } from "reactn";
import styled from "styled-components";
import { HeaderLanding } from "./HeaderLanding";
import { firestore } from "../../firebase";
import { HeldEvents } from "./HeldEvents";
import { Comments } from "./comments/Comments";
import { Contact } from "./Contact";
import { ContactForm } from "./ContactForm";
import get from "lodash/get";
import { spinLoader } from "../../components/common/loader";
import { Footer } from "../../components/Footer";
import { useRouter } from "next/router";
import { Plans } from "./subscriptions/Plans";
import { Navbar } from "../../components/Navbar";
import { Products } from "./Products";

export const Home = (props) => {
  const router = useRouter();
  const [authUser] = useGlobal("user");
  const [events, setEvents] = useState(null);
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
    const fetchLandingEvents = () =>
      firestore
        .collection("landings")
        .doc("events")
        .onSnapshot((snapshot) => {
          setEvents(snapshot.data());
          setLoading(false);
        });

    fetchLandingEvents();
  }, []);

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

  if (loading) return spinLoader();

  return (
    <LandingContainer>
      <div className="landing-container">
        <Navbar executeScroll={executeScroll} />
        <HeaderLanding executeScroll={executeScroll} />
        <Products />
        <Plans {...props} />
        <HeldEvents />
        <Contact refProp={contactRef} />
        <Comments comments={comments} deleteDocument={deleteDocument} />
        <ContactForm refProp={contactFormRef} />
        <Footer />
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
