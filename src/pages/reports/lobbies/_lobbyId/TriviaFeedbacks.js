import React, { useEffect, useState } from "react";
import { useTranslation } from "../../../../hooks";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { isEmpty } from "lodash";
import { Image } from "../../../../components/common/Image";
import { config } from "../../../../firebase";

export const TriviaFeedbacks = (props) => {
  const { t } = useTranslation("pages.reports.trivia");

  const [commentsAmount, setCommentsAmount] = useState([]);

  useEffect(() => {
    let _commentsAmount = 0;

    props.feedbacks.map((feedback) => {
      if (!isEmpty(feedback.comment)) _commentsAmount += 1;
    });

    setCommentsAmount(_commentsAmount);
  }, [props.feedbacks]);

  return (
    <div className="p-4 lg:p-8 grid lg:grid-cols-[2fr_1fr_1fr] gap-4 mx-auto max-w-[1300px]">
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

        <div className="overflow-auto">
          {props.feedbacks.map((feedback) =>
            feedback.comment ? (
              <div className="p-4">
                <div className="font-[700] text-[12px] leading-[14px] text-blackDarken mb-[5px]">
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
          <div className="w-[80px] h-[80px]">
            <CircularProgressbar
              value={66}
              strokeWidth={50}
              counterClockwise={true}
              styles={buildStyles({
                strokeLinecap: "butt",
                pathColor: '#5AEEA2',
                trailColor: '#956DFC',
                rotation: 0.05
              })}
            />
          </div>
          <div>
            <div>

            </div>
            <div>

            </div>
          </div>
        </div>
      </div>

      <div className="bg-whiteLight rounded-[4px] shadow-[2px_2px_4px_rgba(0,0,0,0.25)] h-[160px]">
        <div className="flex items-center justify-between py-2 px-4 border-whiteDark border-b-[1px] w-full h-[40px]">
          <div className="text-[18px] leading-[22px] font-[700]  text-grayLight ">{t("play-again")}</div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-whiteLight rounded-[4px] shadow-[2px_2px_4px_rgba(0,0,0,0.25)] h-[160px]">
        <div className="flex items-center justify-between py-2 px-4 border-whiteDark border-b-[1px] w-full h-[40px]">
          <div className="text-[18px] leading-[22px] font-[700]  text-grayLight ">{t("have-fun")}</div>
        </div>
        <div className="w-full h-[120px] ">
          <div className="flex items-center justify-between max-w-[90%] h-full mx-auto">
            <Image
              src={`${config.storageUrl}/resources/score-icons/score-0.svg`}
              width="42px"
              height="42px"
              size="contain"
              borderRadius="50%"
              margin="0"
            />
            <Image
              src={`${config.storageUrl}/resources/score-icons/score-1.svg`}
              width="42px"
              height="42px"
              size="contain"
              borderRadius="50%"
              margin="0"
            />
            <Image
              src={`${config.storageUrl}/resources/score-icons/score-2.svg`}
              width="42px"
              height="42px"
              size="contain"
              borderRadius="50%"
              margin="0"
            />
            <Image
              src={`${config.storageUrl}/resources/score-icons/score-3.svg`}
              width="42px"
              height="42px"
              size="contain"
              borderRadius="50%"
              margin="0"
            />
            <Image
              src={`${config.storageUrl}/resources/score-icons/score-4.svg`}
              width="42px"
              height="42px"
              size="contain"
              borderRadius="50%"
              margin="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
