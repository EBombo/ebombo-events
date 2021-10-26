import React, { useEffect, useGlobal, useRef, useState } from "reactn";
import styled from "styled-components";
import { HeaderLanding } from "../home/HeaderLanding";
import { firestore } from "../../firebase";
import get from "lodash/get";
import { spinLoader } from "../../components/common/loader";
import { Footer } from "../../components/Footer";
import { useRouter } from "next/router";
import { UseCases as UseCasesView } from "./UseCases";


const useCasesData = [
    {
        imageUrl: "https://via.placeholder.com/274/130",
        title: "Ripley Fest",
        date: "12 Ene 21",
    }
]

export const UseCases = (props) => {
//   const router = useRouter();
//   const [authUser] = useGlobal("user");
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);

  const servicesRef = useRef(null);
  const gamesRef = useRef(null);
  const eventsRef = useRef(null);
  const contactRef = useRef(null);

//   useEffect(() => {
//     if (!authUser || authUser.isAdmin) return;

//     router.push("/library");
//   }, [authUser]);

  useEffect(() => {
  }, []);

  const deleteElement = async (element, field) => {
    const newElements = get(events, `${field}`, []).filter(
      (ele) => ele.id !== element.id
    );

    await firestore.doc(`landings/events`).update({
      [field]: newElements,
    });
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
        <HeaderLanding executeScroll={executeScroll} />

        <UseCasesView useCases={useCasesData}/>

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

