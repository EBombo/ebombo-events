import React, {useEffect, useGlobal, useState} from "reactn";
import {Button, Modal} from "antd";
import {doSignOut} from "../firebase/authentication";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import defaultTo from "lodash/defaultTo";
import {BanModal, LoginModal, Upload} from "../components";
import {ForgotPassword} from "../pages";
import {useHistory, useLocation} from "react-router";
import styled from "styled-components";
import {btnPrimaryGeneral, mediaQuery} from "../styles/constants";
import {Desktop, Tablet} from "../styles/utils";
import {DrawerMobile} from "../styles/components/drawer-mobile/drawerMobile";
import {isMobileDevice} from "../utils/deviceType";
import {Container} from "./Container";
import {spinLoader, whatsAppIcon} from "../utils";
import {Footer} from "./Footer";
import {ModalVerifyEmail} from "./ModalVerifyEmail";
import {MenuDrawerContainer} from "./sidebar/MenuRightDrawer";
import {ModalContainer} from "./common/ModalContainer";
import {PasswordModal} from "./common/PasswordModal";
import {ContentBarTablet} from "./ContentBarTablet";
import {ContentBarDesktop} from "./ContentBarDesktop";
import {darkTheme} from "../styles/theme";
import {JoyrideGuide} from "./user-guide/joyrideGuide";
import moment from "moment";
import {useUser} from "../hoc/useLocalStorageState";
import {lazy, Suspense} from "react";
import {useErrorHandler} from "react-error-boundary";
import {useOwnFetch} from "../utils/useFetch/useFetch";
import UrlAssembler from "url-assembler";
import {config} from "../firebase";

const MenuLeftContainer = lazy(() => import("./sidebar/MenuLeftDrawer"));

