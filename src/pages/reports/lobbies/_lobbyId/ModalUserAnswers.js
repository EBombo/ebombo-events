import React from "reactn";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { useTranslation } from "../../../../hooks";
import { config } from "../../../../firebase";
import { Image } from "../../../../components/common/Image";
import { Progress } from "antd";

export const ModalUserAnswers = (props) => {
  const { t } = useTranslation("pages.reports.trivia");

  const calculateHits = () => {
    const correctAnswers = props.user.stats?.correct ? props.user.stats?.correct.length : 0;
    return Math.round((correctAnswers / props.questions.length) * 100);
  };

  const getAnswer = (question) => {
    const answer = props.answers.filter(
      (answer) => answer.questionId === question.id && answer.userId === props.user.id
    );

    if (answer.length === 0) return "-";

    return answer[0]?.answer;
  };

  return (
    <ModalContainer
      background={"transparent"}
      footer={false}
      closable={true}
      onCancel={() => props.setIsVisibleModalAnswers(false)}
      visible={props.isVisibleModalAnswers}
      padding="0"
      width="800px"
    >
      <div className="pt-8 px-8 text-blackDarken text-[20px] leading-[24px] font-[700] lg:text-[30px] lg:leading-[36px]">
        {props.user.nickname}
      </div>
      <div className="flex items-center justify-between pt-8 px-8 ">
        <div className="flex items-center gap-4">
          <Progress
            type="circle"
            showInfo={false}
            percent={calculateHits()}
            width={70}
            strokeWidth={10}
            strokeColor="#56EEA5"
            trailColor="#FB4646"
          />
          <div className="flex flex-col gap-[5px]">
            <span className="text-blackDarken text-[25px] leading-[30px] lg:text-[36px] lg:text-[43px] font-[900]">
              {calculateHits()}%
            </span>
            <span className="text-blackDarken text-[12px] leading-[14px] lg:text-[14px] lg:text-[17px] font-[900]">
              correctas
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[90vw] overflow-auto mx-auto no-scrollbar">
        <div className="p-4 lg:p-8 gap-4 mx-auto min-w-[700px] max-w-[875px] w-full">
          <table className="w-full rounded-[6px] overflow-hidden shadow-[0_0_7px_rgb(0,0,0,0.25)]">
            <thead className="w-full">
              <tr className="w-full bg-whiteDark grid items-center grid-cols-[80px_3fr_1fr_1fr_1fr] h-[60px] border-b-[1px] border-grayLighten px-4">
                <th className="text-blackDarken">{t("number")}</th>
                <th className="text-secondary">{t("question")}</th>
                <th className="text-secondary">{t("type")}</th>
                <th className="text-secondary">{t("answer")}</th>
                <th className="text-secondary">{t("correct-answer")}</th>
              </tr>
            </thead>
            <tbody>
              {props.questions.map((question, index) => (
                <tr
                  className="w-full bg-whiteLight grid items-center grid-cols-[80px_3fr_1fr_1fr_1fr] h-[60px] px-4"
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
                  <td className="text-blackDarken text-[14px] leading-[17px] font-[400] flex items-center justify-center gap-2 text-center">
                    {getAnswer(question)}
                  </td>
                  <td className="text-blackDarken text-[14px] leading-[17px] font-[400] flex items-center justify-center gap-2">
                    <Image
                      src={`${config.storageUrl}/resources/${
                        props.user.stats?.correct && props.user.stats?.correct.includes(question.id)
                          ? "checked"
                          : "wrong"
                      }.svg`}
                      width="25px"
                      height="25px"
                      size="contain"
                      margin="0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ModalContainer>
  );
};
