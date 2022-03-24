import React from "reactn";
import { Anchor, ButtonAnt, TextArea } from "../../../components/form";

export const DetailsEvent = (props) => {
  return (
    <div>
      <div className="text-primary text-4xl mb-6">Detalles del evento</div>

      <div className="flex gap-5 mb-4">
        <div>
          <div className="text-secondary mb-4">¿Quieres que haya iteracción?</div>
          <div className="flex gap-2">
            <div className="w-52 text-2xl bg-white rounded-md border-2 py-2 px-1 cursor-pointer">icon1</div>
            <div className="w-52 text-2xl bg-white rounded-md border-2 py-2 px-1 cursor-pointer">icon2</div>
          </div>
        </div>

        <div>
          <div className="text-secondary mb-4">¿Quieres adicionar regalos, premio o algún elemento físico?</div>
          <div className="flex gap-2">
            <div className="w-52 text-2xl bg-white rounded-md border-2 py-2 px-1 cursor-pointer">icon1</div>
            <div className="w-52 text-2xl bg-white rounded-md border-2 py-2 px-1 cursor-pointer">icon2</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-secondary mb-4">¿Cuáles son los objetivos de tu evento?</div>
        <div className="grid grid-cols-4 gap-2">
          <div className="text-2xl bg-white rounded-md border-2 py-2 px-1 cursor-pointer">icon1</div>
          <div className="text-2xl bg-white rounded-md border-2 py-2 px-1 cursor-pointer">icon2</div>
          <div className="text-2xl bg-white rounded-md border-2 py-2 px-1 cursor-pointer">icon3</div>
          <div className="text-2xl bg-white rounded-md border-2 py-2 px-1 cursor-pointer">icon4</div>
          <div className="text-2xl bg-white rounded-md border-2 py-2 px-1 cursor-pointer">icon1</div>
          <div className="text-2xl bg-white rounded-md border-2 py-2 px-1 cursor-pointer">icon2</div>
          <div className="text-2xl bg-white rounded-md border-2 py-2 px-1 cursor-pointer">icon3</div>
          <div className="text-2xl bg-white rounded-md border-2 py-2 px-1 cursor-pointer">icon4</div>
        </div>
      </div>

      <div className="flex gap-10">
        <div>
          <div className="text-secondary mb-4">¿Cuáles de nuestras dinámicas virtuales quisieras en tu eveno?</div>
          <div className="grid grid-cols-4 gap-2">
            <div>game1</div>
            <div>game2</div>
            <div>game3</div>
            <div>game4</div>
            <div>game1</div>
            <div>game2</div>
            <div>game3</div>
            <div>game4</div>
            <div>....</div>
          </div>
        </div>

        <div>
          <div className="text-secondary mb-4">
            Escribenos comentarios adiciones de tu evento para tenerlos en cuenta
          </div>
          <TextArea rows={7} variant="primary" />
        </div>
      </div>

      <div className="flex mt-4">
        <Anchor
          underlined
          margin="auto 0"
          variant="secondary"
          onClick={() => props.setCurrentTab(props.eventSteps[props.position - 1].key)}
        >
          Atras
        </Anchor>

        <ButtonAnt
          onClick={() => props.setCurrentTab(props.eventSteps[props.position + 1].key)}
          color="primary"
          disabled={!props.budget}
          variant="contained"
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
