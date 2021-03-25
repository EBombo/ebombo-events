import React from "react";
import {Tip as Container, TipDescription, TipTittle} from "./TipStyle";
import {config} from "../../firebase";

export const TipPaymentsDeposits = () => (
  <Container>
    <TipTittle>
      Pagos y depósitos
      <img src={`${config.storageUrl}/resources/dollar.svg`} alt="" />
    </TipTittle>
    <TipDescription>
      Puede pagarnos mediante su tarjeta de crédito o débito, Pay Pal y Yape
      Depositamos a cuentas BCP o CCI y también a cuentas de Pay Pal.
    </TipDescription>
  </Container>
);
