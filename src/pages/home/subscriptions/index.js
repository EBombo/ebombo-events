import React, { useEffect, useGlobal, useState, useRef } from "reactn";
import styled from "styled-components";
import { HeaderLanding } from "../HeaderLanding";
import { Plans } from "./Plans";

export const Subscriptions = (props) => {
  const [authUser] = useGlobal("user");

  return (
    <SubscriptionsContainer>
      <HeaderLanding {...props} />
      <Plans {...props} />
    </SubscriptionsContainer>
  );
};

const SubscriptionsContainer = styled.div`
  width: 100%;
`;
