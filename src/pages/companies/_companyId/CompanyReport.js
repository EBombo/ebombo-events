import React from "reactn";
import styled from "styled-components";
import moment from "moment";
import { Distribution2CenterStyled, DistributionCol } from "../../../components/common/Distribution";
import { DatePicker } from "../../../components/form";

export const CompanyReport = (props) => {
  return (
    <ReportStyled>
      <Distribution2CenterStyled>
        <DistributionCol>
          <Distribution2CenterStyled>
            <DistributionCol>
              <div className="title">Desde</div>
              <DatePicker defaultValue={moment().subtract(1, "weeks")} />
            </DistributionCol>
            <DistributionCol>
              <div className="title">Hasta</div>
              <DatePicker defaultValue={moment()} />
            </DistributionCol>
          </Distribution2CenterStyled>
        </DistributionCol>

        <DistributionCol>
          <div className="last-update">Última actualización: {moment().format("LLL")}</div>
        </DistributionCol>
      </Distribution2CenterStyled>

      <div className="metrics">
        <div className="head">
          <div className="">Juegos</div>
          <div className="">?</div>
        </div>
        <div className="body">
          <div className=""></div>
          <div className=""></div>
        </div>
      </div>

      <div className="metrics">
        <div className="head">
          <div className="">Usuarios</div>
          <div className="">?</div>
        </div>
        <div className="body">
          <div className=""></div>
          <div className=""></div>
        </div>
      </div>

      <div className="list-users">
        <div className="title">Anfitriones principales</div>
        <div className="head">
          <div className=""></div>
          <div className=""></div>
          <div className=""></div>
        </div>
        <div className="body">
          <div className=""></div>
          <div className=""></div>
          <div className=""></div>
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

  .control-dates {
    .date {
      .title {
      }
    }
  }

  .metrics {
    .head {
    }

    .body {
    }
  }

  .list-users {
    .title {
    }

    .head {
    }

    .body {
    }
  }
`;
