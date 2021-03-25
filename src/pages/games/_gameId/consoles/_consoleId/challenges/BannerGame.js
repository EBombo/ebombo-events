import React from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { mediaQuery } from "../../../../../../styles/constants";
import { EBomboRules } from "../../../../../../components";
import { useState } from "react";
import { ModalContainer } from "../../../../../../components/common/ModalContainer";

export const BannerGame = (props) => {
  const [isVisibleEBomboRules, setIsVisibleEBomboRules] = useState(false);

  return (
    <Container
      imageUrl={get(props, "game.homeImageDskUrlThumb", "")}
      borderColor={get(props, "game.color")}
    >
      <div className="banner-information">{get(props, "game.name")}</div>
      <ModalContainer
        footer={null}
        visible={isVisibleEBomboRules}
        onCancel={() => setIsVisibleEBomboRules(false)}
      >
        <EBomboRules />
      </ModalContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100px;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center right;
  position: relative;
  ::after {
    content: "";
    position: absolute;
    width: 100%;
    bottom: -3px;
    border-top: 3px solid ${(props) => props.borderColor}80;
  }

  ${mediaQuery.afterTablet} {
    height: 225px;
  }

  .banner-information {
    display: flex;
    align-items: center;
    height: 100%;
    font-size: 22px;
    padding-left: 20px;
    font-weight: bold;
    color: ${(props) => props.theme.basic.whiteDarken};

    ${mediaQuery.afterTablet} {
      font-size: 24px;
    }
  }
`;
