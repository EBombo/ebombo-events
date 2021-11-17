import React, { useEffect, useGlobal, useRef } from "reactn";
import styled from "styled-components";
import { HeaderLanding } from "./HeaderLanding";
//import { HeldEvents } from "./HeldEvents";
import { Comments } from "./comments/Comments";
import { ContactForm } from "./ContactForm";
import { useRouter } from "next/router";
import { Plans } from "../subscriptions/Plans";
import { Products } from "./Products";
import { timeoutPromise } from "../../utils/promised";

export const Home = (props) => {
  const router = useRouter();

  const [authUser] = useGlobal("user");

  const contactRef = useRef(null);

  useEffect(() => {
    if (!authUser || authUser.isAdmin) return;

    router.push("/library");
  }, [authUser]);

  // TODO: Find a better way to scroll.
  useEffect(() => {
    // Verify the window is necessary for Nextjs.
    if (typeof window === "undefined") return;

    const initialize = async () => {
      // It is necessary to wait for the render.
      await timeoutPromise(500);
      const hash = window.location.hash;

      if (hash?.includes("contact")) return contactRef.current?.scrollIntoView();
    };

    initialize();
  }, []);

  return (
    <LandingContainer>
      <div className="landing-container">
        <HeaderLanding />

        <Products />

        <Plans {...props} />

        {/*<HeldEvents />*/}

        {/*<OurGames />*/}

        <Comments />

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
