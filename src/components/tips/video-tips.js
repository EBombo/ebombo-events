import React, {createRef, useEffect, useGlobal, useState} from "reactn";
import styled from "styled-components";
import {homeGlobal, mediaQuery} from "../../styles/constants";
import Carousel from "antd-mobile/es/carousel";

export const VideoTips = (props) => {
  const refHowToPlay = createRef();
  const [settings] = useGlobal("settings");

  const [carouselIndex] = useState(0);

  const scrollByHash = () =>
    refHowToPlay.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  useEffect(() => {
    props.hash && props.hash === "#how-to-play" && scrollByHash();
  }, [props.hash]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ContainerVideoTips ref={refHowToPlay} {...props}>
      <div className="content-video-tips">
        <div className="title-video-tips">
          ¿QUÉ ES
          <span>EBOMBO</span>?
        </div>
        <Carousel
          selectedIndex={carouselIndex}
          cellSpacing={10}
          className="carousel-video-tips"
          dots={false}
          infinite
        >
          <div className="item-video-tips" key={0}>
            <iframe
              className="item-tip-video"
              src={settings.videoUrl}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </Carousel>
      </div>
    </ContainerVideoTips>
  );
};

const ContainerVideoTips = styled.div`
  margin: 1rem 0;

  ${mediaQuery.afterTablet} {
    margin: 0;
  }

  .content-video-tips {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .slider {
      .slider-decorator-0 {
        position: relative !important;
      }
    }

    .title-video-tips {
      font-size: 12px;
      font-weight: normal;
      color: ${(props) => props.theme.basic.white};
      margin: 10px 0 !important;
      text-align: left;
      width: 100%;
      height: auto;
      display: flex;
      align-items: center;
      span {
        font-size: ${homeGlobal.font_size_primary};
        margin-left: 5px;
        color: ${(props) => props.theme.basic.action};
      }
    }
    .carousel-video-tips {
      background: ${(props) => props.theme.basic.blackDarken};
      .slider-list {
        ${mediaQuery.afterDesktop} {
          height: ${(props) =>
            props.height ? props.height : "60vh !important"};
        }
      }
      .item-video-tips {
        width: 100%;
        height: 320px;
        padding: 2rem 2rem;
        display: inline-block;
        text-align: center;
        ${mediaQuery.afterTablet} {
          height: auto;
          min-height: auto;
          padding: 1rem 1rem;
        }
        .item-tip-img {
          width: 100%;
          max-width: 300px;
          height: auto;
          background: ${(props) => props.theme.basic.blackDarken};
          color: ${(props) => props.theme.basic.white};
        }
        .item-tip-video {
          height: 100% !important;
          width: 90%;
          background: ${(props) => props.theme.basic.blackDarken};
          color: ${(props) => props.theme.basic.white};
          ${mediaQuery.afterDesktop} {
            height: ${(props) =>
              props.height ? props.height : "60vh !important"};
          }
        }
      }
    }
  }
`;
