import React, { useMemo, useState } from "reactn";
import styled from "styled-components";
import moment from "moment";
import {
  Distribution2CenterStyled,
  Distribution3Styled,
  DistributionCol,
} from "../../../components/common/Distribution";
import { DatePicker } from "../../../components/form";
import { Desktop, mediaQuery, sizes, Tablet } from "../../../constants";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

export const CompanyReport = (props) => {
  const [startDate, setStartDate] = useState(moment().subtract(1, "weeks"));
  const [endDate, setEndDate] = useState(moment());
  const [error, setError] = useState(null);

  const reportInformation = useMemo(() => {
    if (startDate.isAfter(endDate))
      return setError({ message: "La fecha de inicio debe ser anterior a la fecha de finalización" });

    setError(null);

    // TODO: fetch data between startDate & endDate.
    return [];
  }, [startDate, endDate]);

  const lastUpdated = useMemo(() => {
    return (
      <DistributionCol align="right">
        <div className="last-update">Última actualización: {moment().format("LLL")}</div>
      </DistributionCol>
    );
  }, []);

  return (
    <ReportStyled>
      <Distribution2CenterStyled>
        <Tablet>{lastUpdated}</Tablet>

        <DistributionCol>
          <Distribution2CenterStyled noResponsive>
            <DistributionCol>
              <div className="title">Desde</div>
              <DatePicker
                defaultValue={startDate}
                format="ll"
                onChange={(value) => setStartDate(value)}
                error={error}
              />
            </DistributionCol>

            <DistributionCol>
              <div className="title">Hasta</div>
              <DatePicker defaultValue={endDate} format="ll" onChange={(value) => setEndDate(value)} />
            </DistributionCol>
          </Distribution2CenterStyled>
        </DistributionCol>

        <Desktop>{lastUpdated}</Desktop>
      </Distribution2CenterStyled>

      {/* TODO: Metrics.*/}
      <Distribution3Styled>
        <DistributionCol>
          <div className="metrics">
            <div className="head">
              <div className="title">Juegos en vivo</div>
              <Tooltip title="Un juego en vivo es jugado simultáneamente por un grupo de estudiantes, ya sea en persona o por video.">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>

            <div className="body">
              <div>Jugadores</div>
              <div>137</div>
            </div>

            <div className="body">
              <div>Sesiones</div>
              <div>9</div>
            </div>
          </div>
        </DistributionCol>

        {/* TODO: Metrics.*/}
        <DistributionCol>
          <div className="metrics">
            <div className="head">
              <div>Usuarios</div>
              <Tooltip title="Los usuarios son miembros de su equipo que pueden crear y organizar un juego.">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>

            <div className="body">
              <div>Jugadores</div>
              <div>137</div>
            </div>

            <div className="body">
              <div>Sesiones</div>
              <div>9</div>
            </div>
          </div>
        </DistributionCol>

        <DistributionCol />
      </Distribution3Styled>

      {/* TODO: Metrics.*/}
      <div className="list-users">
        <div className="title">Anfitriones principales</div>

        <div className="head">
          <div>Rango</div>
          <div>Correo electrónico</div>
          <div>Usuario</div>
          <div>Ebombo hosted</div>
        </div>

        <div className="body">
          <div>1</div>
          <div>hello@ebombo.pe</div>
          <div>ebomboPeru</div>
          <div>9</div>
        </div>
      </div>
    </ReportStyled>
  );
};

const ReportStyled = styled.div`
  padding: 5px;
  border-radius: 5px;
  background: ${(props) => props.theme.basic.white};

  .last-update {
  }

  .title {
    text-align: left;
    font-weight: bold;
  }

  .metrics {
    padding: 5px 10px;
    border-radius: 3px;
    box-shadow: 0 2px 2px ${(props) => props.theme.basic.grayLight};

    .head,
    .body {
      display: flex;
      justify-content: space-between;
    }

    .head {
      padding: 5px;
      font-weight: bold;
      border-bottom: 1px solid ${(props) => props.theme.basic.grayLight};
    }

    .body {
      padding: 7px;
    }
  }

  .list-users {
    margin-top: 1rem;
    padding: 10px 8px;

    .title {
      font-weight: bold;
    }

    .head,
    .body {
      display: grid;
      padding: 10px;
      border-radius: 5px;
      grid-template-columns: repeat(4, 1fr);
      border: 1px solid ${(props) => props.theme.basic.whiteDarken};
      font-size: ${sizes.font.mini};

      ${mediaQuery.afterTablet} {
        font-size: ${sizes.font.normal};
      }
    }

    .head {
      margin-bottom: 5px;
      background: ${(props) => props.theme.basic.whiteDark};
    }
  }
`;
