import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "../../../../hooks";
import { isEmpty } from "lodash";
import { Image } from "../../../../components/common/Image";
import { config } from "../../../../firebase";
import { Bar, Pie } from "react-chartjs-2";
import { ModalAnswers } from "./ModalAnswers";

//WARNING: SI ELIMINAS ESTE IMPORT CAUSA UN UNDEFINED EN LA DEPENDENCIA react-chartjs-2.
import { Chart as ChartJS } from "chart.js/auto";

const LobbyFeedbacks = (props) => {
  const { t } = useTranslation("pages.reports.trivia");

  const [commentsAmount, setCommentsAmount] = useState([]);
  const [usersWithNoProblems, setUsersWithNoProblems] = useState(0);
  const [usersWithProblems, setUsersWithProblems] = useState(0);
  const [willPlayAgain, setWillPlayAgain] = useState(0);
  const [wontPlayAgain, setWontPlayAgain] = useState(0);
  const [mayPlayAgain, setMayPlayAgain] = useState(0);
  const [reviewScore, setReviewScore] = useState(0);
  const [isVisibleModalAnswers, setIsVisibleModalAnswers] = useState(false);
  const [currentAnswers, setCurrentAnswers] = useState("couldPlay");

  useEffect(() => {
    const calculateUsersExperience = () => {
      let _commentsAmount = 0;

      let totalUsersWithoutProblem = 0;

      let totalUsersWillPlayAgain = 0;
      let totalUsersWontPlayAgain = 0;
      let totalUsersMayPlayAgain = 0;

      let reviewScore = 0;

      props.feedbacks.map((feedback) => {
        reviewScore += feedback.reviewScore;

        if (!isEmpty(feedback.comment)) _commentsAmount += 1;

        if (feedback.playWithoutProblem) totalUsersWithoutProblem += 1;

        if (feedback.playAgain === "yes") totalUsersWillPlayAgain += 1;
        if (feedback.playAgain === "no") totalUsersWontPlayAgain += 1;
        if (feedback.playAgain === "maybe") totalUsersMayPlayAgain += 1;
      });

      setCommentsAmount(_commentsAmount);

      setUsersWithNoProblems(totalUsersWithoutProblem);
      setUsersWithProblems(props.feedbacks.length - totalUsersWithoutProblem);

      setWillPlayAgain(totalUsersWillPlayAgain);
      setWontPlayAgain(totalUsersWontPlayAgain);
      setMayPlayAgain(totalUsersMayPlayAgain);

      setReviewScore(Math.round(reviewScore / props.feedbacks.length));
    };

    calculateUsersExperience();
  }, [props.feedbacks]);

  const pieData = {
    datasets: [
      {
        backgroundColor: ["#5AEEA2", "#956DFC"],
        borderColor: "black",
        borderWidth: 0,
        data: [usersWithNoProblems, usersWithProblems],
      },
    ],
  };

  const barData = {
    labels: [t("no"), t("maybe"), t("yes")],
    datasets: [
      {
        backgroundColor: ["#FB4A44", "#F4C10B", "#5EED9D"],
        data: [wontPlayAgain, mayPlayAgain, willPlayAgain],
      },
    ],
  };

  const pieChart = useMemo(() => <Pie data={pieData} />, [usersWithNoProblems, usersWithProblems]);

  const barChart = useMemo(
    () => <Bar data={barData} options={{ aspectRatio: "2" }} />,
    [willPlayAgain, wontPlayAgain, mayPlayAgain]
  );

  return (
    <div className="p-4 lg:p-8 grid lg:grid-cols-[2fr_1fr_1fr] gap-4 mx-auto max-w-[1300px]">
      {isVisibleModalAnswers && (
        <ModalAnswers
          currentAnswers={currentAnswers}
          isVisibleModalAnswers={isVisibleModalAnswers}
          setIsVisibleModalAnswers={setIsVisibleModalAnswers}
          {...props}
        />
      )}
      <div className="lg:row-span-2 bg-whiteLight rounded-[4px] shadow-[2px_2px_4px_rgba(0,0,0,0.25)] min-h-[160px ">
        <div className="flex items-center justify-between py-2 px-4 border-whiteDark border-b-[1px] w-full h-[40px]">
          <div className="text-[18px] leading-[22px] font-[700]  text-grayLight">{t("comments")}</div>
          <div className="flex items-center gap-2">
            <div className="text-[18px] leading-[22px] font-[700]  text-grayLight">
              {t("answers")}: {commentsAmount}
            </div>
            <Image
              src={`${config.storageUrl}/resources/user-icon.svg`}
              height="15px"
              width="15px"
              margin="0"
              size="contain"
              filter="invert(0%) sepia(0%) saturate(7500%) hue-rotate(338deg) brightness(91%) contrast(109%)"
            />
          </div>
        </div>

        <div className="max-h-[280px] overflow-auto">
          {commentsAmount === 0 && (
            <div className="h-full text-blackDarken text-[16px] leading-[19px] font-[400] h-[120px] min-w-[100%] flex items-center justify-center p-2 text-center ">
              {t("empty-comments")}
            </div>
          )}
          {commentsAmount > 0 &&
            props.feedbacks.map((feedback) =>
              feedback.comment ? (
                <div className="p-4" key={feedback.id}>
                  <div className="font-[700] text-[12px] leading-[14px] text-blackDarken mb-[5px] text-blackDarken">
                    {feedback.user?.nickname}
                  </div>
                  <div
                    className="bg-primary color-white rounded-b-[10px] rounded-tr-[10px] text-white p-2"
                    key={feedback.id}
                  >
                    {feedback.comment}
                  </div>
                </div>
              ) : null
            )}
        </div>
      </div>

      <div className="bg-whiteLight rounded-[4px] shadow-[2px_2px_4px_rgba(0,0,0,0.25)] h-[160px]">
        <div className="flex items-center justify-between py-2 px-4 border-whiteDark border-b-[1px] w-full h-[40px]">
          <div className="text-[18px] leading-[22px] font-[700]  text-grayLight ">{t("could-play")}</div>
        </div>
        <div className="h-[120px] p-2 flex items-center justify-center gap-4">
          <div className="w-[100px] h-[100px]">{pieChart}</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-[15px] w-[15px] rounded-[4px] bg-[#5AEEA2]" />
                <div className="text-[14px] leading-[17px] text-blackDarken">{t("yes")}</div>
              </div>
              <div className="text-[14px] leading-[17px] text-blackDarken">
                {Math.round((usersWithNoProblems / (props.feedbacks.length > 0 ? props.feedbacks.length : 1)) * 100)}%
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-[15px] w-[15px] rounded-[4px] bg-primary" />
                <div className="text-[14px] leading-[17px] text-blackDarken">{t("no")}</div>
              </div>
              <div className="text-[14px] leading-[17px] text-blackDarken">
                {Math.round(
                  ((props.feedbacks.length - usersWithNoProblems) /
                    (props.feedbacks.length > 0 ? props.feedbacks.length : 1)) *
                    100
                )}
                %
              </div>
            </div>

            <div
              className="text-[#C4ADFF] underline cursor-pointer text-[14px] leading-[17px]"
              onClick={() => {
                setCurrentAnswers("couldPlay");
                setIsVisibleModalAnswers(true);
              }}
            >
              {t("see-answers")}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-whiteLight rounded-[4px] shadow-[2px_2px_4px_rgba(0,0,0,0.25)] h-[160px]">
        <div className="flex items-center justify-between py-2 px-4 border-whiteDark border-b-[1px] w-full h-[40px]">
          <div className="text-[18px] leading-[22px] font-[700]  text-grayLight ">{t("play-again")}</div>
        </div>

        <div className="h-[120px] p-2 flex items-center justify-center gap-4">
          <div className="w-[150px]">{barChart}</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-[15px] w-[15px] rounded-[4px] bg-[#5AEEA2]" />
                <div className="text-[14px] leading-[17px] text-blackDarken">{t("yes")}</div>
              </div>
              <div className="text-[14px] leading-[17px] text-blackDarken">
                {Math.round((willPlayAgain / (props.feedbacks.length > 0 ? props.feedbacks.length : 1)) * 100) ?? 0}%
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-[15px] w-[15px] rounded-[4px] bg-[#F4C10B]" />
                <div className="text-[14px] leading-[17px] text-blackDarken">{t("maybe")}</div>
              </div>
              <div className="text-[14px] leading-[17px] text-blackDarken">
                {Math.round((mayPlayAgain / (props.feedbacks.length > 0 ? props.feedbacks.length : 1)) * 100)}%
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-[15px] w-[15px] rounded-[4px] bg-[#FB4A44]" />
                <div className="text-[14px] leading-[17px] text-blackDarken">{t("no")}</div>
              </div>
              <div className="text-[14px] leading-[17px] text-blackDarken">
                {Math.round((wontPlayAgain / (props.feedbacks.length > 0 ? props.feedbacks.length : 1)) * 100)}%
              </div>
            </div>

            <div
              className="text-[#C4ADFF] underline cursor-pointer text-[14px] leading-[17px]"
              onClick={() => {
                setCurrentAnswers("playAgain");
                setIsVisibleModalAnswers(true);
              }}
            >
              {t("see-answers")}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-whiteLight rounded-[4px] shadow-[2px_2px_4px_rgba(0,0,0,0.25)] h-[160px]">
        <div className="flex items-center justify-between py-2 px-4 border-whiteDark border-b-[1px] w-full h-[40px]">
          <div className="text-[18px] leading-[22px] font-[700]  text-grayLight ">{t("have-fun")}</div>
        </div>
        <div className="w-full h-[120px] ">
          <div className="flex items-center justify-between max-w-[400px] h-full mx-auto">
            <Image
              src={`${config.storageUrl}/resources/score-icons/score-0.svg`}
              width="42px"
              height="42px"
              size="contain"
              borderRadius="50%"
              margin="0"
              border={reviewScore === 0 ? "3px solid #956DFC" : "none"}
            />
            <Image
              src={`${config.storageUrl}/resources/score-icons/score-1.svg`}
              width="42px"
              height="42px"
              size="contain"
              borderRadius="50%"
              margin="0"
              border={reviewScore === 1 ? "3px solid #956DFC" : "none"}
            />
            <Image
              src={`${config.storageUrl}/resources/score-icons/score-2.svg`}
              width="42px"
              height="42px"
              size="contain"
              borderRadius="50%"
              margin="0"
              border={reviewScore === 2 ? "3px solid #956DFC" : "none"}
            />
            <Image
              src={`${config.storageUrl}/resources/score-icons/score-3.svg`}
              width="42px"
              height="42px"
              size="contain"
              borderRadius="50%"
              margin="0"
              border={reviewScore === 3 ? "3px solid #956DFC" : "none"}
            />
            <Image
              src={`${config.storageUrl}/resources/score-icons/score-4.svg`}
              width="42px"
              height="42px"
              size="contain"
              borderRadius="50%"
              margin="0"
              border={reviewScore === 4 ? "3px solid #956DFC" : "none"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyFeedbacks;
