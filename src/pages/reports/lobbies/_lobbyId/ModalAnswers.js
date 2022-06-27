import React from "reactn";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { useTranslation } from "../../../../hooks";

export const ModalAnswers = (props) => {
  const { t } = useTranslation("pages.reports.trivia");

  return (
    <ModalContainer
      background={"transparent"}
      footer={false}
      closable={false}
      onCancel={() => props.setIsVisibleModalAnswers(false)}
      visible={props.isVisibleModalAnswers}
      padding="0"
    >
      <div className="flex items-center justify-between p-2">
        <div className="text-secondary font-[900] text-[19px] leading-[23px]">
          {props.currentAnswers === "couldPlay" ? t("could-play") : t("play-again")}
        </div>
        <div className="text-secondary font-[900] text-[19px] leading-[23px]">{`${props.feedbacks.length} ${t(
          "answers"
        )}`}</div>
      </div>
      <div className="max-h-[450px] overflow-auto">
        <table className="w-full ">
          <thead className="w-full">
            <tr className="w-full grid items-center grid-cols-[2fr_1fr] h-[60px] bg-whiteDark border-y-[1px] border-grayLighten px-4">
              <th className="font-[900] text-[16px] leading-[18px] text-blackDarken text-left">Nombre</th>
              <th className="font-[900] text-[16px] leading-[18px] text-secondary">Respuesta</th>
            </tr>
          </thead>
          <tbody>
            {props.feedbacks.map((feedback, index) => (
              <tr
                key={`winner-${index}`}
                className="w-full grid items-center grid-cols-[2fr_1fr] h-[60px] bg-whiteLight border-b-[1px] border-whiteDark px-4"
              >
                <td className="text-blackDarken font-[600] text-[16px] leading-[18px]">{`#${index + 1}   ${
                  feedback.user?.nickname
                }`}</td>
                <td className="flex items-center justify-center text-secondary font-[600] text-[16px] leading-[18px]">
                  <span
                    className={`${
                      props.currentAnswers === "couldPlay"
                        ? feedback.playWithoutProblem
                          ? "bg-[#5AEEA2]"
                          : "bg-[#FB4A44]"
                        : feedback.playAgain === "yes"
                        ? "bg-[#5AEEA2]"
                        : feedback.playAgain === "no"
                        ? "bg-[#FB4A44]"
                        : "bg-[#F4C10B]"
                    } px-4 py-2 rounded-[4px]`}
                  >
                    {props.currentAnswers === "couldPlay"
                      ? feedback.playWithoutProblem
                        ? t("yes")
                        : t("no")
                      : feedback.playAgain === "yes"
                      ? t("yes")
                      : feedback.playAgain === "no"
                      ? t("no")
                      : t("maybe")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModalContainer>
  );
};
