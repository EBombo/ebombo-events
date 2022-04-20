import React, { useEffect, useGlobal, useMemo, useState } from "reactn";
import { useRouter } from "next/router";
import { config, firestore } from "../../../../firebase";
import { Image } from "../../../../components/common/Image";
import { UserCreateEvent } from "./UserCreateEvent";
import { snapshotToArray } from "../../../../utils";

export const Event = (props) => {
  const router = useRouter();

  const { eventId, manageBy } = router.query;

  const [authUser] = useGlobal("user");
  const [events] = useGlobal("userEvents");
  const [members, setMembers] = useState([]);

  const [event, setEvent] = useState({});

  const documentId = useMemo(() => {
    return eventId === "new" ? firestore.collection("events").doc().id : eventId;
  }, [props.event]);

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
    <div className="w-full md:min-h-[100vh]">
      <div className="w-full h-[80px] bg-white px-4 flex items-center justify-between">
        <Image
          src={`${config.storageUrl}/resources/ebombo.svg`}
          cursor="pointer"
          height="35px"
          width="125px"
          size="contain"
          margin="0"
        />
        <div className="text-secondary text-['Lato'] font-[700] text-[18px] leading-[22px]">{`${authUser.name} ${authUser.lastName}`}</div>
      </div>
      {manageBy === "user" && (
        <UserCreateEvent
          documentId={documentId}
          event={event}
          setEvent={setEvent}
          members={members}
          setMembers={setMembers}
          {...props}
        />
      )}
    </div>
  );
};
