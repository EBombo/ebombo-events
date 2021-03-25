import React, {useGlobal, useState} from "reactn";
import get from "lodash/get";
import {Image} from "../common/Image";
import styled from "styled-components";
import isEmpty from "lodash/isEmpty";
import {Desktop, Tablet} from "../../utils";
import {allowBanner} from "../common/DataList";
import {Anchor} from "../common/Anchor";

export const Banner = (props) => {
  const [banners] = useGlobal("banners");
  const [isVisibleBannerTop, setIsVisibleBannerTop] = useState(true);
  const [isVisibleBannerBottom, setIsVisibleBannerBottom] = useState(true);

  if (
    !allowBanner.some((path) => window.location.href.includes(path)) ||
    isEmpty(banners)
  )
    return null;

  return props.isDesktop ? (
    <>
      {isEmpty(banners.bannerDesktopTop) &&
      isEmpty(banners.bannerDesktopBottom) ? null : (
        <Desktop>
          <BannersContainer>
            {!isEmpty(banners.bannerDesktopTop) && (
              <Image
                cursor="pointer"
                className="top-desktop"
                src={get(
                  banners,
                  "bannerDesktopTop.bannerDesktopTopUrl",
                  ""
                )}
                width="100%"
                height="auto"
                size="cover"
                style={{ margin: "0 0 40px 0" }}
                onClick={() =>
                  window.open(
                    get(banners, "bannerDesktopTop.link", ""),
                    "_blank"
                  )
                }
              />
            )}
            {!isEmpty(banners.bannerDesktopBottom) && (
              <Image
                cursor="pointer"
                src={get(
                  banners,
                  "bannerDesktopBottom.bannerDesktopBottomUrl",
                  ""
                )}
                width="100%"
                height="auto"
                size="cover"
                style={{ margin: 0 }}
                onClick={() =>
                  window.open(
                    get(banners, "bannerDesktopBottom.link", ""),
                    "_blank"
                  )
                }
              />
            )}
          </BannersContainer>
        </Desktop>
      )}
    </>
  ) : (
    <>
      {isEmpty(banners.bannerMobileTop) &&
      isEmpty(banners.bannerMobileBottom) ? null : (
        <Tablet>
          {!isEmpty(banners.bannerMobileTop) && isVisibleBannerTop && (
            <Image
              cursor="pointer"
              src={get(banners, "bannerMobileTop.bannerMobileTopUrlThumb", "")}
              size="cover"
              height="auto"
              onClick={() =>
                window.open(get(banners, "bannerMobileTop.link", ""), "_blank")
              }
            >
              <Closed onClick={() => setIsVisibleBannerTop(false)} right="10px">
                x
              </Closed>
            </Image>
          )}
          {!isEmpty(banners.bannerMobileBottom) && isVisibleBannerBottom && (
            <BannerFixedContainer>
              <Closed onClick={() => setIsVisibleBannerBottom(false)}>x</Closed>
              <Image
                cursor="pointer"
                src={get(
                  banners,
                  "bannerMobileBottom.bannerMobileBottomUrlThumb",
                  ""
                )}
                size="cover"
                height="auto"
                width={"90%"}
                onClick={() =>
                  window.open(
                    get(banners, "bannerMobileBottom.link", ""),
                    "_blank"
                  )
                }
              />
            </BannerFixedContainer>
          )}
        </Tablet>
      )}
    </>
  );
};

const BannersContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 34px 16px;
`;

const Closed = styled(Anchor)`
  position: absolute;
  top: 0;
  right: ${(props) => props.right || "6%"};
`;

const BannerFixedContainer = styled.div`
  z-index: 1000;
  height: auto;
  width: 100%;
  position: fixed;
  bottom: 0;
`;
