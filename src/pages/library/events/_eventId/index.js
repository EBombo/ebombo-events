import React from "reactn";
import { useRouter } from "next/router";

export const Event = (props) => {
  const router = useRouter();

  const { eventId } = router.query;

  return <div className="w-full h-full bg-cover bg-no-repeat bg-white bg-pattern-gray p-4 md:p-8">

  </div>;
};
