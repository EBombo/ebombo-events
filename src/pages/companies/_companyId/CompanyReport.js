import React from "reactn";
import styled from "styled-components";
import moment from "moment";

export const CompanyReport = (props) => {
  return (
    <ReportStyled>
      <div className="last-update">Última actualización: {moment().format("LLL")}</div>

      <div className="control-dates">
        <div className="date">
          <div className="title">Desde</div>
          <div className=""></div>
        </div>
        <div className="date">
          <div className="title">Hasta</div>
          <div className=""></div>
        </div>
      </div>

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
