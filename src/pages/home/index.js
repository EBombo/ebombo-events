import React, { useEffect, useGlobal } from "reactn";
import { HeaderLanding } from "./HeaderLanding";
import { Comments } from "./comments/Comments";
import { ContactForm } from "./ContactForm";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Products } from "./Products";
import { EventsInformation } from "./EventsInformation";
import { EbomboStyle } from "./EbomboStyled";

export const Home = (props) => {
  const router = useRouter();

  const [authUser] = useGlobal("user");

  useEffect(() => {
    router.prefetch("/library");
  }, []);

  useEffect(() => {
    if (!authUser) return;

    router.push("/");
  }, [authUser]);

  return (
    <LandingContainer>
      <HeaderLanding />

      <Products />

      <EventsInformation {...props} />

      <EbomboStyle {...props} />

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
  font-family: Lato;
`;
