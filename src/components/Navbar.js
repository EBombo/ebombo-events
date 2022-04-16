import React, { useEffect, useGlobal, useMemo, useRef, useState } from "reactn";
import styled from "styled-components";
import { Image } from "./common/Image";
import { Icon } from "./common/Icons";
import { config } from "../firebase";
import { Desktop, mediaQuery, Tablet } from "../constants";
import { Anchor, ButtonAnt, Switch } from "./form";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import { Layout } from "./common/Layout";
import { Footer } from "./Footer";
import { useTranslation } from "../hooks";
import { Popover } from "antd";
import { darkTheme } from "../theme";

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
  const inputRef = useRef(null);

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
            <StyledSwitch className="switch" onClick={() => inputRef.current.click()}>
              <input
                ref={inputRef}
                id="language-toggle"
                className="check-toggle check-toggle-round-flat"
                type="checkbox"
                defaultChecked={locale[1]}
                onChange={(event) => {
                  event.preventDefault();
                  setLocale(event.target.checked ? locales[1] : locales[0]);
                }}
              />
              <label htmlFor="language-toggle" />
              <span className="on">EN</span>
              <span className="off">ES</span>
            </StyledSwitch>
          </Desktop>

          <Desktop>
            <div className="flex items-center justify-end gap-[5px]">
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
                </>
              )}
            </div>
          </Desktop>

          <Tablet>
            <ul className={`nav-menu ${active ? "active" : ""}`}>
              {isEventPage ? null : (
                <>
                  {featuresMenu.map((menuItem, i) => (
                    <li
                      className="nav-item"
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
                <Switch
                  margin="auto"
                  onChange={(event) => setLocale(event ? locales[1] : locales[0])}
                  defaultChecked={locale === locales[1]}
                  checkedChildren={locales[1]}
                  unCheckedChildren={locales[0]}
                  inactiveBackgroundColor={darkTheme.basic.primary}
                  activeBackgroundColor={darkTheme.basic.primary}
                />

                <StyledSwitch className="switch" onClick={() => inputRef.current.click()}>
                  <input
                    ref={inputRef}
                    id="language-toggle"
                    className="check-toggle check-toggle-round-flat"
                    type="checkbox"
                    defaultChecked={locale[1]}
                    onChange={(event) => {
                      event.preventDefault();
                      setLocale(event.target.checked ? locales[1] : locales[0]);
                    }}
                  />
                  <label htmlFor="language-toggle" />
                  <span className="on">EN</span>
                  <span className="off">ES</span>
                </StyledSwitch>
              </li>

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
    grid-template-columns: 75% 5% 20%;
  }
`;

const StyledSwitch = styled.div`
  position: relative;
  display: inline-block;

  span {
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

  input.check-toggle-round-flat:checked ~ .off {
    color: ${(props) => props.theme.basic.primary};
  }

  input.check-toggle-round-flat:checked ~ .on {
    color: ${(props) => props.theme.basic.white};
  }

  span.on {
    left: 0;
    padding-left: 2px;
    color: ${(props) => props.theme.basic.primary};
  }

  span.off {
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
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  input.check-toggle-round-flat + label {
    padding: 2px;
    width: 50px;
    height: 25px;
    background-color: ${(props) => props.theme.basic.primary};
    -webkit-border-radius: 60px;
    -moz-border-radius: 60px;
    -ms-border-radius: 60px;
    -o-border-radius: 60px;
    border-radius: 60px;
  }
  input.check-toggle-round-flat + label:before,
  input.check-toggle-round-flat + label:after {
    display: block;
    position: absolute;
    content: "";
  }

  input.check-toggle-round-flat + label:before {
    top: 2px;
    left: 2px;
    bottom: 2px;
    right: 2px;
    background-color: ${(props) => props.theme.basic.primary};
    -webkit-moz-border-radius: 60px;
    -webkit-ms-border-radius: 60px;
    -webkit-o-border-radius: 60px;
    border-radius: 60px;
  }
  input.check-toggle-round-flat + label:after {
    top: 2px;
    left: 2px;
    bottom: 2px;
    width: 25px;
    background-color: #fff;
    -webkit-border-radius: 52px;
    -moz-border-radius: 52px;
    -ms-border-radius: 52px;
    -o-border-radius: 52px;
    border-radius: 52px;
    -webkit-transition: margin 0.2s;
    -moz-transition: margin 0.2s;
    -o-transition: margin 0.2s;
    transition: margin 0.2s;
  }

  input.check-toggle-round-flat:checked + label {
  }

  input.check-toggle-round-flat:checked + label:after {
    margin-left: 20px;
  }
`;
