import React, { useEffect, useGlobal, useMemo, useState } from "reactn";
import styled from "styled-components";
import { Image } from "./common/Image";
import { Icon } from "./common/Icons";
import { config } from "../firebase";
import { Desktop, mediaQuery, Tablet } from "../constants";
import { Anchor, Switch } from "./form";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import { Layout } from "./common/Layout";
import { SharpButton } from "./common/SharpButton";
import { Footer } from "./Footer";
import { useTranslation } from "../hooks";
import { Collapse, Popover } from "antd";

const { Panel } = Collapse;

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

          <Switch
            variant="switcher"
            size="small"
            type="checkbox"
            label1="En"
            label2="Es"
            defaultChecked={locale === locales[1]}
            onChange={(event) => {
              event.preventDefault();
              setLocale(event.target.checked ? locales[1] : locales[0]);
            }}
          />

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
            <ul className={`nav-menu no-scrollbar ${active ? "active" : ""}`}>
              {isEventPage ? null : (
                <>
                  <Collapse bordered={false} defaultActiveKey={["1"]}>
                    <Panel
                      className="text-blackDarken font-[800] text-[16px] leading-[24px]"
                      header={t("nav.features.title")}
                      key="1"
                    >
                      <div className="flex flex-col items-start gap-4">
                        {featuresMenu.map((menuItem, i) => (
                          <div
                            className="ml-[24px]"
                            key={`features-menu-${i}`}
                            onClick={() => {
                              router.push(menuItem.url);
                              setActive(false);
                            }}
                          >
                            {t(menuItem.label)}
                          </div>
                        ))}
                      </div>
                    </Panel>
                    <Panel
                      className="text-blackDarken font-[800] text-[16px] leading-[24px]"
                      header={t("nav.use-case.title")}
                      key="2"
                    >
                      <div className="flex flex-col items-start gap-4">
                        {useCaseMenu.map((menuItem, i) => (
                          <div
                            className="ml-[24px]"
                            key={`use-cases-menu-${i}`}
                            onClick={() => {
                              router.push(menuItem.url);
                              setActive(false);
                            }}
                          >
                            {t(menuItem.label)}
                          </div>
                        ))}
                      </div>
                    </Panel>
                  </Collapse>

                  {!authUser && (
                    <li
                      className=""
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
                  <li
                    className="text-blackDarken font-[800] text-[16px] leading-[24px] ml-[24px] px-[16px] py-[12px] leading-[1.57rem] cursor-pointer flex flex-start"
                    onClick={() => router.push("/login")}
                  >
                    {t("nav.login")}
                  </li>
                </>
              ) : (
                <li
                  className="text-blackDarken font-[800] text-[16px] leading-[24px] ml-[24px] px-[16px] py-[12px] leading-[1.57rem] cursor-pointer flex flex-start"
                  onClick={() => signOut()}
                >
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
    height: calc(100vh - 100px);
    flex-direction: column;
    background-color: ${(props) => props.theme.basic.whiteLight};
    width: 100%;
    text-align: center;
    transition: 0.3s;
    box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
    overflow: auto;

    .ant-collapse-item {
      border-bottom: 0 !important;
    }
  }

  .hamburger {
    display: block;
    cursor: pointer;
  }

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 60% 55px calc(40% - 55px);
  }
`;
