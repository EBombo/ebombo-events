import React, { useMemo } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Image } from "../../../components/common/Image";
import { Footer } from "../../../components/Footer";
import { heldEventsData } from "../../../components/common/DataList";
import { Navbar } from "../../../components/Navbar";
import { Icon } from "../../../components/common/Icons";
import { mediaQuery, Desktop, Tablet } from "../../../constants";

export const HeldEventDetails = (props) => {
  const router = useRouter();
  const { heldEventId } = router.query;

  const currentHeldEvent = useMemo(() => {
    if (!heldEventId) return {};

    const currentHeldEvent_ = heldEventsData.find((heldEvent) => heldEvent.id === heldEventId);
    return currentHeldEvent_ ?? {};
  }, [heldEventId]);

  return (
    <HeldEventDetailsStyled>
      <Navbar>
        <div className="main-container">
          <div className="title-container">
            <div className="title">
              <Icon className="back-icon" type="left" onClick={() => router.back()} /> {currentHeldEvent.title}
            </div>
          </div>
          <div className="image-container">
            <Desktop>
              <Image className="image" width="400px" height="200px" size="cover" src={currentHeldEvent.imageUrl} />
            </Desktop>
            <Tablet>
              <Image className="image" width="274px" height="130px" size="cover" src={currentHeldEvent.imageUrl} />
            </Tablet>
          </div>
          <div className="text-container">
            <p>{currentHeldEvent.text}</p>
          </div>
        </div>
      </Navbar>
    </HeldEventDetailsStyled>
  );
};

const HeldEventDetailsStyled = styled.section`
  .title-container {
    background: ${(props) => props.theme.basic.secondary};
    padding: 66px 0;
    text-align: center;

    .title {
      color: ${(props) => props.theme.basic.whiteLight};
      font-family: Lato, sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 22px;
      line-height: 26px;
      letter-spacing: 0.03em;
      position: relative;

      max-width: 900px;
      margin: 0 auto;
    }

    ${mediaQuery.afterTablet} {
      text-align: left;
    }
  }

  .image-container {
    margin-top: -36px;
    margin-bottom: 36px;

    ${mediaQuery.afterTablet} {
      position: relative;
      max-width: 900px;
      margin: 0 auto;
      .image {
        display: inline-block;
        position: absolute;
        right: 0;
        top: -100px;
      }
    }
  }
  .text-container {
    margin: 0 2rem 4rem 2rem;
    ${mediaQuery.afterTablet} {
      max-width: 900px;
      margin: 8rem auto 4rem auto;
    }
  }
  .back-icon {
    border-radius: 50%;
    padding: 6px;
    background: ${(props) => props.theme.basic.primary};

    position: absolute;
    cursor: pointer;
    bottom: 0;
    left: 32px;
    vertical-align: bottom;
    svg {
      font-size: 12px;
    }
    ${mediaQuery.afterTablet} {
      position: relative;
      left: 0;
      margin-right: 2.5rem;
      vertical-align: bottom;
    }
  }
`;
