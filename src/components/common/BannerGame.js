import React from "react";
import {centerFlexBox} from "../../styles/constants";
import styled from "styled-components";

export const BannerGame = (props) => (
  <ContainerBannerGame
    image={props.image}
    isCenter={props.isCenter}
    isTournamentHome={props.isTournamentHome}
  />
);

const ContainerBannerGame = styled.section`
  width: 100%;
  height: ${(props) => (props.isTournamentHome ? "5rem" : "10rem")};
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-position: ${(props) => (props.isCenter ? "center" : "right")};
  ${centerFlexBox()};
  img {
    width: auto;
    height: 65%;
  }
`;
