import React from "reactn";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { darkTheme } from "../../../../theme";

export const ModalWinners = (props) => {
  return (
    <ModalContainer
      background={darkTheme.basic.whiteLight}
      footer={false}
      closable={true}
      onCancel={() => props.setIsVisibleModalWinners(false)}
      visible={props.isVisibleModalWinners}
      padding="0"
    >
      <table className="w-full">
        <thead className="w-full">
          <tr className="w-full grid items-center grid-cols-[2fr_1fr] h-[60px] bg-whiteDark border-y-[1px] border-grayLighten px-4">
            <th className="font-[900] text-[16px] leading-[18px] text-blackDarken text-left">Nombre</th>
            <th className="font-[900] text-[16px] leading-[18px] text-blackDarken">Premio</th>
          </tr>
        </thead>
        <tbody>
          {props.lobby.winners?.map((winner, index) => (
            <tr
              key={`winner-${index}`}
              className="w-full grid items-center grid-cols-[2fr_1fr] h-[60px] bg-whiteLight border-b-[1px] border-whiteDark px-4"
            >
              <td className="text-blackDarken font-[600] text-[16px] leading-[18px]">{winner.nickname}</td>
              <td className="flex items-center justify-center text-blackDarken font-[600] text-[16px] leading-[18px]">
                {winner.award?.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ModalContainer>
  );
};
