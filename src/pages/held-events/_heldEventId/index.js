import React, { useMemo } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Image } from "../../../components/common/Image";
import { Footer } from "../../../components/Footer";
import { heldEventsData } from "../../../components/common/DataList";
import { Navbar } from "../../home/Navbar";
import { Icon } from "../../components/common/Icons";

export const HeldEventDetails = (props) => {
  const router = useRouter();
  const { heldEventId } = router.query;

  const currentHeldEvent = useMemo(() => {
    if (!heldEventId) return {};

    return heldEventsData.find((heldEvent) => heldEvent.id === heldEventId);
  }, [heldEventId]);

  return (
    <HeldEventDetailsStyled>
      <Navbar />
      <div className="main-container">
        <div className="title-container">
          <h1><Icon className="back-icon" type="left" />  {currentHeldEvent.title}</h1>
        </div>
        <div className="image-container">
          <Image width="200px" height="100px" src={currentHeldEvent.imageUrl} />
        </div>
        <div className="text-container">
          <p>{currentHeldEvent.text}</p>
        </div>
      </div>
      <Footer />
    </HeldEventDetailsStyled>
  );
};

const HeldEventDetailsStyled = styled.section`
  .title-container {
    background: ${(props) => props.theme.basic.secondary};
    padding: 66px 0;
    text-align: center;

    h1 {
      color: ${(props) => props.theme.basic.whiteLight};
      font-family: Lato, sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 22px;
      line-height: 26px;
      letter-spacing: 0.03em;
    }
  }

  .image-container {
    margin-top: -36px;
    margin-bottom: 36px;
  }
  .text-container {
    margin: 0 2rem 4rem 2rem;
  }
  .back-icon {
    border-radius: 50%;
    padding: 6px;
    background: ${(props) => props.theme.basic.primary};

    position: absolute;
    bottom: 0;
    left: 0;
    vertical-align: bottom;
    svg {
      font-size: 12px;
    }
    ${mediaQuery.afterTablet} {
      position: relative;
      margin-right: 1.5rem;
      vertical-align: bottom;
    }
  }

`;
