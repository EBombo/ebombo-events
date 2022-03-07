import React, { useEffect, useGlobal } from "reactn";
import { HeaderLanding } from "./HeaderLanding";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Products } from "./Products";
import { EventsInformation } from "./EventsInformation";
import { EbomboStyle } from "./EbomboStyled";
import { Options } from "./Options";
import { Companies } from "./Companies";
import { BannerEbombo } from "./BannerEbombo";
import { Comments } from "./Comments";

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

      <Options {...props} />

      <Companies {...props} />

      <Comments {...props} />

      <BannerEbombo {...props} btnContact />
    </LandingContainer>
  );
};

const LandingContainer = styled.div`
  width: 100%;
  max-width: 100vw;
  font-family: Lato;
`;
