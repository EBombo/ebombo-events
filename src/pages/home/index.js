import React, { useEffect, useGlobal } from "reactn";
import { HeaderLanding } from "./HeaderLanding";
import { Comments } from "./comments/Comments";
import { Plans } from "../subscriptions/Plans";
import { ContactForm } from "./ContactForm";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Products } from "./Products";
import { OurGames } from "./OurGames";

export const Home = (props) => {
  const router = useRouter();

  const [authUser] = useGlobal("user");

  useEffect(() => {
    if (!authUser) return;

    router.push("/");
  }, [authUser]);

  return (
    <LandingContainer>
      <HeaderLanding />

      <Products />

      <Plans {...props} />

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
