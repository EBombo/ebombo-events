import dynamic from "next/dynamic";
import { PrivateRoutes } from "../../../../../../src/routes/PrivateRoutes";
import { spinLoader } from "../../../../../../src/components/common/loader";
import { TemplateGame } from "../../../../../../src/pages/admin/games/_gameId/templates/_templateId";

const UserLayout = dynamic(() => import("../../../../../../src/components/UserLayout"), {
  ssr: false,
  loading: () => spinLoader(),
});

const DefaultGamePage = (props) => {
  return (
    <PrivateRoutes>
      <UserLayout {...props}>
        <TemplateGame {...props} />
      </UserLayout>
    </PrivateRoutes>
  );
};

export default DefaultGamePage;
