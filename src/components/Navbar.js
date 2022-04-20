import React, { useEffect, useGlobal, useMemo, useRef, useState } from "reactn";
import styled from "styled-components";
import { Image } from "./common/Image";
import { Icon } from "./common/Icons";
import { config } from "../firebase";
import { Desktop, mediaQuery, Tablet } from "../constants";
import { Anchor } from "./form";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import { Layout } from "./common/Layout";
import { SharpButton } from "./common/SharpButton";
import { Footer } from "./Footer";
import { useTranslation } from "../hooks";
import { Popover } from "antd";

const useCaseMenu = [
  { url: "/team-building", label: "nav.use-case.team-building" },
  { url: "/on-boarding", label: "nav.use-case.on-boarding" },
  { url: "/corporate-events", label: "nav.use-case.corporate-events" },
];

const featuresMenu = [
  { url: "/activities", label: "nav.features.activities" },
  { url: "/content", label: "nav.features.content" },
];

export const Navbar = (props) => {
  const router = useRouter();

  const { signOut } = useAuth();

  const { t, locale, SwitchTranslation } = useTranslation();

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

  const createEvent = () => {
    if (authUser) return router.push("/library/events");

    return router.push("/events/new");
  };

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
                  <Popover
                    placement="bottom"
                    color="#FFFFFF"
                    content={featuresMenu.map((menuItem, i) => (
                      <Anchor key={`features-${i}`} className="block link text-black text-left" url={menuItem.url}>
                        <span className="font-bold text-left text-base w-full text-left block">
                          {t(menuItem.label)}
                        </span>
                      </Anchor>
                    ))}
                  >
                    <Anchor className="link hover:bg-violet-100 rounded-xl px-2 py-2">
                      <span className="align-middle">{t("nav.features.title")}</span> <Icon type="down" />
                    </Anchor>
                  </Popover>

                  <Popover
                    placement="bottom"
                    color="#FFFFFF"
                    content={useCaseMenu.map((menuItem, i) => (
                      <Anchor key={`use-case-${i}`} className="block link text-black" url={menuItem.url}>
                        <span className="font-bold text-left text-base w-full text-left block">
                          {t(menuItem.label)}
                        </span>
                      </Anchor>
                    ))}
                  >
                    <Anchor className="link hover:bg-violet-100 rounded-xl px-2 py-2">
                      <span className="align-middle">{t("nav.use-case.title")}</span> <Icon type="down" />
                    </Anchor>
                  </Popover>

                  <Anchor url="/experience" className="link">
                    {t("nav.experience")}
                  </Anchor>
                </>
              )}
            </Desktop>
          </div>

          <Desktop>
            <SwitchTranslation />
          </Desktop>

          <Desktop>
            <div className="flex items-center justify-end gap-[18px]">
              {authUser ? (
                <Anchor onClick={() => signOut()} variant="secondary" fontSize="18px">
                  {t("nav.logout")}
                </Anchor>
              ) : (
                <>
                  <Anchor
                    url="/login"
                    variant="secondary"
                    fontSize="18px"
                    lineHeight="22px"
                    fontWeight="500"
                    margin="auto 8px"
                    className="anchor"
                  >
                    {t("nav.login")}
                  </Anchor>
                </>
              )}
              <SharpButton prefixIcon="normal" onClick={() => createEvent()}>
                {t("landing.header.book-an-event")}
              </SharpButton>
            </div>
          </Desktop>

          <Tablet>
            <ul className={`nav-menu ${active ? "active" : ""}`}>
              {isEventPage ? null : (
                <>
                  {featuresMenu.map((menuItem, i) => (
                    <li
                      className="nav-item"
                      key={`features-menu-${i}`}
                      onClick={() => {
                        router.push(menuItem.url);
                        setActive(false);
                      }}
                    >
                      {t(menuItem.label)}
                    </li>
                  ))}

                  {useCaseMenu.map((menuItem, i) => (
                    <li
                      className="nav-item"
                      key={`use-cases-menu-${i}`}
                      onClick={() => {
                        router.push(menuItem.url);
                        setActive(false);
                      }}
                    >
                      {t(menuItem.label)}
                    </li>
                  ))}
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

              <li className="nav-item">
                <SwitchTranslation />
              </li>

              {!authUser ? (
                <>
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
    top: 100px;
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

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 70% 5% 25%;
  }
`;

const StyledSwitch = styled.div`
  position: relative;
  display: inline-block;
  width: 50px;

  .on,
  .off {
    position: absolute;
    top: 5px;
    pointer-events: none;
    font-family: Lato;
    font-weight: bold;
    font-size: 12px;
    text-transform: uppercase;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
    width: 50%;
    text-align: center;
  }

  .check-toggle-round-flat:checked ~ {
    .off {
      color: ${(props) => props.theme.basic.primary};
    }

    .on {
      color: ${(props) => props.theme.basic.white};
    }
  }

  .on {
    left: 0;
    padding-left: 2px;
    color: ${(props) => props.theme.basic.primary};
  }

  .off {
    right: 0;
    padding-right: 4px;
    color: ${(props) => props.theme.basic.white};
  }

  .check-toggle {
    position: absolute;
    margin-left: -9999px;
    visibility: hidden;
  }

  .check-toggle + label {
    display: block;
    position: relative;
    cursor: pointer;
    outline: none;
  }

  .check-toggle-round-flat + label {
    padding: 2px;
    width: 50px;
    height: 25px;
    background-color: ${(props) => props.theme.basic.primary};
    border-radius: 60px;

    ::before,
    ::after {
      display: block;
      position: absolute;
      content: "";
    }

    ::before {
      top: 2px;
      left: 2px;
      bottom: 2px;
      right: 2px;
      background-color: ${(props) => props.theme.basic.primary};
      border-radius: 60px;
    }

    ::after {
      top: 2px;
      left: 2px;
      bottom: 2px;
      width: 25px;
      background-color: ${(props) => props.theme.basic.white};
      border-radius: 52px;
    }
  }

  .check-toggle-round-flat:checked + label:after {
    margin-right: 20px;
  }

  .check-toggle-round-flat:checked + label:after {
    margin-left: 20px;
  }
`;
