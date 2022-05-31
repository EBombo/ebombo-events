import React, { useEffect, useState } from "reactn";
import { useTranslation } from "../../../../hooks";
import { Progress, Tooltip } from "antd";
import { Image } from "../../../../components/common/Image";
import { config } from "../../../../firebase";
import moment from "moment";
import { ButtonAnt } from "../../../../components/form";
import isEmpty from "lodash/isEmpty";
import defaultTo from "lodash/defaultTo";
import mapKeys from "lodash/mapKeys";
import capitalize from "lodash/capitalize";
import { ArrowRightOutlined } from "@ant-design/icons";
import { ModalWinners } from "./ModalWinners";

export const TriviaResume = (props) => {
  const { t } = useTranslation("pages.reports.trivia");

  const [hardQuestions, setHardQuestion] = useState([]);
  const [needHelp, setNeedHelp] = useState([]);
  const [didNotEnd, setDidNotEnd] = useState([]);
  const [currentHardQuestion, setCurrentHardQuestion] = useState(0);
  const [hitPercentage, setHitPercentage] = useState(0);
  const [isVisibleModalWinners, setIsVisibleModalWinners] = useState(false);

  useEffect(() => {
    calculateStats();
  }, [props.users, props.questions]);

  const calculateStats = () => {
    const _questions = {};
    const _needHelp = [];

    props.questions.map((question) => (_questions[question.id] = 0));

    let _hitPercentage = 0;

    defaultTo(props.users, []).map((user, index) => {
      defaultTo(user.stats?.incorrect, [])
        .concat(defaultTo(user.stats?.noAnswer, []))
        .map((questionId) => (_questions[questionId] += 1));

      user.correctPercentage = Math.round(
        ((user.stats?.correct ? user.stats?.correct.length : 0) / props.questions.length) * 100
      );

      index > 0
        ? (_hitPercentage = user.correctPercentage)
        : (_hitPercentage = (_hitPercentage + user.correctPercentage) / 2);

      if (user.correctPercentage <= 20) {
        _needHelp.push(user);
      }
    });

    setHitPercentage(_hitPercentage);

    const totalUsers = props.user?.length;

    const _hardQuestions = [];

    mapKeys(_questions, (value, key) => {
      if (value >= totalUsers * 0.2) {
        const result = props.questions.filter((question) => question.id === key);
        _hardQuestions.push({ ...result[0], percentage: Math.round(((totalUsers - value) / totalUsers) * 100) });
      }
    });

    setHardQuestion(_hardQuestions);
    setNeedHelp(_needHelp);
  };

  return (
    <div className="p-4 lg:p-8 grid lg:grid-cols-[2fr_1fr_1fr] gap-4 mx-auto max-w-[1300px]">
      {isVisibleModalWinners && (
        <ModalWinners
          lobby={props.lobby}
          isVisibleModalWinners={isVisibleModalWinners}
          setIsVisibleModalWinners={setIsVisibleModalWinners}
          {...props}
        />
      )}
      <div className="bg-whiteLight p-4 flex items-center justify-between rounded-[4px] shadow-[2px_2px_4px_rgba(0,0,0,0.25)] h-[160px]">
        <div className="font-[900] text-[24px] leading-[29px] text-blackDarken">{t("hit-percentage")}</div>
        <div>
          <Progress type="circle" percent={hitPercentage} strokeWidth={12} strokeColor="#56EEA5" />
        </div>
      </div>

      <div className="bg-whiteLight flex flex-col items-center justify-between rounded-[4px] shadow-[2px_2px_4px_rgba(0,0,0,0.25)] h-[160px]">
        <div className="flex items-center justify-between p-2 border-whiteDark border-b-[1px] w-full h-[33%]">
          <div className="flex gap-4">
            <Image
              src={`${config.storageUrl}/resources/user-icon.svg`}
              width="19px"
              height="19px"
              size="contain"
              margin="0"
            />
            <div className="text-blackDarken text-[16px] leading-[19px] font-[400]">{t("players")}</div>
          </div>
          <div className="text-blackDarken text-[16px] leading-[19px] font-[700]">{props.users.length}</div>
        </div>

        <div className="flex items-center justify-between p-2 border-whiteDark border-b-[1px] w-full h-[33%]">
          <div className="flex gap-4">
            <Image
              src={`${config.storageUrl}/resources/question-icon.svg`}
              width="19px"
              height="19px"
              size="contain"
              margin="0"
            />
            <div className="text-blackDarken text-[16px] leading-[19px] font-[400]">{t("questions")}</div>
          </div>
          <div className="text-blackDarken text-[16px] leading-[19px] font-[700]">{props.questions.length}</div>
        </div>

        <div className="flex items-center justify-between p-2 border-whiteDark border-b-[1px] w-full h-[33%]">
          <div className="flex gap-4">
            <Image
              src={`${config.storageUrl}/resources/time-icon.svg`}
              width="19px"
              height="19px"
              size="contain"
              margin="0"
            />
            <div className="text-blackDarken text-[16px] leading-[19px] font-[400]">{t("time")}</div>
          </div>
          <div className="text-blackDarken text-[16px] leading-[19px] font-[700]">
            {moment(moment(props.lobby.startAt?.toDate())?.diff(moment(props.lobby.updateAt?.toDate()))).format(
              "h[h] m[m]"
            )}
          </div>
        </div>
      </div>

      <div className="bg-whiteLight p-4 flex items-center justify-between rounded-[4px] shadow-[2px_2px_4px_rgba(0,0,0,0.25)] h-[160px]">
        <Image src={`${config.storageUrl}/resources/trophy.svg`} width="49px" height="49px" size="contain" margin="0" />
        <ButtonAnt color="secondary" onClick={() => setIsVisibleModalWinners(true)}>
          {t("see-podium")}
        </ButtonAnt>
      </div>

      <div className="bg-whiteLight rounded-[4px] shadow-[2px_2px_4px_rgba(0,0,0,0.25)] h-[160px]">
        <div className="text-[18px] leading-[22px] font-[700] py-2 px-4 border-whiteDark border-b-[1px] w-full text-grayLight h-[40px]">
          {`${t("hard-questions")} (${hardQuestions.length})`}
        </div>
        {isEmpty(hardQuestions) ? (
          <div className="text-blackDarken text-[16px] leading-[19px] font-[400] h-[120px] min-w-[100%] flex items-center justify-center p-2 text-center">
            {t("hard-questions-empty-message")}
          </div>
        ) : (
          <div className="w-full h-[120px] p-2 relative">
            {hardQuestions.map((question, index) => (
              <div
                className={`grid grid-cols-[auto_70px] items-center max-w-full ${
                  currentHardQuestion !== index && "hidden"
                }`}
                key={`${question.id}-${index}`}
              >
                <div className="flex flex-col gap-[5px]">
                  <div className="text-[16px] leading-[19px] font-[700] text-blackDarken">{question.question}</div>
                  <div className="text-[16px] leading-[19px] font-[400] text-blackDarken">{`Solo el ${question.percentage} de los jugadores respondieron bien esta pregunta`}</div>
                </div>
                <div className="flex items-center gap-1">
                  <Progress
                    type="circle"
                    showInfo={false}
                    percent={question?.percentage}
                    width={20}
                    strokeWidth={20}
                    strokeColor="#56EEA5"
                    trailColor="#FB4646"
                  />
                  <div className="text-blackDarken text-[14px] leading-[17px] font-[800]">{question?.percentage}%</div>
                </div>
              </div>
            ))}
            <div
              className="cursor-pointer text-grayLight text-[12px] leading-[14px] absolute bottom-[10px] right-[10px] flex items-center"
              onClick={() =>
                setCurrentHardQuestion((value) => {
                  if (value + 1 > hardQuestions.length - 1) return 0;
                  return value + 1;
                })
              }
            >
              {t("next")}
              <ArrowRightOutlined color="#666666" fontSize="12px" />
            </div>
          </div>
        )}
      </div>

      <div className="bg-whiteLight rounded-[4px] shadow-[2px_2px_4px_rgba(0,0,0,0.25)] h-[160px]">
        <div className="flex items-center justify-between py-2 px-4 border-whiteDark border-b-[1px] w-full h-[40px]">
          <div className="text-[18px] leading-[22px] font-[700]  text-grayLight ">
            {`${t("need-help")} (${needHelp.length})`}
          </div>
          <Tooltip
            placement="bottomRight"
            title="Respondieron incorrectamente menos del 20% de preguntas."
            color="#382079"
          >
            <Image
              src={`${config.storageUrl}/resources/question2-icon.svg`}
              width="19px"
              height="19px"
              size="contain"
              margin="0"
            />
          </Tooltip>
        </div>

        {isEmpty(needHelp) ? (
          <div className="text-blackDarken text-[16px] leading-[19px] font-[400] h-[120px] min-w-[100%] flex items-center justify-center p-2 text-center">
            {t("need-help-empty-message")}
          </div>
        ) : (
          <div className="h-[120px] overflow-auto p-2 flex flex-col gap-[10px]">
            {needHelp.map((user, index) => (
              <div className="flex items-center justify-between" key={`${user.id}-${index}`}>
                <div className="text-blackDarken text-[14px] leading-[16px] font-[400]">
                  {capitalize(user.nickname)}
                </div>
                <div className="flex items-center gap-2">
                  <Progress
                    type="circle"
                    showInfo={false}
                    percent={user.correctPercentage}
                    width={20}
                    strokeWidth={20}
                    strokeColor="#56EEA5"
                    trailColor="#FB4646"
                  />
                  <div className="text-blackDarken text-[14px] leading-[17px] font-[800]">
                    {user.correctPercentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-whiteLight rounded-[4px] shadow-[2px_2px_4px_rgba(0,0,0,0.25)] h-[160px]">
        <div className="flex items-center justify-between py-2 px-4 border-whiteDark border-b-[1px] w-full h-[40px]">
          <div className="text-[18px] leading-[22px] font-[700]  text-grayLight ">{t("didn't-end")}</div>
          <Tooltip
            placement="bottomRight"
            title="Se desconectaron antes de terminar. Se indica cuántas preguntas respondieron."
            color="#382079"
          >
            <Image
              src={`${config.storageUrl}/resources/question2-icon.svg`}
              width="19px"
              height="19px"
              size="contain"
              margin="0"
            />
          </Tooltip>
        </div>
        {isEmpty(didNotEnd) ? (
          <div className="text-blackDarken text-[16px] leading-[19px] font-[400] h-[120px] min-w-[100%] flex items-center justify-center p-2 text-center">
            {t("didn't-end-empty-message")}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};
