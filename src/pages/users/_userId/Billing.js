import React, { useGlobal, useEffect } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../constants";
import { PanelBox } from "../../../components/common/PanelBox";
import { Anchor } from "../../../components/form";
import { useRouter } from "next/router";

import { config } from "../../../firebase";
import { PlanCard } from "./billing/PlanCard";


export const Billing = (props) => {
  const router = useRouter();
  const { userId } = router.query;

  return (
    <BillingContainer>
      <div className="inner-layout">
        <PanelBox elevated heading="Vision General">
          <div>Plan:</div>
          <div><Anchor className="link" onClick={() => router.push(`/users/${userId}/billing/detail`)}>Gestionar Facturas</Anchor></div>
          <div><Anchor className="link" onClick={() => router.push(`/users/${userId}/billing/detail`)}>Administrar suscripción</Anchor></div>
          <div>Ciclo de pago: </div>
        </PanelBox>
        <PanelBox className="panel" elevated heading="Licencias y Admins"/>
        <PlanCard className="plan-card"/>
      </div>
    </BillingContainer>
  );
};

const BillingContainer = styled.div`
  margin: 0.5rem;

  .link {
    color: ${(props) => props.theme.basic.primary};
  }

  ${mediaQuery.afterTablet} {
    margin: 1rem;
  }

  .inner-layout {
    ${mediaQuery.afterTablet} {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      grid-auto-flow: column;
      gap: 1rem;
    }
  }
`;
