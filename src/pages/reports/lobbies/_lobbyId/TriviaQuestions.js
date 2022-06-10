import React from "react";
import { useTranslation } from "../../../../hooks";
import { config } from "../../../../firebase";
import { Progress } from "antd";

export const TriviaQuestions = (props) => {
  const { t } = useTranslation("pages.reports.trivia");

  const calculateHits = (question) => {
    let count = 0;
    props.users.map((user) => {
      if (user.stats?.correct && user.stats?.correct.includes(question.id)) count += 1;
    });

    return count;
  };

  return (
    <div className="max-w-[90vw] overflow-auto mx-auto no-scrollbar">
      <div className="p-4 lg:p-8 gap-4 mx-auto min-w-[700px] max-w-[875px] w-full">
        <table className="w-full rounded-[6px] overflow-hidden shadow-[0_0_7px_rgb(0,0,0,0.25)]">
          <thead className="w-full">
            <tr className="w-full bg-whiteDark grid items-center grid-cols-[80px_3fr_1fr_1fr] h-[60px] border-b-[1px] border-grayLighten px-4">
              <th>{t("number")}</th>
              <th>{t("question")}</th>
              <th>{t("type")}</th>
              <th>{t("hits")}</th>
            </tr>
          </thead>
          <tbody>
            {props.questions.map((question, index) => (
              <tr
                className="w-full bg-whiteLight grid items-center grid-cols-[80px_3fr_1fr_1fr] h-[60px] px-4"
                key={question.id}
              >
                <td className="text-center text-blackDarken text-[14px] leading-[17px] font-[400]">{index + 1}</td>
                <td className="text-center text-blackDarken text-[14px] leading-[17px] font-[400]">
                  {question.question}
                </td>
                <td className="text-blackDarken text-[14px] leading-[17px] font-[400] flex items-center justify-center gap-2">
                  <img
                    src={`${config.storageUrl}/resources/${question.type}.svg`}
                    height={25}
                    width={25}
                    alt={`${question.type}-icon`}
                  />
                  {t(question.type)}
                </td>
                <td className="text-blackDarken text-[14px] leading-[17px] font-[400] flex items-center justify-center gap-2">
                  <Progress
                    type="circle"
                    showInfo={false}
                    percent={calculateHits(question)}
                    width={20}
                    strokeWidth={20}
                    strokeColor="#56EEA5"
                    trailColor="#FB4646"
                  />
                  <span className="text-blackDarken text-[14px] leading-[17px] font-[800]">
                    {calculateHits(question)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
