import React, { useEffect, useGlobal, useMemo, useState } from "reactn";
import styled from "styled-components";
import { Image } from "./common/Image";
import { Icon } from "./common/Icons";
import { config } from "../firebase";
import { Desktop, Tablet } from "../constants";
import { Anchor, ButtonAnt } from "./form";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import { Layout } from "./common/Layout";
import { Footer } from "./Footer";
import { useTranslation } from "../hooks";
import { Popover } from "antd";

const useCaseMenu = [
  { url: "/team-building", label: "nav.use-case.team-building" },
  { url: "/on-boarding", label: "nav.use-case.on-boarding" },
  { url: "/corporate-events", label: "nav.use-case.corporate-events" },
];

export const Navbar = (props) => {
  const router = useRouter();

  const { signOut } = useAuth();

  const { t, locale, locales, setLocale } = useTranslation();

  const [authUser] = useGlobal("user");

  const [active, setActive] = useState(false);

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/login");
    router.prefetch("/register");
    router.prefetch("/library");
    router.prefetch("/about-us");
    router.prefetch("/subscriptions");
    router.prefetch("/experience");
  }, []);

  const isNavWithBorder = useMemo(() => {
    const paths = ["/login", "/register"];

    return paths.includes(router.asPath);
  }, [router]);

  const isEventPage = useMemo(() => {
    const path = router.asPath;

    return path.includes("/events/new");
  }, [router]);

  return (
    <>
      <Layout key={locale}>
        <NavContainer active={active} border={isNavWithBorder}>
          <div className="left-container">
            <div className="mr-8 inline-block">
              <Image
                src={`${config.storageUrl}/resources/ebombo.svg`}
                height="auto"
                width="125px"
                size="contain"
                margin="0"
                cursor="pointer"
                alt=""
                onClick={() => router.push(authUser ? "/library" : "/")}
              />
            </div>
            <Desktop>
              {isEventPage ? null : (
                <>
                  <Anchor url="/experience" className="link">
                    {t("nav.experience")}
                  </Anchor>
                  {!authUser && (
                    <Anchor url="/contact" className="link">
                      {t("nav.contact")}
                    </Anchor>
                  )}
                </>
              )}

              <Popover
                placement="bottom"
                color="#FFFFFF"
                content={useCaseMenu.map((menuItem) => (
                  <Anchor key={menuItem} className="block link text-black" url={menuItem.url}>
                    <span className="align-middle font-bold text-left text-base">{t(menuItem.label)}</span>
                  </Anchor>
                ))}
              >
                <Anchor className="link hover:bg-violet-100 rounded-xl px-2 py-2">
                  <span className="align-middle">{t("nav.use-case.title")}</span> <Icon type="down" />
                </Anchor>
              </Popover>

              <Popover
                placement="bottom"
                color="#FFFFFF"
                content={locales.map((locale) => (
                  <div key={locale} onClick={() => setLocale(locale)} className="link text-black cursor-pointer">
                    <span className="align-middle font-bold text-base">{t(locale)}</span>
                  </div>
                ))}
              >
                <Anchor className="link hover:bg-violet-100 rounded-xl px-2 py-2">
                  <span className="align-middle">{t("language")}</span> <Icon type="down" />
                </Anchor>
              </Popover>
            </Desktop>
          </div>

          <Desktop>
            {authUser ? (
              <Anchor onClick={() => signOut()} variant="secondary" fontSize="18px">
                {t("nav.logout")}
              </Anchor>
            ) : (
              <div className="btns-container">
                <Anchor
                  url="/login"
                  variant="secondary"
                  fontSize="18px"
                  fontWeight="500"
                  margin="auto 8px"
                  className="anchor"
                >
                  {t("nav.login")}
                </Anchor>
                {isEventPage ? null : (
                  <ButtonAnt
                    onClick={() => router.push("/contact")}
                    color="success"
                    variant="contained"
                    fontSize="18px"
                  >
                    {t("nav.contact-us")}
                  </ButtonAnt>
                )}
              </div>
            )}
          </Desktop>

          <Tablet>
            <ul className={`nav-menu ${active ? "active" : ""}`}>
              {isEventPage ? null : (
                <>
                  <li
                    className="nav-item"
                    onClick={() => {
                      router.push("/about-us");
                      setActive(false);
                    }}
                  >
                    {t("nav.about-us")}
                  </li>
                  {!authUser && (
                    <li
                      className="nav-item"
                      onClick={() => {
                        router.push("/contact");
                        setActive(false);
                      }}
                    >
                      {t("nav.contact")}
                    </li>
                  )}
                </>
              )}

              {!authUser ? (
                <>
                  {isEventPage ? null : (
                    <ButtonAnt
                      margin="1.5rem auto"
                      onClick={() => router.push("/contact")}
                      color="success"
                      variant="contained"
                      fontSize="18px"
                    >
                      {t("nav.contact-us")}
                    </ButtonAnt>
                  )}
                  <li className="nav-item" onClick={() => router.push("/login")}>
                    {t("nav.login")}
                  </li>
                </>
              ) : (
                <li className="nav-item" onClick={() => signOut()}>
                  {t("nav.logout")}
                </li>
              )}
            </ul>

            <div className={`hamburger ${active ? "active" : ""}`} onClick={() => setActive(!active)}>
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </div>
          </Tablet>
        </NavContainer>

        <LayoutMenu>
          <Body>{props.children}</Body>
          <Footer />
        </LayoutMenu>
      </Layout>
    </>
  );
};

