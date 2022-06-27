import React, { useEffect, useGlobal, useMemo, useState } from "reactn";
import { useRouter } from "next/router";
import { firestore } from "../../../../firebase";
import { UserCreateEvent } from "./UserCreateEvent";
import { snapshotToArray } from "../../../../utils";

export const Event = (props) => {
  const router = useRouter();

  const { eventId, manageBy } = router.query;

  const [authUser] = useGlobal("user");
  const [events] = useGlobal("userEvents");
  const [members, setMembers] = useState([]);

  const [event, setEvent] = useState({});

  const documentId = eventId === "new" ? firestore.collection("events").doc().id : eventId;

  useEffect(() => {
    if (eventId === "new") return;

    const _event = events.find((event) => event.id === eventId);

    setEvent(_event);
  }, [eventId, events]);

  useEffect(() => {
    if (!authUser?.company || eventId !== "new") return;

    const fetchCompanyMembers = () =>
      firestore
        .collection("companies")
        .doc(authUser?.company?.id)
        .collection("members")
        .where("deleted", "==", false)
        .onSnapshot((membersSnapshot) => {
          const _members = snapshotToArray(membersSnapshot);
          setMembers(_members);
        });

    const unsubscribeMembers = fetchCompanyMembers();

    return () => unsubscribeMembers && unsubscribeMembers();
  }, []);

  useEffect(() => {
    if (eventId === "new") return;

    const fetchMembers = () =>
      firestore
        .collection("events")
        .doc(eventId)
        .collection("members")
        .where("deleted", "==", false)
        .onSnapshot((membersSnapshot) => {
          const _members = snapshotToArray(membersSnapshot);
          setMembers(_members);
        });

    const unsubscribeMembers = fetchMembers();

    return () => unsubscribeMembers && unsubscribeMembers();
  }, []);

  return (
    <UserCreateEvent
      documentId={documentId}
      event={event}
      setEvent={setEvent}
      members={members}
      setMembers={setMembers}
      {...props}
    />
  );
};
