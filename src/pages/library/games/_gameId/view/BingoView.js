import React from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { config } from "../../../../../firebase";
import { bingoCard } from "../../../../../components/common/DataList";
import { CardContainer } from "../Bingo";
import { Image } from "../../../../../components/common/Image";

export const BingoView = (props) => {
  return (
    <div className="w-full bg-cover bg-no-repeat bg-secondary bg-pattern">
      <div className="grid gap-4 m-2 p-2 bg-[#221545] rounded-[4px] bg-opacity-50 md:m-8 md:p-8 md:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col items-center justify-center">
          <div className="text-['Lato'] font-bold text-[15px] leading-[18px] my-4 text-whiteDark">
            Cartilla (vista previa)
          </div>
          <div className="w-full mx-auto">
            <CardContainer
              backgroundColor={get(props.game, "backgroundColor", "")}
              backgroundImage={get(props.game, "backgroundImg", "")}
              titleColor={get(props.game, "titleColor", "")}
              blocksColor={get(props.game, "blocksColor", "")}
              numberColor={get(props.game, "numberColor", "")}
            >
              <div className="card-title">{get(props.game, "title", "")}</div>
              <table>
                <thead className="thead">
                  <tr>
                    <th>{get(props.game, "letters.b", "")}</th>
                    <th>{get(props.game, "letters.i", "")}</th>
                    <th>{get(props.game, "letters.n", "")}</th>
                    <th>{get(props.game, "letters.g", "")}</th>
                    <th>{get(props.game, "letters.o", "")}</th>
                  </tr>
                </thead>
                <tbody className="tbody">
                  {bingoCard.map((arrNums, index) => (
                    <tr key={`key-${index}`}>
                      {arrNums.map((num, idx) => (
                        <td key={`key-${num}-${idx}`}>{num}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContainer>
          </div>
        </div>
        <div>
          <div className="text-['Lato'] font-bold text-[15px] leading-[18px] my-4 text-whiteDark">Colores:</div>
          <div className="grid grid-cols-[1fr_1fr] gap-4">
            <div className="color">
              <div className="text-['Lato'] font-[500] text-[13px] leading-[16px] text-whiteLight mb-2">Fondo</div>
              {get(props.game, "backgroundImg", null) ? (
                <div className="name">(Imagen)</div>
              ) : (
                <div className="flex items-center">
                  <ColorBlock color={get(props.game, "backgroundColor", "")} />
                  <div className="border border-grayLighten h-[36px] px-4 ml-[5px] text-['Encode Sans'] text-[13px] leading-[16px] text-whiteLight flex items-center rounded-[4px] font-bold">
                    {get(props.game, "backgroundColor", "").toUpperCase()}
                  </div>
                </div>
              )}
            </div>
            <div className="color">
              <div className="text-['Lato'] font-[500] text-[13px] leading-[16px] text-whiteLight mb-2">Bloques</div>
              <div className="flex items-center">
                <ColorBlock color={get(props.game, "blocksColor", "")} />
                <div className="border border-grayLighten h-[36px] px-4 ml-[5px] text-['Encode Sans'] text-[13px] leading-[16px] text-whiteLight flex items-center rounded-[4px] font-bold">
                  {get(props.game, "blocksColor", "").toUpperCase()}
                </div>
              </div>
            </div>
            <div className="color">
              <div className="text-['Lato'] font-[500] text-[13px] leading-[16px] text-whiteLight mb-2">Título</div>
              <div className="flex items-center">
                <ColorBlock color={get(props.game, "titleColor", "")} />
                <div className="border border-grayLighten h-[36px] px-4 ml-[5px] text-['Encode Sans'] text-[13px] leading-[16px] text-whiteLight flex items-center rounded-[4px] font-bold">
                  {get(props.game, "titleColor", "").toUpperCase()}
                </div>
              </div>
            </div>
            <div className="color">
              <div className="text-['Lato'] font-[500] text-[13px] leading-[16px] text-whiteLight mb-2">Números</div>
              <div className="flex items-center">
                <ColorBlock color={get(props.game, "numberColor", "")} />
                <div className="border border-grayLighten h-[36px] px-4 ml-[5px] text-['Encode Sans'] text-[13px] leading-[16px] text-whiteLight flex items-center rounded-[4px] font-bold">
                  {get(props.game, "numberColor", "").toUpperCase()}
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
