import { useState } from "react";
import React from "reactn";
import { ButtonAnt } from "../../../components/form";
import { ModalNewEvent } from "./ModalNewEvent";

export const Events = (props) => {
  const [isVisibleModalEvents, setIsVisibleModalEvents] = useState(false);

  return (
    <div className="p-8 bg-whiteDark min-h-[calc(100vh-100px)]  md:h-full overflow-auto">
      {isVisibleModalEvents && (
        <ModalNewEvent
          {...props}
          isVisibleModalEvents={isVisibleModalEvents}
          setIsVisibleModalEvents={setIsVisibleModalEvents}
        />
      )}
      <ButtonAnt onClick={() => setIsVisibleModalEvents(true)}>Crear</ButtonAnt>

      <div>
        {/*         
        //TODO: User Events list (manage by ebombo and user)
         */}
      </div>
    </div>
  );
};
