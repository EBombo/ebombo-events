import React from "react";
import styled from "styled-components";

export const CardAdvertising = (props) => (
  <ContainerCardAdvertising {...props}>
    {props.backgroundImage && (
      <img src={props.backgroundImage} alt="eBombo ads" />
    )}
  </ContainerCardAdvertising>
);

const ContainerCardAdvertising = styled.section`
  padding: 1rem;
  border-radius: 5px;
  height: 150px;
  width: 100%;
  img {
    border-radius: 5px;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;
