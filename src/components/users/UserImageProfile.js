import React from "react";
import styled from "styled-components";
import {mediaQuery} from "../../styles/constants";

export const UserImageProfile = (props) => (
  <ImageProfileContainer onClick={props.onClick}>
    <Image
      src={props.url}
      isAdmin={props.isAdmin}
      size={props.size}
      borderRadius={props.borderRadius}
      bgSize={props.bgSize}
    />
  </ImageProfileContainer>
);

const ImageProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: auto;
`;

const Image = styled.div`
  border-radius: ${(props) =>
    props.borderRadius ? props.borderRadius : "50%"};
  background-image: url(${(props) => props.src});
  height: ${(props) => height(props.size)};
  width: ${(props) => width(props.size)};
  display: block;
  margin: ${(props) => margin(props.size)};
  cursor: pointer;
  object-fit: cover;
  border: ${(props) =>
    props.isAdmin ? `2.5px solid ${props.theme.basic.primary}` : "0px"};
  background-position: center;
  background-repeat: no-repeat;
  background-size: ${(props) => (props.bgSize ? props.bgSize : "cover")};
  position: relative;

  ${mediaQuery.afterTablet} {
    height: ${(props) =>
      props.afterTablet ? props.afterTablet : height(props.size)};
    width: ${(props) =>
      props.afterTablet ? props.afterTablet : width(props.size)};
  }
`;

const height = (size) => {
  switch (size) {
    case "medium":
      return "35px";
    case "medium-tournament":
      return "30px";
    case "big":
      return "45px";
    case "superBig":
      return "100px";
    case "profile":
      return "52px";
    case "league":
      return "40px";
    case "league-big":
      return "200px";
    default:
      return "25px";
  }
};

const width = (size) => {
  switch (size) {
    case "medium":
      return "35px";
    case "medium-tournament":
      return "30px";
    case "big":
      return "45px";
    case "superBig":
      return "100px";
    case "profile":
      return "52px";
    case "league":
      return "40px";
    case "league-big":
      return "200px";
    default:
      return "25px";
  }
};

const margin = (size) => {
  switch (size) {
    case "medium":
      return "5px auto";
    case "medium-tournament":
      return "5px auto";
    case "big":
      return "0.5rem auto";
    case "superBig":
      return "0";
    default:
      return "0px auto";
  }
};
