import React, { useEffect, useState } from "react";
import { useTranslation } from "../../../../hooks";
import { Tooltip } from "antd";
import { isEmpty } from "lodash";
import { comment } from "postcss";
import { Image } from "../../../../components/common/Image";
import { config } from "../../../../firebase";

export const TriviaFeedbacks = (props) => {
  const { t } = useTranslation("pages.reports.trivia");

  const [comments, setComments] = useState([]);

  useEffect(() => {
    const _comments = props.feedbacks.map((feedback) => {
      if (!isEmpty(feedback.comment)) return comment;
    });

    setComments(_comments);
  }, [props.feedbacks]);

  return (
    <div className="p-4 lg:p-8 grid lg:grid-cols-[2fr_1fr_1fr] gap-4 mx-auto max-w-[1300px]">

      <div className="row-span-2 bg-whiteLight rounded-[4px] shadow-[2px_2px_4px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between py-2 px-4 border-whiteDark border-b-[1px] w-full h-[40px]">
          <div className="text-[18px] leading-[22px] font-[700]  text-grayLight">{t("comments")}</div>
          <div className="flex items-center gap-2">
            <div className="text-[18px] leading-[22px] font-[700]  text-grayLight">
              {t("answers")}: {comments.length}
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

        <div>
          {
            comments.map(comment => (
              <div className="bg-primary color-white rounded-[10px]" key={commend.id}>
                {comment.comment}
              </div>
            ))
          }
        </div>
      </div>

      <div></div>

      <div></div>

      <div></div>
    </div>
  );
};
