import React, { useEffect, useGlobal, useRef, useState } from "reactn";
import { Menu } from "./Menu";
import styled from "styled-components";
import { mediaQuery } from "../../constants";
import { useClickOutside } from "../../hooks/useClickOutside";

export const RightDrawer = (props) => {
  const [openRightDrawer, setOpenRightDrawer] = useGlobal("openRightDrawer");
  const [tab, setTab] = useState("menu");

  const tabContent = () => {
    switch (tab) {
      case "menu":
        return <Menu tab={tab} setTab={setTab} {...props} />;
      default:
        <Menu tab={tab} setTab={setTab} {...props} />;
    }
  };

  let domNodeRef = useClickOutside(() => {
    setOpenRightDrawer(false);
  });

  return (
    <RightDrawerContainer active={openRightDrawer} ref={domNodeRef}>
      {tabContent()}
    </RightDrawerContainer>
  );
};

const RightDrawerContainer = styled.div`
  position: fixed;
  z-index: 999;
  right: -100%;
  top: 50px;
  flex-direction: column;
  background-color: #fff;
  width: 100%;
  text-align: center;
  transition: 0.3s;
  box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);

  ${(props) =>
    props.active &&
    `
     right: 0;
  `}

  ${mediaQuery.afterTablet} {
    max-width: 350px;
    top: 50px;
  }
`;
