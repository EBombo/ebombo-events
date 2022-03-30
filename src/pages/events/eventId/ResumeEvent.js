import React from "reactn";
import { Anchor, ButtonAnt, TextArea } from "../../../components/form";

export const ResumeEvent = (props) => {
  return (
    <div>
      <div className="text-secondary mb-4 text-base">
        Manda tu resumen al equipo de ebombo y nos pondremos lo antes posible en contacto contigo
      </div>

      <div className="text-primary text-4xl mb-6">Resumen de tu evento</div>

      <div className="grid grid-cols-2 gap-5 mb-4">
        <div className="block">
          <div className="w-full flex gap-4 mb-4">
            <div className="w-full text-xl text-center bg-white rounded-md border-2 py-4 px-1 grayLighten">asd</div>
            <div className="w-full text-xl text-center bg-white rounded-md border-2 py-4 px-1 grayLighten">asd</div>
          </div>

          <div className="w-full h-auto rounded-md border-2 py-4 px-1 grayLighten grid grid-cols-2 px-3">
            <div>Detalles</div>
            <div>asd</div>
            <div>asd</div>
            <div>asd</div>
            <div>asd</div>
            <div>Regalo/Premio/Elemento fisico</div>
            <div>asd</div>
            <div>asd</div>
            <div>asd</div>
            <div>asd</div>
          </div>
        </div>

        <div>
          <div className="text-secondary mb-4">Comentarios adicionales</div>
          <TextArea rows={7} disabled variant="primary" />
        </div>
      </div>

      <div className="text-secondary mb-4 text-base">Fechas tentativas</div>

      <div className="w-[200px] text-base text-center bg-white rounded-md border-2 py-2 px-1 grayLighten mb-4">
        <div>asd</div>
        <div>asd</div>
      </div>

      <div className="text-secondary mb-4 text-base">Dinamicas escogidas</div>

      <div className="w-[300px] text-base bg-white rounded-md border-2 py-2 px-1 grayLighten mb-4 grid grid-cols-[1fr_3fr]">
        <div>ICON</div>
        Juego
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
          fontSize="18px"
          size="big"
          margin="1rem 0 auto auto"
        >
          Enviar
        </ButtonAnt>
      </div>
    </div>
  );
};
