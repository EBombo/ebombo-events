import React, { useEffect, useGlobal, useRef, useState } from "reactn";
import styled from "styled-components";
import { HeaderLanding } from "./HeaderLanding";
import { firestore } from "../../firebase";
//import { HeldEvents } from "./HeldEvents";
import { Comments } from "./comments/Comments";
import { ContactForm } from "./ContactForm";
import { useRouter } from "next/router";
import { Plans } from "../subscriptions/Plans";
import { Products } from "./Products";
import { OurGames } from "./OurGames";

export const Home = (props) => {
  const router = useRouter();

  const [authUser] = useGlobal("user");

  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!authUser || authUser.isAdmin) return;

    router.push("/library");
  }, [authUser]);

  useEffect(() => {
    const fetchComments = () =>
      firestore.collection("settings/landing/comments").onSnapshot((snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()));
      });

    fetchComments();
  }, []);

  const deleteDocument = async (document, collection) => {
    await firestore.collection(`settings/landing/${collection}`).doc(document.id).delete();
  };

  return (
    <LandingContainer>
      <HeaderLanding />

      <Products />

      <Plans {...props} />

      {/*<HeldEvents />*/}

      <OurGames />

      <Comments comments={comments} deleteDocument={deleteDocument} />

      <section id="contact">
        <ContactForm />
      </section>
    </LandingContainer>
  );
};

const LandingContainer = styled.div`
  width: 100%;
  max-width: 100vw;
`;
