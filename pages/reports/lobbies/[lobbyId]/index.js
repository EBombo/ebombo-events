import React from "reactn";
import dynamic from "next/dynamic";
import { spinLoader } from "../../../../src/components/common/loader";
import { PrivateRoutes } from "../../../../src/routes/PrivateRoutes";
import { SEOMeta } from "../../../../src/components/common/seo";
import { LobbyReport } from "../../../../src/pages/reports/lobbies/_lobbyId";

const UserLayout = dynamic(() => import("../../../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const LobbyReportContainer = (props) => (
  <PrivateRoutes>
    <SEOMeta {...props} />
    <UserLayout {...props}>
      <LobbyReport {...props} />
    </UserLayout>
  </PrivateRoutes>
);

export default LobbyReportContainer;
