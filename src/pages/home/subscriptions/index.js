import React, { useEffect, useGlobal, useState, useRef } from "reactn";
import styled from "styled-components";
import { Plans } from "./Plans";
import { Navbar } from "../../../components/Navbar";

export const Subscriptions = (props) => {
  const [authUser] = useGlobal("user");

  return (
    <SubscriptionsContainer>
      <Navbar {...props} />
      <Plans {...props} />
    </SubscriptionsContainer>
  );
};

const SubscriptionsContainer = styled.div`
  width: 100%;
`;
