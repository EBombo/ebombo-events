import React, { useGlobal, useMemo, useState } from "reactn";
import { useRouter } from "next/router";
import { config, firestore } from "../../../../firebase";
import { Image } from "../../../../components/common/Image";
import {UserCreateEvent} from "./UserCreateEvent"

export const Event = (props) => {
  const router = useRouter();

  const { eventId, manageBy } = router.query;

  const [authUser] = useGlobal("user");

  const documentId = useMemo(() => {
    return props.event?.id ?? firestore.collection("events").doc().id;
  }, [props.event]);

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
      {manageBy === "user" && <UserCreateEvent documentId={documentId} {...props} />}
    </div>
  );
};
