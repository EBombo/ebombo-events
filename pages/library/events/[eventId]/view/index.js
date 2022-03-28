import React from "reactn";
import dynamic from "next/dynamic";
import { spinLoader } from "../../../../../src/components/common/loader";
import { SEOMeta } from "../../../../../src/components/common/seo";
import { PrivateRoutes } from "../../../../../src/routes/PrivateRoutes";
import { EventView } from "../../../../../src/pages/library/events/_eventId/view";

const UserLayout = dynamic(() => import("../../../../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const GameViewContainer = (props) => (
  <PrivateRoutes>
    <SEOMeta {...props} />
    <UserLayout {...props}>
      <EventView {...props} />
    </UserLayout>
  </PrivateRoutes>
);

export default GameViewContainer;
