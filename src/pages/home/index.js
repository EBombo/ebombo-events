import React, { useEffect, useGlobal, useRef, useState } from "reactn";
import styled from "styled-components";
import { HeaderLanding } from "./HeaderLanding";
import { firestore } from "../../firebase";
//import { HeldEvents } from "./HeldEvents";
import { Comments } from "./comments/Comments";
import { ContactForm } from "./ContactForm";
import { spinLoader } from "../../components/common/loader";
import { useRouter } from "next/router";
import { Plans } from "../subscriptions/Plans";
import { Products } from "./Products";
import { timeoutPromise } from "../../utils/promised";

export const Home = (props) => {
  const router = useRouter();

  const [authUser] = useGlobal("user");

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const aboutRef = useRef(null);
  const contactRef = useRef(null);

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

  // TODO: Find a better way to scroll.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initialize = async () => {
      await timeoutPromise(500);
      const hash = window.location.hash;

      if (hash?.includes("about")) return aboutRef.current?.scrollIntoView();
      if (hash?.includes("contact")) return contactRef.current?.scrollIntoView();
    };
    initialize();
  }, []);

  const deleteDocument = async (document, collection) => {
    await firestore.collection(`settings/landing/${collection}`).doc(document.id).delete();
  };

  // TODO: If the data is static consider remove spin [it can be better to SEO].
  // TODO: If the spin is necessary then consider optimize load with localStorage.
  if (loading) return spinLoader();

  return (
    <LandingContainer>
      <div className="landing-container">
        <HeaderLanding />

        <Products />

        <Plans {...props} />

        {/*
        <HeldEvents />
        */}
        {/*<OurGames />*/}

        <section id="about" ref={aboutRef}>
          <Comments comments={comments} deleteDocument={deleteDocument} />
        </section>

        <section id="contact" ref={contactRef}>
          <ContactForm />
        </section>
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
