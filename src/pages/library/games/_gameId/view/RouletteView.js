import React, { useState } from "reactn";
import { ButtonAnt } from "../../../../../components/form";
import { Tablet } from "../../../../../constants";
import { darkTheme } from "../../../../../theme";
import dynamic from "next/dynamic";

const FortuneWheel = dynamic(() => import("../../../../../components/common/FortuneWheel"), { ssr: false });

export const RouletteView = (props) => {
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [mustSpin, setMustSpin] = useState(false);

  const data = [
    { option: "Sebastian", style: { backgroundColor: props.game?.colorPrimary, textColor: props.game?.text } },
    { option: "Pablo", style: { backgroundColor: props.game?.colorSecondary, textColor: props.game?.text } },
    { option: "Anthony", style: { backgroundColor: props.game?.colorPrimary, textColor: props.game?.text } },
    { option: "Mateo", style: { backgroundColor: props.game?.colorSecondary, textColor: props.game?.text } },
    { option: "Santiago", style: { backgroundColor: props.game?.colorPrimary, textColor: props.game?.text } },
    { option: "Gonzalo", style: { backgroundColor: props.game?.colorSecondary, textColor: props.game?.text } },
    { option: "Daniel", style: { backgroundColor: props.game?.colorPrimary, textColor: props.game?.text } },
    { option: "Carlos", style: { backgroundColor: props.game?.colorSecondary, textColor: props.game?.text } },
    { option: "Mauricio", style: { backgroundColor: props.game?.colorPrimary, textColor: props.game?.text } },
    { option: "Giovanni", style: { backgroundColor: props.game?.colorSecondary, textColor: props.game?.text } },
    { option: "Cesar", style: { backgroundColor: props.game?.colorPrimary, textColor: props.game?.text } },
    { option: "Carlos", style: { backgroundColor: props.game?.colorSecondary, textColor: props.game?.text } },
  ];

  return (
    <div className="p-4">
      <FortuneWheel
        setMustSpin={setMustSpin}
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        setPrizeNumber={setPrizeNumber}
        data={data}
        outerBorderColor={props.game?.outerBorder ?? darkTheme.basic.secondary}
        outerBorderWidth={20}
        radiusLineColor={props.game?.lineColor ?? darkTheme.basic.secondaryDark}
        radiusLineWidth={1}
        fontSize={12}
        buttonColor={props.game?.buttonColor ?? darkTheme.basic.gray}
        selector={props.game?.selector ?? darkTheme.basic.gray}
        onStopSpinning={() => {
          setMustSpin(false);
        }}
      />
      <Tablet>
        <div className="btn-container">
          <ButtonAnt onClick={props.createTokenToPlay}>Jugar</ButtonAnt>
        </div>
      </Tablet>
    </div>
  );
};
