import React, { useState } from "reactn";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { darkTheme } from "../../../../theme";
import { useTranslation } from "../../../../hooks";

export const ModalBingoRounds = (props) => {
  const { t } = useTranslation("pages.reports.bingo");

  const [tab, setTab] = useState(0);

  return (
    <ModalContainer
      background={darkTheme.basic.whiteLight}
      footer={false}
      closable={true}
      onCancel={() => props.setIsVisibleModal(false)}
      visible={props.isVisibleModal}
      padding="0"
    >
      <table className="w-full">
        <thead className="w-full">
          <tr className="w-full grid items-center grid-cols-[2fr_1fr_1fr] h-[60px] bg-whiteDark border-y-[1px] border-grayLighten px-4">
            <th className="font-[900] text-[16px] leading-[18px] text-blackDarken text-left">{t("name")}</th>
            <th className="font-[900] text-[16px] leading-[18px] text-blackDarken">{t("award")}</th>
            <th className="font-[900] text-[16px] leading-[18px] text-blackDarken">{t("card-percentage")}</th>
          </tr>
          <div className="w-full flex items-center px-4 h-[40px] bg-secondary">
            {(props.lobby.rounds ?? []).map((round, index) => (
              <div
                className={`font-[900] text-[16px] leading-[19px] cursor-pointer ${
                  tab === index ? "text-primaryLight" : "text-whiteDark"
                }`}
                onClick={() => setTab(index)}
              >
                {`${t("game")} ${index + 1}`}
              </div>
            ))}
          </div>
        </thead>
        <tbody>
          {props.users.map((user, index) => (
            <tr
              key={`winner-${index}`}
              className="w-full grid items-center grid-cols-[2fr_1fr] h-[60px] bg-whiteLight border-b-[1px] border-whiteDark px-4"
            >
              <td className="text-blackDarken font-[600] text-[16px] leading-[18px]">{user.nickname}</td>
              <td className="flex items-center justify-center text-blackDarken font-[600] text-[16px] leading-[18px]">
                -
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ModalContainer>
  );
};
