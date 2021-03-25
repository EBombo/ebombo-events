import React from "react";
import { useHistory } from "react-router";
import { ContainerWelcomeToBombo } from "../../styles/pages/landing";
import get from "lodash/get";
import { ButtonBombo } from "../../components";

export const SliderContainer = (props) => {
  const history = useHistory();

  return (
    <ContainerWelcomeToBombo
      background={props.slider.sliderImageUrlThumb}
      backgroundPhone={get(
        props,
        "slider.sliderImageUrlMobileThumb",
        props.slider.sliderImageUrlThumb
      )}
    >
      <div className="container-wrapper-welcome">
        <div className="container-text-welcome">
          <div className="wrapper-title">
            <div className="title">{get(props, "slider.titleSlider", "")}</div>
          </div>
          <div className="item-sub-title">
            <span>{get(props, "slider.descriptionSlider", "")}</span>
          </div>

          <ButtonBombo
            type="primary"
            margin="0"
            width="200px"
            onClick={() => history.push(`${props.slider.buttonLinkSlider}`)}
          >
            {get(props, "slider.buttonTextSlider", "")}
          </ButtonBombo>
        </div>
      </div>
    </ContainerWelcomeToBombo>
  );
};
