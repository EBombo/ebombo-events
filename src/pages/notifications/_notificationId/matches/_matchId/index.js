import React, { useEffect, useRef, useState } from "reactn";
import styled from "styled-components";
import defaultTo from "lodash/defaultTo";
import isEmpty from "lodash/isEmpty";
import { Desktop, Tablet } from "../../../../../utils";
import { EventInfo, GeneralInfo } from "../../../../../components";
import { Chat } from "../../../../../components/chat/Chat";
import {
  dateToTimeMarker,
  dateToTimeMarkerSimple,
} from "../../../../../utils/convertor";
import { Steps } from "./Steps";
import moment from "moment";
import { useHistory } from "react-router";

const interval = 1000;

export const Match = (props) => {
  const history = useHistory();
  let currentInterval = useRef(null);

  const [matchTime, setMatchTime] = useState("00:00");
  const [claimTime, setClaimTime] = useState("00:00");
  const [matchCancelTime, setMatchCancelTime] = useState("00:00");

  useEffect(() => {
    if (!isEmpty(props.match)) {
      currentInterval.current && clearInterval(currentInterval.current);
      currentInterval.current = createInterval();
      return;
    }
    currentInterval.current && clearInterval(currentInterval.current);
  }, [props.match]);

  const createInterval = () =>
    setInterval(() => {
      if (isEmpty(props.match)) return;

      //MATCH TIME
      const countDown = dateToTimeMarker({
        initial: moment(props.match.finishAt.toDate()),
      });
      setMatchTime(countDown);

      //CLAIM TIME
      if (props.match.hasClaim) {
        const claimStill = moment(props.match.claimFinishAt.toDate());
        const timeClaim = moment(claimStill).diff(moment());

        const newTimeClaim = moment.duration(timeClaim);

        const minutesClaim =
          newTimeClaim.minutes() < 10
            ? "0" + newTimeClaim.minutes()
            : newTimeClaim.minutes();
        const secondsClaim =
          newTimeClaim.seconds() < 10
            ? "0" + newTimeClaim.seconds()
            : newTimeClaim.seconds();

        setClaimTime(minutesClaim + ":" + secondsClaim);
      }

      if (props.match.cancelAt) {
        setMatchCancelTime(
          dateToTimeMarkerSimple({
            initial: moment(props.match.cancelAt.toDate()),
          })
        );
      }
    }, interval);

  if (isEmpty(props.match))
    return (
      <ContainerMatchEmpty>
        No tienes encuentros en juego por el momento
      </ContainerMatchEmpty>
    );

  return (
    <>
      <Desktop>
        <ContainerDesktop>
          <div className="match-info">
            <Steps
              {...props}
              currentMatch={props.match}
              matchTime={matchTime}
              claimTime={claimTime}
              matchCancelTime={matchCancelTime}
            />
            <EventInfo match={props.match} {...props} />
            <GeneralInfo />
          </div>
          <div className="chat-container">
            <Chat chatId={defaultTo(props.match.id, "public")} />
          </div>
        </ContainerDesktop>
      </Desktop>
      <Tablet>
        <ContainerTablet>
          <div className="match-info">
            <Steps
              {...props}
              currentMatch={props.match}
              matchTime={matchTime}
              claimTime={claimTime}
              matchCancelTime={matchCancelTime}
            />
            <EventInfo match={props.match} {...props} />
          </div>
          <div className="chat-container">
            <Chat chatId={defaultTo(props.match.id, "public")} />
          </div>
          <GeneralInfo />
        </ContainerTablet>
      </Tablet>
    </>
  );
};

const ContainerMatchEmpty = styled.div`
  color: ${(props) => props.theme.basic.white};
  font-size: 14px;
  font-weight: normal;
  text-align: left;
  margin: 1rem;
`;

const ContainerDesktop = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 3fr 1fr;
  height: 100vh;

  .chat-container {
    background: ${(props) => props.theme.basic.blackDarken};
  }
`;

const ContainerTablet = styled.div`
  .chat-container {
    background: ${(props) => props.theme.basic.blackDarken};
  }
`;
