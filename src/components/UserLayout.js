import React from "react";
import styled from "styled-components";
import { Layout } from "./index";
import { Desktop, mediaQuery, Tablet } from "../constants";
import { RightDrawer } from "./right-drawer/RightDrawer";
import dynamic from "next/dynamic";
import { TabletNav } from "./nav/TabletNav";
import { DesktopNav } from "./nav/DesktopNav";
import { Footer } from "./Footer";

const PWA = dynamic(() => import("./common/pwa"), { ssr: false });

const WspIcon = dynamic(() => import("./common/wspIcon"));

const FooterBar = dynamic(() => import("./FooterBar"));

const UserLayout = (props) => {
  return (
    <>
      <RightDrawer />
      <Layout>
        <Desktop>
          <DesktopNav {...props} />
        </Desktop>

        <Tablet>
          <TabletNav {...props} />
        </Tablet>

        <LayoutMenu>
          <Desktop>
            <Body isLanding>{props.children}</Body>
          </Desktop>

          <Tablet>
            <Body isLanding={props.isLanding}>{props.children}</Body>
            {!props.isLanding && <FooterBar {...props} />}
          </Tablet>

          <Footer />

          <PWA />

          <WspIcon />
        </LayoutMenu>
      </Layout>
    </>
  );
};

const LayoutMenu = styled.section`
  height: 100vh;
  padding: 0;
`;

const Body = styled.section`
  width: 100vw;
  min-height: 100%;
  overflow: auto;
  padding: 50px 0 0 0;
  flex: 1 1 auto;

  ${mediaQuery.afterTablet} {
    padding: 50px 0 0 ${(props) => (props.isLanding ? "0" : "4rem")};
  }
`;

export default UserLayout;
