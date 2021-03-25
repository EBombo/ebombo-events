import React from "reactn";
import { ModalContainer } from "../../../../../components/common/ModalContainer";
import isBoolean from "lodash/isBoolean";
import { ButtonBombo } from "../../../../../components";
import { darkTheme } from "../../../../../styles/theme";

export const ModalCancelMatch = (props) => {
  const {
    match,
    matchCancelTime,
    loadingCancelMatch,
    iAm,
    isVisibleModalCancel,
    isVisibleClaim,
  } = props;

  const opponent = () =>
    props.isChallenger() ? match.challenged[0] : match.challenger[0];

  const wantCancel = () => {
    if (
      isBoolean(match.challengerCancel) &&
      isBoolean(match.challengedCancel) &&
      ((props.isChallenger() && !match.challengerCancel) ||
        (!props.isChallenger() && !match.challengedCancel))
    )
      return (
        <>
          <span>Esperando respuesta de tu oponente ...</span>
          <br />
          <br />
          <span>
            Si tu oponente no responde en {matchCancelTime}, automaticamente se
            cancela el encuentro.
          </span>
        </>
      );

    if (
      (props.isChallenger() && match.challengedCancel) ||
      (!props.isChallenger() && match.challengerCancel)
    )
      return (
        <>
          <div>{opponent().nickname} ha cancelado el encuentro</div>
          <ButtonBombo
            border="none"
            background={darkTheme.basic.danger}
            color={darkTheme.basic.blackDarken}
            width="100%"
            bgColorEvents={darkTheme.basic.danger}
            colorEvents={darkTheme.basic.blackDarken}
            onClick={() => props.userCancelMatch("cancel")}
            loading={loadingCancelMatch}
            disable={loadingCancelMatch}
            margin="0.5rem 0"
          >
            Confirmar cancelación
          </ButtonBombo>
          <ButtonBombo
            primary="true"
            width="100%"
            onClick={() => props.userCancelMatch("nocancel")}
            loading={loadingCancelMatch}
          >
            No cancelar
          </ButtonBombo>
        </>
      );

    if (
      (!props.isChallenger() && isBoolean(match.challengerCancel)) ||
      (props.isChallenger() && isBoolean(match.challengedCancel))
    )
      return (
        <>
          <div>{opponent().nickname} no ha aceptado cancelar la partida</div>
          <ButtonBombo
            primary
            width="100%"
            onClick={() => props.userCancelMatch("resume")}
            loading={loadingCancelMatch}
            margin="0.5rem 0"
          >
            Jugar partido
          </ButtonBombo>
          <ButtonBombo
            border="none"
            background={darkTheme.basic.danger}
            color={darkTheme.basic.blackDarken}
            width="100%"
            bgColorEvents={darkTheme.basic.danger}
            colorEvents={darkTheme.basic.blackDarken}
            onClick={() => props.setIsVisibleClaim(true)}
          >
            Ir a revisión
          </ButtonBombo>
        </>
      );

    return (
      <>
        <span>Esperando respuesta de tu oponente ...</span>
        <br />
        <br />
        <span>
          Si tu oponente no responde en {matchCancelTime}, automaticamente se
          cancela el encuentro.
        </span>
      </>
    );
  };

  return (
    <ModalContainer
      footer={null}
      closable={match[`${iAm}Cancel`]}
      onCancel={() =>
        match[`${iAm}Cancel`] && props.setIsVisibleModalCancel(false)
      }
      visible={
        (match.challengerCancel ||
          (match.challengedCancel && !isVisibleClaim)) &&
        isVisibleModalCancel
      }
    >
      {wantCancel()}
    </ModalContainer>
  );
};
