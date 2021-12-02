import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../constants";
import { PanelBox } from "../../../components/common/PanelBox";
import { Anchor } from "../../../components/form";
import { useRouter } from "next/router";

export const Billing = (props) => {
  const router = useRouter();
  const { userId } = router.query;

  return (
    <BillingContainer>
      <div className="inner-container">
        <PanelBox elevated heading="Vision General">
          <div>Plan:</div>
          <div><Anchor className="link" onClick={() => router.push(`/users/${userId}/billing/detail`)}>Gestionar Facturas</Anchor></div>
          <div><Anchor className="link" onClick={() => router.push(`/users/${userId}/billing/detail`)}>Administrar suscripción</Anchor></div>
          <div>Ciclo de pago: </div>
        </PanelBox>
        <PanelBox className="panel" elevated heading="Licencias y Admins">
        </PanelBox>
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
`;
