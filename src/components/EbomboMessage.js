import React, { useEffect, useGlobal } from "reactn";
import { useTranslation } from "../hooks";
import { SharpButton } from "./common/SharpButton";
import { useRouter } from "next/router";

export const EbomboMessage = (props) => {
  const router = useRouter();

  const { t } = useTranslation("landing.banner");

  const [authUser] = useGlobal("user");

  useEffect(() => {
    router.prefetch("/library/events");
    router.prefetch("/events/[eventId]");
  }, []);

  const createEvent = () => {
    if (authUser) return router.push("/library/events");

    return router.push("/events/new");
  };

  return (
    <div className="w-full bg-gradient-primary-to-secondary p-8 md:p-12">
      <div className="text-white font-[900] text-[26px] leading-[31px] lg:text-[50px] lg:leading-[85px] mb-4">
        {t("title")}
      </div>

      <SharpButton prefixIcon="wink" onClick={() => createEvent()}>
        {t("book-an-event")}
      </SharpButton>
    </div>
  );
};
