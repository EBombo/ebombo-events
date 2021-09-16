import React, { useGlobal, useState } from "reactn";
import { DrawerContainer } from "../common/DrawerContainer";
import { Menu } from "./Menu";

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

  return (
    <DrawerContainer
      placement="right"
      closable={false}
      onClose={() => setOpenRightDrawer(false)}
      visible={openRightDrawer}
      {...props}
    >
      {tabContent()}
    </DrawerContainer>
  );
};
