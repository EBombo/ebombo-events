import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { Layout } from "./index";
import { Desktop, mediaQuery, Tablet } from "../constants";
import { ModalContainer } from "./common/ModalContainer";
import { RightDrawer } from "./right-drawer/RightDrawer";
import dynamic from "next/dynamic";
import { spinLoaderMin } from "./common/loader";
import { useAuth } from "../hooks/useAuth";
import { TabletNav } from "./nav/TabletNav";
import { DesktopNav } from "./nav/DesktopNav";
import { Footer } from "./Footer";
import { darkTheme } from "../theme";

const PWA = dynamic(() => import("./common/pwa"), { ssr: false });

const WspIcon = dynamic(() => import("./common/wspIcon"));

const FooterBar = dynamic(() => import("./FooterBar"));

const Login = dynamic(() => import("../pages/login"), {
  loading: () => spinLoaderMin(),
});

const Verify = dynamic(() => import("../pages/verification"), {
  loading: () => spinLoaderMin(),
});

const ForgotPassword = dynamic(() => import("../pages/forgot-password"), {
  loading: () => spinLoaderMin(),
});

const UserLayout = (props) => {
  const { signOut } = useAuth();

  const [authUser] = useGlobal("user");
  const [isVisibleLoginModal, setIsVisibleLoginModal] = useGlobal("isVisibleLoginModal");

  const [isVisibleForgotPassword] = useGlobal("isVisibleForgotPassword");
  const [isVisibleModalConfirm] = useGlobal("isVisibleModalConfirm");

  const loginModal = () =>
    isVisibleLoginModal && !authUser ? (
      <ModalContainer
        background={darkTheme.basic.gray}
        visible={isVisibleLoginModal && !authUser}
        onCancel={() => setIsVisibleLoginModal(false)}
        footer={null}
        closable={false}
        padding={"1rem"}
      >
        {isVisibleForgotPassword ? <ForgotPassword {...props} /> : <Login {...props} />}
      </ModalContainer>
    ) : null;

  const verifiedModalResendEmail = () =>
    isVisibleModalConfirm ? (
      <ModalContainer
        background={darkTheme.basic.default}
        footer={null}
        closable={false}
        visible={!authUser.isVerified}
      >
        <Verify logOut={signOut} />
      </ModalContainer>
    ) : null;

  const RightDrawerForm = () => <RightDrawer>hola comoe stas</RightDrawer>;

  return (
    <>
      {loginModal()}
      {verifiedModalResendEmail()}
      {RightDrawerForm()}
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
