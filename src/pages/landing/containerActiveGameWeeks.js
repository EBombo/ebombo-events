import React, { useCallback, useEffect, useState, useGlobal } from "reactn";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import defaultTo from "lodash/defaultTo";
import orderBy from "lodash/orderBy";
import mapKeys from "lodash/mapKeys";
import moment from "moment";
import { useHistory } from "react-router-dom";

const interval = 1000;
let currentInterval;

export const ContainerActiveGameWeeks = () => {
  const history = useHistory();
  const [gameWeekTimes, setGameWeekTimes] = useState({});
  const [activeGameWeeks] = useGlobal("activeGameWeeks");
  const [leagues] = useGlobal("leagues");
  const [currentCurrency] = useGlobal("currentCurrency");

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  useEffect(() => {
    return () => (currentInterval = null);
  }, []);

  useEffect(() => {
    activeGameWeeks && timeRegressive(filterActiveGameWeeks(activeGameWeeks));
  }, [activeGameWeeks]);

  const filterActiveGameWeeks = (activeGameWeeks) =>
    defaultTo(activeGameWeeks, []).filter((gameWeek) => {
      if (get(gameWeek, "date.startDate._seconds", false))
        return moment().isBefore(moment.unix(gameWeek.date.startDate._seconds));
      return moment().isBefore(
        get(gameWeek, "date.startDate", moment()).toDate()
      );
    });

  const timeRegressive = async (gameWeeks) => {
    const countdown_ = await countdown(gameWeeks);
    setGameWeekTimes(countdown_);
  };

  useEffect(() => {
    !isEmpty(gameWeekTimes) && !currentInterval && createInterval();
  }, [gameWeekTimes]);

  const createInterval = () => {
    return (currentInterval = setInterval(() => {
      let gameWeekTimesTmp = gameWeekTimes;
      mapKeys(
        gameWeekTimes,
        (timeMilliseconds, key) =>
          (gameWeekTimesTmp[key] = timeMilliseconds - interval)
      );
      setGameWeekTimes(gameWeekTimesTmp);
      forceUpdate();
    }, interval));
  };

  const countdown = async (gameWeeks_) => {
    try {
      let gameWeekTimes_ = {};

      const promisesGamesWeeks = gameWeeks_.map((gameWeek) => {
        gameWeekTimes_[gameWeek.id] = get(
          gameWeek,
          "date.startDate._seconds",
          false
        )
          ? moment(moment.unix(gameWeek.date.startDate._seconds)).diff(moment())
          : moment(gameWeek.date.startDate.toDate()).diff(moment());
      });
      await Promise.all(promisesGamesWeeks);
      return gameWeekTimes_;
    } catch (error) {
      console.error(error);
    }
  };

  const getTime = (timeMilliseconds) => {
    if (!timeMilliseconds) return;
    if (timeMilliseconds >= 1) {
      const newTime = moment.duration(timeMilliseconds);
      const days = newTime.days() < 10 ? "0" + newTime.days() : newTime.days();
      const hours =
        newTime.hours() < 10 ? "0" + newTime.hours() : newTime.hours();
      const minutes =
        newTime.minutes() < 10 ? "0" + newTime.minutes() : newTime.minutes();
      const seconds =
        newTime.seconds() < 10 ? "0" + newTime.seconds() : newTime.seconds();
      return (
        <>
          <div className="item-time-date">
            <div className="item-date">
              <div>{days}</div>
              <span>días</span>
            </div>
          </div>
          <div className="item-time-date">
            <div className="item-date">
              <div>{hours}</div>
              <span>horas</span>
            </div>
          </div>
          <div className="item-time-date">
            <div className="item-date">
              <div>{minutes}</div>
              <span>minutos</span>
            </div>
          </div>
          <div className="item-time-date">
            <div className="item-date">
              <div>{seconds}</div>
              <span>segundos</span>
            </div>
          </div>
        </>
      );
    }
    return "";
  };

  const findLeagues = (leagueId) =>
    leagues.find((league) => league.id === leagueId);

  const countTotalSoles = (gameWeek_) => {
    let totalAwards = 0;
    if (gameWeek_.awardType === "fixed") {
      totalAwards = defaultTo(gameWeek_.fixedAwards, []).reduce(
        (total, award) => total + award.amount,
        0
      );
    }
    if (gameWeek_.awardType === "variable") {
      const total = +get(gameWeek_, "countTeams", 0) * gameWeek_.entryCost;
      totalAwards = (0.85 * total).toFixed(2);
    }
    if (gameWeek_.awardType === "object") {
      totalAwards = "por definir";
    }
    return `${currentCurrency} ${totalAwards} en juego`;
  };

  const firstAwardGameWeek = (gameWeek_) => {
    if (gameWeek_.awardType === "fixed") {
      return `${currentCurrency} ${get(
        gameWeek_,
        "fixedAwards[0].amount",
        "Por definir"
      )} para el 1ro`;
    }
    if (gameWeek_.awardType === "variable") {
      const total = +get(gameWeek_, "countTeams", 0) * gameWeek_.entryCost;
      return `${currentCurrency} ${(
        (get(gameWeek_, "variableAwards[0]", 0) / 100) *
        0.85 *
        total
      ).toFixed(2)} para el 1ro`;
    }
    if (gameWeek_.awardType === "object") {
      return get(gameWeek_, "objectAwards[0]", "por definir");
    }
    return "-";
  };

  const winners = (gameWeek) => {
    if (gameWeek.awardType === "fixed")
      return defaultTo(gameWeek.fixedAwards, []).length;

    if (gameWeek.awardType === "variable")
      return defaultTo(gameWeek.variableAwards, []).length;

    if (gameWeek.awardType === "object")
      return defaultTo(gameWeek.objectAwards, []).length;
  };

  return !isEmpty(filterActiveGameWeeks(activeGameWeeks)) ? (
    orderBy(
      filterActiveGameWeeks(activeGameWeeks),
      [(gameWeek) => get(findLeagues(gameWeek.leagueId), "updateAt")],
      ["desc"]
    ).map((gameWeek, index) => (
      <div className="card-container" key={index}>
        <div className="item-title-card">
          <img
            src={get(findLeagues(gameWeek.leagueId), "iconUrlThumb", "")}
            alt="icon leagues"
          />
          <span>{get(findLeagues(gameWeek.leagueId), "name", "-")}</span>
        </div>
        <div className="item-content-time">
          {findLeagues(gameWeek.leagueId).backgroundUrl && (
            <img
              src={get(findLeagues(gameWeek.leagueId), "backgroundUrl", null)}
              className="bg-league"
              alt="bg league"
            />
          )}
          <div className="title-date-league">
            {get(gameWeek, "name", "-")} empieza en
          </div>
          <div className="content-items-times">
            {getTime(gameWeekTimes[gameWeek.id])}
          </div>
        </div>
        <div className="item-total-soles">
          <div className="total-soles">{countTotalSoles(gameWeek)}</div>
        </div>
        <div className="item-info-league">
          <div className="prize-1ro">{firstAwardGameWeek(gameWeek)}</div>
          <div className="total-winners">{winners(gameWeek)} ganadores</div>
        </div>
        <div className="item-request-league">
          <div className="cost-for-team">
            <div>Costo por equipo</div>
            <div>
              ${currentCurrency} {get(gameWeek, "entryCost", "-")}
            </div>
          </div>
          <div className="participating-teams">
            <div>Equipos participando</div>
            <div>{get(gameWeek, "countTeams", "-")}</div>
          </div>
        </div>
        <div className="item-button-enter">
          <button
            className="button-enter"
            onClick={() =>
              history.push(
                `/leagues/${gameWeek.leagueId}/game-weeks/${gameWeek.id}/game-week-user-teams/new/edit`
              )
            }
          >
            Entrar
          </button>
        </div>
      </div>
    ))
  ) : (
    <div className="message-warning">
      Por el momento no tenemos fechas por iniciar!
    </div>
  );
};
