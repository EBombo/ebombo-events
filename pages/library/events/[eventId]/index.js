import React, { useGlobal } from "reactn";
import { SEOMeta } from "../../../../src/components/common/seo";
import { PrivateRoutes } from "../../../../src/routes/PrivateRoutes";
import { Event } from "../../../../src/pages/library/events/_eventId";
import { useRouter } from "next/router";
import { EventContainer } from "../../../../src/pages/events/eventId";
import { Image } from "../../../../src/components/common/Image";
import { config } from "../../../../src/firebase";

const Game = (props) => {
  const router = useRouter();
  const { manageBy } = router.query;

  const [authUser] = useGlobal("user");

  return (
    <PrivateRoutes>
      <SEOMeta {...props} />

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
          <div className="text-secondary text-['Lato'] font-[700] text-[18px] leading-[22px]">{`${authUser?.name} ${authUser?.lastName}`}</div>
        </div>

        {manageBy === "ebombo" ? <EventContainer {...props} /> : <Event {...props} />}
      </div>
    </PrivateRoutes>
  );
};

export default Game;
