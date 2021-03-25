import React from "reactn";
import { ModalContainer } from "../../../../../../components/common/ModalContainer";
import styled from "styled-components";

export const ModalChallengeInfo = (props) => {
  return (
    <ModalContainer
      footer={null}
      visible={props.isVisibleModalChallengeInfo}
      onCancel={() => props.setIsVisibleModalChallengeInfo(false)}
    >
      <Container>
        <p>
          - Espera a que un rival acepte tu desafío, sé paciente :)
          <br />- Cuando acepten tu desafío podrás decidir si deseas jugar o no
          <br />- Los desafíos estan visibiles por 30 minutos en la plataforma,
          una vez finalizado este tiempo pasara a desafío pasados
        </p>
        <span>
          Cuando tu rival esté listo te enviaremos un correo electrónico y un
          mensaje a tu inbox para notificarte.
        </span>
      </Container>
    </ModalContainer>
  );
};

const Container = styled.div`
  p {
    font-size: 11px;
    line-height: 13px;
    color: ${(props) => props.theme.basic.white};
  }

  span {
    font-size: 13px;
    line-height: 14px;
    color: ${(props) => props.theme.basic.action};
  }
`;
