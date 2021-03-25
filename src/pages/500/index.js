import React from "react";

import { withRouter } from "react-router-dom";
import { ButtonBombo } from "../../components";

function NotFound() {
  return (
    <div className="container-error-server">
      <h3 style={{ color: "#fff", textAlign: "center", marginBottom: "10px" }}>
        Ha ocurrido un error en el servidor. Por favor inténtelo mas tarde...
      </h3>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ButtonBombo
          type="primary"
          onClick={() => this.props.history.push("/")}
        >
          Continuar
        </ButtonBombo>
      </div>
    </div>
  );
}

export default withRouter(NotFound);