export const UserLayout = (props) => {
  const history = useHistory();
  const location = useLocation();
  const [authUser, setAuthUser] = useGlobal("user");
  const [, setLSAuthUser] = useUser();
  const [showGuide, setShowGuide] = useGlobal("showGuide");
  const [currentTournament, setCurrentTournament] = useGlobal(
    "currentTournament"
  );
  const [isVisibleLoginModal, setIsVisibleLoginModal] = useGlobal(
    "isVisibleLoginModal"
  );
  const [
    isVisibleEditProfilePicture,
    setIsVisibleEditProfilePicture,
  ] = useGlobal("isVisibleEditProfilePicture");
  const [, setIsVisibleBanModal] = useGlobal("openBanModal");
  const [openSidebarMobile, setOpenSidebarMobile] = useGlobal(
    "openSidebarMobile"
  );
  const [openSidebarMenuLeft, setOpenSidebarMenuLeft] = useGlobal(
    "openSidebarMenuLeft"
  );
  const [isVisibleModalUserAccount, setIsVisibleModalUserAccount] = useGlobal(
    "isVisibleModalUserAccount"
  );
  const [isVisiblePasswordModal, setIsVisiblePasswordModal] = useGlobal(
    "isVisiblePasswordModal"
  );
  const [, setLoadingSearchMatches] = useGlobal("loadingSearchMatches");
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [, setLoadingProfilePicture] = useState(false);
  const [isVisibleInfoMoney, setIsVisibleInfoMoney] = useState(false);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  useEffect(() => {
    if (!location.hash.includes("#guide")) return;

    // setShowGuide(true);
    history.push({
      pathname: "/",
      hash: "",
    });
  }, [location.hash]);

  useEffect(() => {
    setIsVisibleLoginModal(false);
    setForgotPasswordVisible(false);
    setOpenSidebarMobile(false);
    setIsVisibleBanModal(false);
  }, []);

  useEffect(() => {
    if (!currentTournament) return;

    let localTournaments = defaultTo(
      JSON.parse(localStorage.getItem("tournaments")),
      []
    );

    const localTournament = localTournaments.some(
      (localTournament) =>
        localTournament.id === currentTournament.id &&
        localTournament.password === currentTournament.password
    );

    if (localTournament) {
      console.log("redirect->", currentTournament);
      setOpenSidebarMenuLeft(false);
      return currentTournament.eventType === "league" &&
        moment().isAfter(currentTournament.inscriptionDate.toDate())
        ? history.push(
            `/games/${currentTournament.game.id}/consoles/${currentTournament.console.id}/leagues/${currentTournament.id}/matches`
          )
        : history.push(
            `/games/${currentTournament.game.id}/consoles/${currentTournament.console.id}/tournaments/${currentTournament.id}`
          );
    }

    !isEmpty(currentTournament.password) &&
      !get(currentTournament, "playerIds").includes(get(authUser, "id")) &&
      setIsVisiblePasswordModal(true);
  }, [currentTournament]);

  useEffect(() => {
    if (
      !location.pathname.includes("leagues") ||
      !location.pathname.includes("tournaments")
    )
      setCurrentTournament(null);
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash.includes("right-menu")) {
      setOpenSidebarMobile(true);
      setOpenSidebarMenuLeft(false);
    }
    if (location.hash.includes("left-menu")) {
      setOpenSidebarMobile(false);
      setOpenSidebarMenuLeft(true);
    }
  }, [location.hash]);

  const logOut = () => {
    setLoadingSearchMatches(false);
    setOpenSidebarMobile(false);
    setLSAuthUser.reset();
    setAuthUser(null);
    doSignOut();
  };

  const modalInfoMoney = () => (
    <ModalContainer
      footer={null}
      visible={isVisibleInfoMoney}
      onCancel={() => setIsVisibleInfoMoney(!isVisibleInfoMoney)}
    >
      <h3 style={{ color: `${darkTheme.basic.white}`, padding: "10px 0" }}>
        Dinero Real y Dinero Jugable
      </h3>
      <div className="content-popover">
        <p>
          Selecciona dinero real para jugar partidas y participar en torneos.
        </p>
        <p>
          Selecciona dinero jugable para jugar por partidas gratis donde puedes
          practicar y canjear productos en la tienda.
        </p>
      </div>
    </ModalContainer>
  );
  const visibleRegistration = async () => {
    try {
      await setIsVisibleLoginModal(false);
      isMobileDevice
        ? history.push("/mobile/registration")
        : history.push("/registration");
      setOpenSidebarMobile(false);
    } catch (Error) {
      history.push("/mobile/registration");
    }
  };

  const completeUserAccount = () => (
    <ModalContainer
      footer={null}
      visible={isVisibleModalUserAccount}
      onCancel={() => setIsVisibleModalUserAccount(false)}
    >
      <CompleteId>
        <div className="id">ID</div>
        Para buscar una partida primero debes colocar tu
        <br />
        <b>
          (
          {get(
            props,
            "requiredUserAccount.description",
            " PlayStation Network / Xbox ID"
          )}
          )
        </b>
        <BtnPrimary
          onClick={() => {
            setIsVisibleModalUserAccount(false);
            history.push(`/users/${authUser.id}/user-accounts`);
          }}
        >
          Editar ID
        </BtnPrimary>
      </CompleteId>
    </ModalContainer>
  );

  const forgotPasswordVisible_ = (forgotPasswordVisible) =>
    setForgotPasswordVisible(forgotPasswordVisible);

  const verifiedModalResendEmail = () => {
    if (!authUser) return;

    if (!get(authUser, "isVerified", true))
      return <ModalVerifyEmail {...props} />;
  };

  const loginModal = () => {
    if (isVisibleLoginModal_())
      return (
        <LoginModalContainer
          visible={isVisibleLoginModal_()}
          onCancel={() => setIsVisibleLoginModal(false)}
        >
          {!forgotPasswordVisible ? (
            <LoginModal
              {...props}
              forgotPasswordVisible={forgotPasswordVisible_}
            />
          ) : (
            <ForgotPassword
              {...props}
              forgotPasswordVisible={forgotPasswordVisible_}
            />
          )}
        </LoginModalContainer>
      );
  };

  const isVisibleLoginModal_ = () => isVisibleLoginModal && !authUser;

  const banContainer = () => {
    if (!get(authUser, "isBanned", false)) return;

    return (
      <BanModalContainer
        visible={true}
        onCancel={() => console.log("SU CUENTA HA SIDO BLOQUEADA")}
      >
        {<BanModal {...props} logOut={logOut} />}
      </BanModalContainer>
    );
  };

  const sendProfileImageUrl = async (user_) => {
    try {
      await ownFetch(profileUrl(authUser.id), "PUT", user_);
    } catch (error) {
      handleError({ ...error, action: "sendProfileImageUrl" });
    }
  };

  const profileUrl = (userId) => {
    let template = "/users/:userId/picture";
    return new UrlAssembler(`${config.serverUrl}`)
      .template(template)
      .param({ userId })
      .toString();
  };

  const ModalEditProfilePicture = () => (
    <ModalContainer
      footer={null}
      visible={isVisibleEditProfilePicture}
      onCancel={() =>
        setIsVisibleEditProfilePicture(!isVisibleEditProfilePicture)
      }
    >
      <Upload
        styled={{ width: "200px" }}
        isImage={true}
        accept="image/*"
        bucket="users"
        filePath={`users/${authUser.id}`}
        fileName="profile"
        name="profileImageUrl"
        buttonText="Subir foto de Perfil"
        document={authUser}
        afterUpload={(user_) => sendProfileImageUrl(user_)}
        sizeResized="100x100"
        reduce={true}
      />
    </ModalContainer>
  );

  return (
    <>
      {isVisibleEditProfilePicture && ModalEditProfilePicture()}
      {isVisiblePasswordModal && <PasswordModal />}
      {loginModal()}
      {verifiedModalResendEmail()}
      {isVisibleModalUserAccount && completeUserAccount()}
      {isVisibleInfoMoney && modalInfoMoney()}
      {banContainer()}
      {openSidebarMobile && (
        <DrawerMobile
          placement="right"
          closable={false}
          onClose={() => {
            setOpenSidebarMobile(!openSidebarMobile);
            history.push({
              hash: "",
              search: "",
            });
          }}
          visible={openSidebarMobile}
          default="true"
        >
          <MenuDrawerContainer
            visibleRegistration={visibleRegistration}
            logOut={logOut}
          />
        </DrawerMobile>
      )}
      {openSidebarMenuLeft && (
        <DrawerMobile
          placement="left"
          closable={false}
          onClose={() => {
            setOpenSidebarMenuLeft(!openSidebarMenuLeft);
            history.push({
              hash: "",
              search: "",
            });
          }}
          visible={openSidebarMenuLeft}
        >
          <Suspense fallback={spinLoader()}>
            <MenuLeftContainer
              close={() => {
                setOpenSidebarMenuLeft(!openSidebarMenuLeft);
                history.push({
                  hash: "",
                  search: "",
                });
              }}
              {...props}
            />
          </Suspense>
        </DrawerMobile>
      )}
      <UserLayoutContainer>
        <Desktop>
          <ContentBarDesktop
            modalInfoMoney={modalInfoMoney}
            isVisibleInfoMoney={isVisibleInfoMoney}
            setIsVisibleInfoMoney={setIsVisibleInfoMoney}
            visibleRegistration={visibleRegistration}
          />
        </Desktop>
        <Tablet>
          <ContentBarTablet
            modalInfoMoney={modalInfoMoney}
            isVisibleInfoMoney={isVisibleInfoMoney}
            setIsVisibleInfoMoney={setIsVisibleInfoMoney}
            visibleRegistration={visibleRegistration}
          />
        </Tablet>
        <Layout>
          {showGuide && get(authUser, "isVerified", false) && <JoyrideGuide />}
          <LayoutBody isLanding={props.isLanding}>
            <div className="layout-content">{props.children}</div>
            <Desktop>
              <ContainerFooter
                margin={
                  (location.pathname.includes("/challenges") &&
                    !location.pathname.includes("/challenges/")) ||
                  location.pathname.includes("/challenges/new")
                    ? "0 0 0 208px"
                    : "0"
                }
              >
                <Footer />
              </ContainerFooter>
            </Desktop>
            <Tablet>
              <ContainerFooter>
                <Footer />
              </ContainerFooter>
            </Tablet>
          </LayoutBody>
        </Layout>
      </UserLayoutContainer>
      {whatsAppIcon()}
    </>
  );
};

