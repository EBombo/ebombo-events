import React from "reactn";
import { Anchor, ButtonAnt } from "../../../components/form";
import { config } from "../../../firebase";
import { Image } from "../../../components/common/Image";

export const DateEvent = (props) => {
  return (
    <div>
      <div className="text-primary text-4xl mb-6">¿Cuándo planeas hacer tu evento?</div>

      <div className="text-secondary mb-4 text-xl">
        Elige fechas tentativas para tu evento. De esa forma podremos realizar tu evento sin que haya un cruce.
      </div>

      <div className="grid grid-cols-4 gap-3 w-9/12 rounded-md border-2 border-grayLighten py-6 px-4 mb-9">
        <div>
          <div className="text-secondary mb-4">Día del evento</div>
        </div>

        <div>
          <div className="text-secondary mb-4">Inicio del evento</div>
        </div>

        <div>
          <div className="text-secondary mb-4">Fin del evento</div>
        </div>

        <ButtonAnt color="primary" variant="contained">
          Adicionar fecha
        </ButtonAnt>
      </div>

      <div className="text-secondary mb-4 text-xl">Fechas tentativas elegidas</div>

      <div className="grid grid-cols-5 gap-3 w-9/12 rounded-md border-2 border-grayLighten py-6 px-4">
        <div>
          <div className="text-grayDarken mb-4">Día del evento</div>
          <div className="text-secondary text-base mb-4">Fecha...</div>
        </div>

        <div>
          <div className="text-grayDarken mb-4">Inicio del evento</div>
          <div className="text-secondary text-base mb-4">Fecha...</div>
        </div>

        <div>
          <div className="text-grayDarken mb-4">Fin del evento</div>
          <div className="text-secondary text-base mb-4">Fecha...</div>
        </div>

        <Anchor underlined margin="auto 0" variant="secondary">
          Editar
        </Anchor>

        <Image
          src={`${config.storageUrl}/resources/delete.svg`}
          width="16px"
          height="16px"
          size="contain"
          margin="auto"
          cursor="pointer"
        />
      </div>

      <div className="flex mt-4">
        <Anchor
          underlined
          margin="auto 0"
          variant="secondary"
          onClick={() => props.setCurrentTab(props.eventSteps[props.position - 1].key)}
        >
          Volver
        </Anchor>

        <ButtonAnt
          onClick={() => props.setCurrentTab(props.eventSteps[props.position + 1].key)}
          color="primary"
          variant="contained"
          disabled={!props.date}
          fontSize="18px"
          size="big"
          margin="1rem 0 auto auto"
        >
          Siguiente
        </ButtonAnt>
      </div>
    </div>
  );
};
