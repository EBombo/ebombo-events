import React, { useEffect, useGlobal, useState } from "reactn";
import { ButtonAnt } from "../../../components/form";
import { firestore } from "../../../firebase";
import { snapshotToArray } from "../../../utils";
import { ModalNewEvent } from "./ModalNewEvent";

export const Events = (props) => {
  const [authUser] = useGlobal("user");

  const [events, setEvents] = useState([]);
  const [isVisibleModalEvents, setIsVisibleModalEvents] = useState(false);

  useEffect(() => {
    const fetchUserEvents = () =>
      firestore
        .collection("events")
        .where("userId", "==", authUser?.id)
        .where("deleted", "==", false)
        .onSnapshot((snapshotEvents) => {
          setEvents(snapshotToArray(snapshotEvents));
        });

    const unsubscribeEvents = fetchUserEvents;

    return () => unsubscribeEvents();
  }, []);

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
