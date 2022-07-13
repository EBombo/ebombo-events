import React, { useEffect, useState } from "reactn";
import { useTranslation } from "../../../../hooks";
import { ModalUserAnswers } from "./ModalUserAnswers";
import isEmpty from "lodash/isEmpty";

export const BingoUsers = (props) => {
  const { t } = useTranslation("pages.reports.bingo");

  const [tab, setTab] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [isVisibleModalAnswers, setIsVisibleModalAnswers] = useState(false);
  const [usersWithEmptyCard, setUsersWithEmptyCard] = useState([]);
  const [droppedOut, setDroppedOut] = useState([]);

  useEffect(() => {
    const mapUsers = () => {
      const _droppedOut = [];
      const _usersWithEmptyCard = [];

      props.users.map((user) => {
        if (user.hasExited) _droppedOut.push(user);

        let roundIsEmpty = false;
        user.rounds.map((round) => {
          if (isEmpty(round.myWinningCard)) roundIsEmpty = true;
        });

        if (roundIsEmpty) _usersWithEmptyCard.push(user);
      });

      setDroppedOut(_droppedOut);
      setUsersWithEmptyCard(_usersWithEmptyCard);
    };

    mapUsers();
  }, [props.users]);

  return (
    <div className="max-w-[95vw] overflow-auto mx-auto no-scrollbar">
      {isVisibleModalAnswers && (
        <ModalUserAnswers
          user={currentUser}
          isVisibleModalAnswers={isVisibleModalAnswers}
          setIsVisibleModalAnswers={setIsVisibleModalAnswers}
          {...props}
        />
      )}
      <div className="py-4 lg:py-8 gap-4 mx-auto min-w-[700px] w-full">
        <div className="h-[50px] rounded-t-[6px] flex items-center bg-whiteLight">
          <div
            className={`px-8 h-full flex items-center text-center font-[700] text-[14px] leading-[17px] cursor-pointer ${
              tab === 0 ? "text-secondary border-secondary border-b-[2px]" : "text-blackDarken"
            }`}
            onClick={() => setTab(0)}
          >
            {`${t("all")} (${props.users.length})`}
          </div>
          <div
            className={`px-8 h-full flex items-center text-center font-[700] text-[14px] leading-[17px] cursor-pointer ${
              tab === 1 ? "text-secondary border-secondary border-b-[2px]" : "text-blackDarken"
            }`}
            onClick={() => setTab(1)}
          >
            {`${t("empty-cards")} (${usersWithEmptyCard.length})`}
          </div>
          <div
            className={`px-8 h-full flex items-center text-center font-[700] text-[14px] leading-[17px] cursor-pointer ${
              tab === 2 ? "text-secondary border-secondary border-b-[2px]" : "text-blackDarken"
            }`}
            onClick={() => setTab(2)}
          >
            {`${t("dropped-out")} (${droppedOut.length})`}
          </div>
        </div>
        <table className="w-full rounded-b-[6px] overflow-hidden shadow-[0_0_7px_rgb(0,0,0,0.25)]">
          <thead className="w-full">
            <tr className="w-full bg-whiteDark grid items-center grid-cols-[1fr_2fr_1fr_1fr_1fr] h-[60px] border-b-[1px] border-grayLighten px-4">
              <th className="text-left">{t("name")}</th>
              <th>{t("email")}</th>
              <th>{t("times-played")}</th>
              <th>{t("victories")}</th>
              <th>{t("cards")}</th>
            </tr>
          </thead>
          <tbody>
            {(tab === 0 ? props.users : tab === 1 ? usersWithEmptyCard : droppedOut).map((user, index) => (
              <tr
                className="w-full bg-whiteLight grid items-center grid-cols-[1fr_2fr_1fr_1fr_1fr] h-[60px] px-4"
                key={user.id}
              >
                <td className="text-left text-blackDarken text-[14px] leading-[17px] font-[400]">{user.nickname}</td>
                <td className="text-center text-blackDarken text-[14px] leading-[17px] font-[400]">
                  {user.email ?? "-"}
                </td>
                <td className="text-center text-blackDarken text-[14px] leading-[17px] font-[400]">
                  {user.rounds?.length}
                </td>
                <td className="text-center text-blackDarken text-[14px] leading-[17px] font-[400]">
                  {props.lobby?.winners?.includes(user.id)}
                </td>
                <td
                  className="text-secondary text-[14px] leading-[17px] font-[400] flex items-center justify-center gap-2 underline cursor-pointer"
                  onClick={() => {
                    setCurrentUser(user);
                    setIsVisibleModalAnswers(true);
                  }}
                >
                  {t("see-cards")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
