import React, { useState, useEffect } from "reactn";
import { Progress } from "antd";
import { useTranslation } from "../../../../hooks";
import { ModalUserAnswers } from "./ModalUserAnswers";
import defaultTo from "lodash/defaultTo";
import mapKeys from "lodash/mapKeys";

export const TriviaUsers = (props) => {
  const { t } = useTranslation("pages.reports.trivia");

  const [tab, setTab] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [isVisibleModalAnswers, setIsVisibleModalAnswers] = useState(false);
  const [needHelp, setNeedHelp] = useState([]);
  const [droppedOut, setDroppedOut] = useState([]);

  useEffect(() => {
    setDroppedOut(props.users.filter((user) => user.hasExited));

    const _needHelp = [];

    defaultTo(props.users, []).map((user, index) => {
      user.correctPercentage = Math.round(
        ((user.stats?.correct ? user.stats?.correct.length : 0) / props.questions.length) * 100
      );

      if (user.correctPercentage <= 20) _needHelp.push(user);
    });

    setNeedHelp(_needHelp);
  }, []);

  const calculateHits = (user) => {
    if (user.stats?.correct) return Math.round((user.stats?.correct.length / props.questions?.length) * 100);

    return 0;
  };

  const getUserRanking = (user) => {
    const userRanking = props.ranking.find((rank) => rank.userId === user.id);

    if (!userRanking) return "-";

    return userRanking.rank;
  };

  const unansweredQuestions = (user) => {
    const answeredQuestions = props.answers.filter((answer) => answer.userId === user.id);

    return props.questions.length - answeredQuestions.length;
  };

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
            {`${t("need-help")} (${needHelp.length})`}
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
            <tr className="w-full bg-whiteDark grid items-center grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] h-[60px] border-b-[1px] border-grayLighten px-4">
              <th className="text-left">{t("name")}</th>
              <th>{t("email")}</th>
              <th>{t("ranking")}</th>
              <th>{t("hits")}</th>
              <th>{t("unanswered")}</th>
              <th>{t("points")}</th>
              <th>{t("answers")}</th>
            </tr>
          </thead>
          <tbody>
            {(tab === 0 ? props.users : tab === 1 ? needHelp : droppedOut).map((user, index) => (
              <tr
                className="w-full bg-whiteLight grid items-center grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] h-[60px] px-4"
                key={user.id}
              >
                <td className="text-left text-blackDarken text-[14px] leading-[17px] font-[400]">{user.nickname}</td>
                <td className="text-center text-blackDarken text-[14px] leading-[17px] font-[400]">
                  {user.email ?? "-"}
                </td>
                <td className="text-center text-blackDarken text-[14px] leading-[17px] font-[400]">
                  {getUserRanking(user)}
                </td>
                <td className="text-blackDarken text-[14px] leading-[17px] font-[400] flex items-center justify-center gap-2">
                  <Progress
                    type="circle"
                    showInfo={false}
                    percent={calculateHits(user)}
                    width={20}
                    strokeWidth={20}
                    strokeColor="#56EEA5"
                    trailColor="#FB4646"
                  />
                  <span className="text-blackDarken text-[14px] leading-[17px] font-[800]">{calculateHits(user)}%</span>
                </td>
                <td className="text-center text-blackDarken text-[14px] leading-[17px] font-[400]">
                  {unansweredQuestions(user)}
                </td>
                <td className="text-blackDarken text-[14px] leading-[17px] font-[400] flex items-center justify-center gap-2">
                  {user.score.toFixed(2)}
                </td>
                <td
                  className="text-secondary text-[14px] leading-[17px] font-[400] flex items-center justify-center gap-2 underline cursor-pointer"
                  onClick={() => {
                    setCurrentUser(user);
                    setIsVisibleModalAnswers(true);
                  }}
                >
                  {t("see-answers")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
