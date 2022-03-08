import React, { useEffect, useState } from "reactn";
import { darkTheme } from "../../../../../theme";
import dynamic from "next/dynamic";
import get from "lodash/get";
import { Image } from "../../../../../components/common/Image";
import { config, firestoreRoulette } from "../../../../../firebase";
import styled from "styled-components";
import { snapshotToArray } from "../../../../../utils";
import { TextArea } from "../../../../../components/form";

const FortuneWheel = dynamic(() => import("../../../../../components/common/FortuneWheel"), { ssr: false });

export const RouletteView = (props) => {
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [mustSpin, setMustSpin] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!props.game) return;

    const fetchOptions = async () => {
      const optionsQuery = await firestoreRoulette.collection("games").doc(props.game.id).collection("options").get();

      const _options = snapshotToArray(optionsQuery);

      setOptions(_options.map((option) => option.option));
    };

    fetchOptions();
  }, []);

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
    <div className="w-full bg-secondary bg-pattern">
      <div className="grid gap-4 m-2 p-2 bg-[#221545] rounded-[4px] bg-opacity-50 md:m-8 md:p-8 md:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col items-center justify-center md:justify-start md:items-start">
          <div className="text-['Lato'] font-bold text-[15px] leading-[18px] my-4 text-whiteDark">
            Ruleta (vista previa)
          </div>
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

          {!props.game?.isLive && (
            <div className="w-full">
              <div className="p-4 bg-gray rounded-[6px] box-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] my-4">
                <div className="text-['Lato'] font-[500] text-[14px] leading-[17px] text-blackDarken">
                  Participantes
                </div>
                <TextArea
                  id="options"
                  defaultValue={options.join("\n") ?? "Escribe\n" + "Cada\n" + "Nombre\n" + "en una linea\n" + "unica"}
                  disabled={true}
                  name="options"
                  rows="6"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="text-['Lato'] font-bold text-[15px] leading-[18px] my-4 text-whiteDark">Colores:</div>
          <div className="grid grid-cols-[1fr_1fr] gap-4">
            <div className="color">
              <div className="text-['Lato'] font-[500] text-[13px] leading-[16px] text-whiteLight mb-2">Boder</div>
              <div className="flex items-center">
                <ColorBlock color={get(props.game, "outerBorder", "")} />
                <div className="border border-grayLighten h-[36px] px-4 ml-[5px] text-['Encode Sans'] text-[13px] leading-[16px] text-whiteLight flex items-center rounded-[4px] font-bold">
                  {get(props.game, "outerBorder", "").toUpperCase()}
                </div>
              </div>
            </div>
            <div className="color">
              <div className="text-['Lato'] font-[500] text-[13px] leading-[16px] text-whiteLight mb-2">
                Linea Separadora
              </div>
              <div className="flex items-center">
                <ColorBlock color={get(props.game, "lineColor", "")} />
                <div className="border border-grayLighten h-[36px] px-4 ml-[5px] text-['Encode Sans'] text-[13px] leading-[16px] text-whiteLight flex items-center rounded-[4px] font-bold">
                  {get(props.game, "lineColor", "").toUpperCase()}
                </div>
              </div>
            </div>
            <div className="color">
              <div className="text-['Lato'] font-[500] text-[13px] leading-[16px] text-whiteLight mb-2">Título</div>
              <div className="flex items-center">
                <ColorBlock color={get(props.game, "colorPrimary", "")} />
                <div className="border border-grayLighten h-[36px] px-4 ml-[5px] text-['Encode Sans'] text-[13px] leading-[16px] text-whiteLight flex items-center rounded-[4px] font-bold">
                  {get(props.game, "colorPrimary", "").toUpperCase()}
                </div>
              </div>
            </div>
            <div className="color">
              <div className="text-['Lato'] font-[500] text-[13px] leading-[16px] text-whiteLight mb-2">Números</div>
              <div className="flex items-center">
                <ColorBlock color={get(props.game, "colorSecondary", "")} />
                <div className="border border-grayLighten h-[36px] px-4 ml-[5px] text-['Encode Sans'] text-[13px] leading-[16px] text-whiteLight flex items-center rounded-[4px] font-bold">
                  {get(props.game, "colorSecondary", "").toUpperCase()}
                </div>
              </div>
            </div>
            <div className="color">
              <div className="text-['Lato'] font-[500] text-[13px] leading-[16px] text-whiteLight mb-2">Textos</div>
              <div className="flex items-center">
                <ColorBlock color={get(props.game, "text", "")} />
                <div className="border border-grayLighten h-[36px] px-4 ml-[5px] text-['Encode Sans'] text-[13px] leading-[16px] text-whiteLight flex items-center rounded-[4px] font-bold">
                  {get(props.game, "text", "").toUpperCase()}
                </div>
              </div>
            </div>
            <div className="color">
              <div className="text-['Lato'] font-[500] text-[13px] leading-[16px] text-whiteLight mb-2">Botón</div>
              <div className="flex items-center">
                <ColorBlock color={get(props.game, "button", "")} />
                <div className="border border-grayLighten h-[36px] px-4 ml-[5px] text-['Encode Sans'] text-[13px] leading-[16px] text-whiteLight flex items-center rounded-[4px] font-bold">
                  {get(props.game, "buttonColor", "").toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray rounded-[6px] box-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] my-4">
            <div className="text-['Lato'] font-[500] text-[14px] leading-[17px] text-blackDarken">Premios</div>

            <div className="h-[56px] w-full bg-whiteLight p-2 grid grid-cols-[150px_auto] gap-2 items-center rounded-[10px] my-4">
              <div className="h-[32px] bg-gray flex items-center rounded-[3px] px-4">Laptop Acer</div>
              <Image
                src={`${config.storageUrl}/resources/laptop.svg`}
                width="51px"
                height="32px"
                size="contain"
                borderRadius="6px"
              />
            </div>

            <div className="h-[56px] w-full bg-whiteLight p-2 grid grid-cols-[150px_auto] gap-2 items-center rounded-[10px] my-4">
              <div className="h-[32px] bg-gray flex items-center rounded-[3px] px-4">Laptop Acer</div>
              <Image
                src={`${config.storageUrl}/resources/laptop.svg`}
                width="51px"
                height="32px"
                size="contain"
                borderRadius="6px"
              />
            </div>

            <div className="h-[56px] w-full bg-whiteLight p-2 grid grid-cols-[150px_auto] gap-2 items-center rounded-[10px] my-4">
              <div className="h-[32px] bg-gray flex items-center rounded-[3px] px-4">Laptop Acer</div>
              <Image
                src={`${config.storageUrl}/resources/laptop.svg`}
                width="51px"
                height="32px"
                size="contain"
                borderRadius="6px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ColorBlock = styled.div`
  width: 29px;
  height: 36px;
  background: ${(props) => (props.color ? props.color : props.theme.basic.whiteLight)};
  border: 1px solid ${(props) => props.theme.basic.grayLight};
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 3px;
`;
