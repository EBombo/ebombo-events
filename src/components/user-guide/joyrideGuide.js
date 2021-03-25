import {darkTheme} from "../../styles/theme";
import Joyride from "react-joyride";
import React, {useGlobal, useState} from "reactn";
import {guideOneContent, handleGuideOne} from "./guideOne";
import {useHistory} from "react-router-dom";

export const JoyrideGuide = (props) => {
  const history = useHistory();
  const [runGuide, setRunGuide] = useGlobal("setRunGuide");
  const [openSidebarMobile, setOpenSidebarMobile] = useGlobal(
    "openSidebarMobile"
  );
  const [stepIndex, setStepIndex] = useGlobal("stepIndex");
  const [steps] = useState(guideOneContent);

  return (
    <Joyride
      callback={(data) =>
        handleGuideOne({
          data,
          setRunGuide,
          openSidebarMobile,
          setOpenSidebarMobile,
          setStepIndex,
          history,
        })
      }
      run={runGuide}
      steps={steps}
      styles={stylesGuide}
      stepIndex={stepIndex}
      continuous={true}
      showProgress={true}
      showSkipButton={false}
      hideBackButton={true}
      spotlightClicks={false}
      scrollToFirstStep={true}
      disableCloseOnEsc={true}
      disableOverlayClose={true}
    />
  );
};

const stylesGuide = {
  options: {
    backgroundColor: darkTheme.basic.blackLighten,
    textColor: darkTheme.basic.white,
    width: 250,
    zIndex: 10000,
  },
  beacon: {
    display: "none",
  },
  buttonNext: {
    border: 0,
    outline: "none",
    lineHeight: 1,
    fontSize: 11,
    padding: 8,
    backgroundColor: darkTheme.basic.primary,
    borderRadius: 4,
  },
  buttonSkip: {
    fontSize: 11,
  },
  tooltip: {
    boxSizing: "border-box",
    padding: 5,
  },
  tooltipTitle: {
    fontSize: 12,
    margin: "0",
    padding: "0 10px",
    color: darkTheme.basic.primary,
    textAlign: "left",
  },
  tooltipContent: {
    fontSize: 12,
    padding: "0 10px",
    color: darkTheme.basic.white,
    textAlign: "left",
  },
  tooltipFooter: {
    marginTop: 5,
  },
  buttonClose: {
    height: 8,
    padding: 8,
    right: 0,
    top: 0,
    width: 8,
    display: "none",
  },
  floater: {
    arrow: {
      color: darkTheme.basic.blackLighten,
    },
  },
};
