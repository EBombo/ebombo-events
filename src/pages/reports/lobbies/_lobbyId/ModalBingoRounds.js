import React, { useState } from "reactn";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { darkTheme } from "../../../../theme";
import { useTranslation } from "../../../../hooks";
import defaultTo from "lodash/defaultTo";
import { Progress } from "antd";

export const ModalBingoRounds = (props) => {
  const { t } = useTranslation("pages.reports.bingo");

  const [tab, setTab] = useState(1);

  const getNumberBoard = (board) => Object.keys(board).reduce((sum, key) => (board[key] ? [...sum, +key] : sum), []);

  const progress = (user) => {
    const round = props.rounds.find((round) => round.round === tab);
    if (!round) return;

    const userPattern = JSON.parse(user.rounds[tab - 1].card);
    const numberWinners = getNumberBoard(round.board ?? {});

    let hits = 0;
    let sizePattern = 0;

    let _numberWinners = props.lobby?.settings?.cardAutofill ? numberWinners : defaultTo(user.myWinningCard, []);

    JSON.parse(round.pattern).forEach((y, indexY) =>
      y.forEach((x, indexX) => {
        if (!!x) sizePattern++;
        if (!!x && _numberWinners.includes(userPattern[indexY][indexX])) hits++;
      })
    );

    const percentage = (hits / sizePattern) * 100;

    return parseInt((percentage || 0).toFixed(0));
  };

  return (
    <ModalContainer
      width={"700px"}
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
          <tr className="w-full flex items-center px-4 h-[40px] bg-secondary">
            {(props.rounds ?? []).map((round, index) => (
              <th
                className={`font-[900] text-[16px] leading-[19px] cursor-pointer ${
                  tab === index ? "text-primaryLight" : "text-whiteDark"
                }`}
                onClick={() => setTab(index + 1)}
                key={round.id}
              >
                {`${t("game")} ${index + 1}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.users.map((user, index) => (
            <tr
              key={user.id}
              className="w-full grid items-center grid-cols-[2fr_1fr] h-[60px] bg-whiteLight border-b-[1px] border-whiteDark px-4"
            >
              <td className="text-blackDarken font-[600] text-[16px] leading-[18px]">{user.nickname}</td>
              <td className="flex items-center justify-center text-blackDarken font-[600] text-[16px] leading-[18px] flex gap-2">
                <td>{progress(user)}%</td>
                <Progress type="circle" percent={progress(user)} width={40} strokeWidth={12} strokeColor="#56EEA5" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ModalContainer>
  );
};
