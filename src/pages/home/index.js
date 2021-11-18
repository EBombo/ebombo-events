import React, { useEffect, useGlobal } from "reactn";
import styled from "styled-components";
import { HeaderLanding } from "./HeaderLanding";
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

  useEffect(() => {
    if (!authUser || authUser.isAdmin) return;

    router.push("/");
  }, [authUser]);

  return (
    <LandingContainer>
      <HeaderLanding />

      <Products />

      <Plans {...props} />

      {/*<HeldEvents />*/}

      <OurGames />

      <Comments />

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