const LoginModalContainer = styled(Modal)`
  padding-bottom: 0;
  top: 4rem;

  .ant-modal-content {
    background-blend-mode: multiply;
    background: ${(props) => props.theme.basic.default};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 100% 33%;
    border-radius: 9px;

    .ant-modal-close {
      padding-bottom: 1rem;
      color: ${(props) => props.theme.basic.white};
      font-size: 20px;
    }

    .ant-modal-footer {
      display: none;
    }
  }

  .btn-send-code-verify {
    ${(props) =>
      btnPrimaryGeneral(
        "0.9rem",
        "600",
        "0 0 .7rem 0",
        "auto",
        "30px",
        props.theme.basic.blackLighten,
        props.theme.basic.primary
      )}
  }
`;

const BanModalContainer = styled(Modal)`
  padding-bottom: 0;
  top: 4rem;

  .ant-modal-content {
    background-blend-mode: multiply;
    background: ${(props) => props.theme.basic.blackDarken};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 100% 33%;
    border-radius: 9px;

    .ant-modal-close {
      display: none;
      padding-bottom: 1rem;
      color: ${(props) => props.theme.basic.white};
      font-size: 20px;
    }

    .ant-modal-footer {
      display: none;
    }
  }
`;

const UserLayoutContainer = styled.section`
  height: 100vh;
  width: 100%;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: row;
`;

const LayoutBody = styled.section`
  min-height: 100vh;
  width: 100vw;
  background: ${(props) => props.theme.basic.default};

  ${mediaQuery.afterTablet} {
    padding-top: 3rem;
  }

  .layout-content {
    min-height: 100vh;
  }
`;

const ContainerFooter = styled(Container)`
  background: ${(props) => props.theme.basic.blackLighten};
  padding: 0;
  margin: ${(props) => (props.margin ? props.margin : "0")};
`;

const BtnPrimary = styled(Button)`
  border: 1px solid ${(props) => props.theme.basic.primary} !important;
  border-radius: 7px;
  padding: 11px;
  margin: 10px auto !important;
  ${(props) =>
    btnPrimaryGeneral(
      "0.9rem",
      "normal",
      "auto",
      "80%",
      "auto",
      props.theme.basic.primary,
      "transparent"
    )};
`;

const CompleteId = styled.div`
  text-align: center;
  padding: 0 18px;

  .id {
    color: ${(props) => props.theme.basic.primary};
    font-weight: bold;
    font-size: 19px;
  }
`;