const LayoutMenu = styled.section`
  min-height: 100vh;
  padding: 0;
`;

const Body = styled.section`
  width: 100vw;
  flex: 1 1 auto;
  display: grid;
  min-height: calc(100vh - 100px);
`;

const NavContainer = styled.div`
  z-index: 9;
  width: 100%;
  display: flex;
  height: 100px;
  padding: 0 1rem;
  align-items: center;
  border-bottom: 2px solid ${(props) => (props.border ? props.theme.basic.primaryLight : "")};
  justify-content: space-between;
  background: ${(props) => props.theme.basic.whiteLight};
  position: ${(props) => (props.active ? "fixed" : "inherit")};

  .left-container {
    display: flex;
    align-items: center;

    .ant-dropdown-link,
    .link {
      color: ${(props) => props.theme.basic.secondary};
      margin: 0 1rem;
      font-family: Lato;
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 22px;
    }
  }

  .bar {
    display: block;
    width: 25px;
    height: 3px;
    margin: 5px auto;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
    background-color: ${(props) => props.theme.basic.primary};
  }

  .hamburger.active .bar:nth-child(2) {
    opacity: 0;
  }

  .hamburger.active .bar:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .hamburger.active .bar:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }

  .nav-menu {
    position: fixed;
    z-index: 999;
    left: -100%;
    top: 5rem;
    flex-direction: column;
    background-color: ${(props) => props.theme.basic.whiteLight};
    width: 100%;
    text-align: center;
    transition: 0.3s;
    box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);

    li {
      cursor: pointer;
    }
  }

  .nav-menu.active {
    left: 0;
  }

  .games-item {
    padding: 1rem 0;
    font-family: Lato;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    color: ${(props) => props.theme.basic.blackDarken};
  }

  .last {
    border-bottom: 1px solid ${(props) => props.theme.basic.whiteDarken};
  }

  .nav-item {
    padding: 1.5rem 0;
    font-family: Lato;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 22px;
    color: ${(props) => props.theme.basic.secondary};
    border-bottom: 1px solid ${(props) => props.theme.basic.whiteDarken};
  }

  .hamburger {
    display: block;
    cursor: pointer;
  }

  .btns-container {
    display: flex;
    align-items: center;
  }
`;
