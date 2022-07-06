import React, { useEffect, useState } from "reactn";
import { useTranslation } from "../../../../hooks";
import { Progress, Tooltip } from "antd";
import { Image } from "../../../../components/common/Image";
import { config } from "../../../../firebase";
import moment from "moment";
import { ButtonAnt } from "../../../../components/form";
import isEmpty from "lodash/isEmpty";
import defaultTo from "lodash/defaultTo";
import capitalize from "lodash/capitalize";
import { ArrowRightOutlined } from "@ant-design/icons";
import { ModalRanking } from "./ModalRanking";
import { useRouter } from "next/router";

export const BingoResume = (props) => {
  const router = useRouter();

  const { lobbyId } = router.query;

  const { t } = useTranslation("pages.reports.bingo");

  const [loading, setLoading] = useState(false);
  const [isVisibleModalWinners, setIsVisibleModalWinners] = useState(false);
  const [droppedOut, setDroppedOut] = useState([]);
  const [usersWithEmptyCard, setUsersWithEmptyCard] = useState([]);
  const [patternIndex, setPatternIndex] = useState(0);

  useEffect(() => {
    const mapUsers = () => {
      const _droppedOut = [];
      const _usersWithEmptyCard = [];

      props.users.map((user) => {
        if (user.hasExited) _droppedOut.push(user);

        if (user.markedCard) _usersWithEmptyCard.push(user);
      });

      setDroppedOut(_droppedOut);
      setUsersWithEmptyCard(_usersWithEmptyCard)
    };

    mapUsers();
  }, [lobbyId, props.users]);

  const calculateDurationTime = (startAt, endAt) => {
    const startTime = moment(startAt.toDate(), "DD-MM-YYYY hh:mm:ss");
    const endTime = moment(endAt.toDate(), "DD-MM-YYYY hh:mm:ss");

    const hoursDiff = endTime.diff(startTime, "hours");

    const minutesDiff = endTime.diff(startTime, "minutes");

    const secondsDiff = endTime.diff(startTime, "seconds");

    if (hoursDiff <= 0)
      return `${minutesDiff < 10 ? `0${minutesDiff}` : minutesDiff}:${
        secondsDiff % 60 < 10 ? `0${secondsDiff % 60}` : secondsDiff % 60
      } minutes`;

    return `${hoursDiff}:${minutesDiff < 10 ? `0${minutesDiff}` : minutesDiff}:${
      secondsDiff % 60 < 10 ? `0${secondsDiff % 60}` : secondsDiff % 60
    } hours`;
  };

  return (
    <div className="p-4 lg:p-8 grid lg:grid-cols-[2fr_1fr_1fr] gap-4 mx-auto max-w-[1300px]">
      {isVisibleModalWinners && (
        <ModalRanking
          lobby={props.lobby}
          isVisibleModalWinners={isVisibleModalWinners}
          setIsVisibleModalWinners={setIsVisibleModalWinners}
          {...props}
        />
      )}
      <div className="bg-whiteLight p-4 md:p-8 flex items-center justify-start gap-8 rounded-[4px] shadow-[2px_2px_4px_rgba(0,0,0,0.25)] h-[160px]">
        <Image
          src={`${config.storageUrl}/resources/icons/glasses-face.svg`}
          desktopWidth="60px"
          desktopHeight="60px"
          width="45px"
          height="45px"
          size="contain"
          margin="0"
        />
        <div>
          <div className="font-[900] text-[24px] leading-[29px] text-blackDarken mb-4">{`${props.users?.length} ${t(
            "participants"
          )}`}</div>
          <ButtonAnt
            onClick={async () => {
              setLoading(true);
              await router.push(
                `/library/games/${props.lobby?.game?.id}/view?adminGameId=${props.lobby?.game?.adminGame?.id}`
              );
              setLoading(false);
            }}
            loading={loading}
            disabled={loading}
          >
            {t("play-again-btn")}
          </ButtonAnt>
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
          <div className="text-blackDarken text-[16px] leading-[19px] font-[700]">{props.users?.length}</div>
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
            <div className="text-blackDarken text-[16px] leading-[19px] font-[400]">{t("times-played")}</div>
          </div>
          <div className="text-blackDarken text-[16px] leading-[19px] font-[700]">{props.lobby?.winners?.length}</div>
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
            {calculateDurationTime(props.lobby?.startAt, props.lobby?.updateAt)}
          </div>
        </div>
      </div>

      <div className="bg-whiteLight p-4 flex items-center justify-between rounded-[4px] shadow-[2px_2px_4px_rgba(0,0,0,0.25)] h-[160px]">
        <Image src={`${config.storageUrl}/resources/trophy.svg`} width="49px" height="49px" size="contain" margin="0" />
        <ButtonAnt color="secondary" onClick={() => setIsVisibleModalWinners(true)}>
          {t("see-podium")}
        </ButtonAnt>
      </div>

      <div className="bg-whiteLight rounded-[4px] shadow-[2px_2px_4px_rgba(0,0,0,0.25)] h-[190px]">
        <div className="flex items-center justify-between py-2 px-4 h-[40px] border-b-[1px] border-whiteDark w-full">
          <div className="text-[18px] leading-[22px] font-[700] text-grayLight">{t("patterns")}</div>
          <div className="text-[18px] leading-[22px] font-[700] text-grayLight">({props.lobby?.winners?.length})</div>
        </div>
        <div className="w-full h-[150px] p-2 md:p-4 relative">
          {props.lobby?.winners?.map((winner, index) => (
            <div className={`w-full ${index === patternIndex ? "block" : "hidden"}`} key={winner.id}>
              <div className="flex items-center gap-4">
                <table className="p-2 w-[100px] bg-secondary border-separate border-spacing-[5px] rounded-[5px]">
                  <thead>
                    <tr>
                      <th className="text-white text-[12px] leading-[13px] font-[700] aspect-square">
                        {props.lobby.game?.letters?.b}
                      </th>
                      <th className="text-white text-[12px] leading-[13px] font-[700] aspect-square">
                        {props.lobby.game?.letters?.i}
                      </th>
                      <th className="text-white text-[12px] leading-[13px] font-[700] aspect-square">
                        {props.lobby.game?.letters?.n}
                      </th>
                      <th className="text-white text-[12px] leading-[13px] font-[700] aspect-square">
                        {props.lobby.game?.letters?.g}
                      </th>
                      <th className="text-white text-[12px] leading-[13px] font-[700] aspect-square">
                        {props.lobby.game?.letters?.o}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {JSON.parse(defaultTo(winner.pattern, "[]")).map((element, index) => (
                      <tr key={index}>
                        {element.map((value, idx) => (
                          <td
                            className={`w-[20%] aspect-square bg-secondary rounded-[3px]`}
                            onClick={() => {
                              if (!props.isEdit) return;
                              editPattern(index, index_);
                            }}
                            key={`${value}-${idx}`}
                          >
                            <div className="aspect-square flex items-center justify-center bg-secondaryDark">
                              <div
                                className={`${
                                  value && "w-[60%] aspect-square bg-whiteDark flex justify-center rounded-[50%]"
                                }`}
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-[5px]">
                    <div className="text-[12px] leading-[14px] font-[700] text-blackDarken">{t("called-balls")}:</div>
                    <div className="text-[12px] leading-[14px] font-[400] text-blackDarken">
                      {winner.lastPlays?.length}/75
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-[5px]">
                      <div className="text-[12px] leading-[14px] font-[700] text-blackDarken">{t("duration")}:</div>
                      <div className="text-[12px] leading-[14px] font-[400] text-blackDarken">RESPUESTA</div>
                    </div>

                    <div className="flex flex-col gap-[5px]">
                      <div className="text-[12px] leading-[14px] font-[700] text-blackDarken">{t("time")}:</div>
                      <div className="text-[12px] leading-[14px] font-[400] text-blackDarken">RESPUESTA</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div
            className="cursor-pointer text-grayLight text-[12px] leading-[14px] absolute bottom-[10px] right-[10px] flex items-center"
            onClick={() =>
              setPatternIndex((value) => {
                if (value + 1 > props.lobby?.winners?.length - 1) return 0;
                return value + 1;
              })
            }
          >
            {t("next")}
            <ArrowRightOutlined color="#666666" fontSize="12px" />
          </div>
        </div>
      </div>

      <div className="bg-whiteLight rounded-[4px] shadow-[2px_2px_4px_rgba(0,0,0,0.25)] h-[190px]">
        <div className="flex items-center justify-between py-2 px-4 border-whiteDark border-b-[1px] w-full h-[40px]">
          <div className="text-[18px] leading-[22px] font-[700]  text-grayLight ">{`${t("empty-cards")} `}</div>
          <Tooltip placement="bottomRight" title={t("need-help-tooltip")} color="#382079">
            <Image
              src={`${config.storageUrl}/resources/question2-icon.svg`}
              width="19px"
              height="19px"
              size="contain"
              margin="0"
            />
          </Tooltip>
        </div>

        {isEmpty(usersWithEmptyCard) ? (
          <div className="text-blackDarken text-[16px] leading-[19px] font-[400] h-[160px] min-w-[100%] flex items-center justify-center p-2 text-center">
            {t("empty-card-message")}
          </div>
        ) : (
          <div className="h-[120px] overflow-auto p-2 flex flex-col gap-[10px]">
            {[].map((user, index) => (
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

      <div className="bg-whiteLight rounded-[4px] shadow-[2px_2px_4px_rgba(0,0,0,0.25)] h-[190px]">
        <div className="flex items-center justify-between py-2 px-4 border-whiteDark border-b-[1px] w-full h-[40px]">
          <div className="text-[18px] leading-[22px] font-[700]  text-grayLight ">{t("dropped-out")}</div>
          <Tooltip placement="bottomRight" title={t("dropped-out-tooltip")} color="#382079">
            <Image
              src={`${config.storageUrl}/resources/question2-icon.svg`}
              width="19px"
              height="19px"
              size="contain"
              margin="0"
            />
          </Tooltip>
        </div>
        {isEmpty(droppedOut) ? (
          <div className="text-blackDarken text-[16px] leading-[19px] font-[400] h-[150px] min-w-[100%] flex items-center justify-center p-2 text-center">
            {t("dropped-out-message")}
          </div>
        ) : (
          <div className="h-[150px] overflow-auto p-2 flex flex-col gap-[10px]">
            {droppedOut.map((user, index) => (
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
    </div>
  );
};
