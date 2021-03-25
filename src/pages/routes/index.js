import React from "reactn";
import { Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";
import { Redirect } from "react-router";
import {
  AdminClaim,
  AdminClaims,
  AdminCouponEdit,
  AdminCoupons,
  AdminGroupEdit,
  AdminMatchesHistory,
  AdminMatchHistory,
  AdminSuggestions,
  AdminTournamentEdit,
  AdminTournamentRuleEdit,
  AdminTournaments,
  AdminWithdrawal,
  Dispatcher,
  Error,
  Followers,
  Followings,
  Landing,
  Notifications,
  Registration,
  Tournament,
  League,
  User,
  UserInvitation,
  AdminDocuments,
  AdminDocument,
  AdminAdvertisements,
  MobileChat,
  ChallengeContainer,
  EditProfile,
  UserAccounts,
} from "../pages";
import { PublicLayout, UserLayout } from "../components";
import { PrivateRoute } from "./PrivateRoute";
import { PrivateAdminRoute } from "./AdminPrivateRoute";
import { AdminGames } from "../pages/admin/games";
import { AdminConsoles } from "../pages/admin/consoles";
import { AdminConsoleEdit } from "../pages/admin/consoles/_consoleId";
import { GameTabsContainer } from "../pages/admin/games/_gameId/GameTabsContainer";
import { AdminRuleEdit } from "../pages/admin/games/_gameId/rules/_ruleId";
import { AdminFormatEdit } from "../pages/admin/games/_gameId/formats/_formatId";
import { AdminAdvertisementEdit } from "../pages/admin/advertisements/_advertisementId";
import { AdminTournamentRules } from "../pages/admin/tournamentRules";
import { AdminTournamentTeams } from "../pages/admin/tournaments/_tournamentId/tournamentTeams";
import { AdminTournamentGroups } from "../pages/admin/tournaments/_tournamentId/tournamentGroups";
import { AdminTournamentAwards } from "../pages/admin/tournaments/_tournamentId/tournamentAwards";
import { Ballots } from "../pages/admin/ballots";
import { AdminUserAcls } from "../pages/admin/users/_userId/acls";
import { ChallengesContainer } from "../pages/games/_gameId/consoles/_consoleId/challenges";
import { Tournaments } from "../pages/games/_gameId/tournaments";
import { spinLoader } from "../utils";

const BusinessLanding = lazy(() => import("../pages/companies"));
const EventsLanding = lazy(() => import("../pages/events"));
const AdminGameEdit = lazy(() => import("../pages/admin/games/_gameId"));
const Design = lazy(() => import("../pages/design"));
const Withdraw = lazy(() => import("../pages/users/_userId/withdraw"));
const UserTransactions = lazy(() =>
  import("../pages/users/_userId/transactions")
);
const TournamentContainerBrief = lazy(() =>
  import("../pages/brief/_tournamentId")
);

const BaseLayout = lazy(() => import("../components/BaseLayout"));
const SettingsContainer = lazy(() =>
  import("../pages/admin/settings/_settingId")
);
const AdminLanding = lazy(() => import("../pages/admin/landing"));
const AdminLandingEdit = lazy(() =>
  import("../pages/admin/landing/_landingId")
);
const AdminUserAccounts = lazy(() => import("../pages/admin/user-accounts"));
const AdminUserAccountId = lazy(() =>
  import("../pages/admin/user-accounts/_userAccountId")
);
const AdminUsers = lazy(() => import("../pages/admin/users"));
const AdminUserEdit = lazy(() => import("../pages/admin/users/_userId"));
const AdminRejectedCards = lazy(() => import("../pages/admin/rejected-cards"));
const AdminWithdrawals = lazy(() => import("../pages/admin/withdrawals"));

export const Routes = (props) => {
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={(props_) => (
          <UserLayout isLanding {...props_} {...props}>
            <Landing {...props_} />
          </UserLayout>
        )}
      />
      <Route
        exact
        path="/design"
        render={(props_) => (
          <UserLayout isLanding {...props_} {...props}>
            <Suspense fallback={spinLoader()}>
              <Design {...props_} />
            </Suspense>
          </UserLayout>
        )}
      />
      <Route
        exact
        path="/companies"
        render={(props_) => (
          <Suspense fallback={spinLoader()}>
            <BusinessLanding {...props_} />
          </Suspense>
        )}
      />
      <Route
        exact
        path="/events"
        render={(props_) => (
          <Suspense fallback={spinLoader()}>
            <EventsLanding {...props_} />
          </Suspense>
        )}
      />
      <Route
        exact
        path="/brief/:tournamentId"
        render={(props_) => (
          <Suspense fallback={spinLoader()}>
            <TournamentContainerBrief {...props_} {...props} />
          </Suspense>
        )}
      />
      <Route
        exact
        path="/games"
        render={(props_) => (
          <UserLayout {...props_} {...props}>
            <ChallengesContainer {...props_} {...props} />
          </UserLayout>
        )}
      />
      <Route
        exact
        path="/games/:gameId"
        render={(props_) => (
          <UserLayout {...props_} {...props}>
            <ChallengesContainer {...props_} {...props} />
          </UserLayout>
        )}
      />
      <Route
        exact
        path="/games/:gameId/consoles/:consoleId/challenges"
        render={(props_) => (
          <UserLayout {...props_} {...props}>
            <ChallengesContainer {...props_} {...props} />
          </UserLayout>
        )}
      />
      <Route
        exact
        path="/games/:gameId/consoles/:consoleId/challenges/:challengeId"
        render={(props_) => (
          <UserLayout {...props_} {...props}>
            <ChallengeContainer {...props_} {...props} />
          </UserLayout>
        )}
      />
      <PrivateRoute
        exact
        path="/games/:gameId/consoles/:consoleId/challenges/:challengeId/users/:userId"
      >
        <UserLayout {...props}>
          <UserInvitation {...props} />
        </UserLayout>
      </PrivateRoute>
      <Route
        exact
        path="/games/:gameId/chat"
        render={(props_) => (
          <UserLayout {...props_} {...props}>
            <MobileChat {...props_} {...props} />
          </UserLayout>
        )}
      />
      <Route
        exact
        path="/games/:gameId/tournaments/:tabId"
        render={(props_) => (
          <UserLayout {...props_} {...props}>
            <Tournaments {...props_} {...props} />
          </UserLayout>
        )}
      />
      <Route
        exact
        path="/games/:gameId/consoles/:consoleId/tournaments/:tournamentId"
        render={(props_) => (
          <UserLayout {...props} {...props_}>
            <Tournament {...props} {...props_} />
          </UserLayout>
        )}
      />
      <Route
        exact
        path="/games/:gameId/consoles/:consoleId/leagues/:leagueId"
        render={(props_) => (
          <UserLayout {...props} {...props_}>
            <League {...props} {...props_} />
          </UserLayout>
        )}
      />
      <Route
        exact
        path="/games/:gameId/consoles/:consoleId/leagues/:leagueId/matches"
        render={(props_) => (
          <UserLayout {...props} {...props_}>
            <League {...props} {...props_} />
          </UserLayout>
        )}
      />
      <Route
        exact
        path="/games/:gameId/consoles/:consoleId/leagues/:leagueId/dates"
        render={(props_) => (
          <UserLayout {...props} {...props_}>
            <League {...props} {...props_} />
          </UserLayout>
        )}
      />
      <Route
        exact
        path="/games/:gameId/consoles/:consoleId/leagues/:leagueId/teams"
        render={(props_) => (
          <UserLayout {...props} {...props_}>
            <League {...props} {...props_} />
          </UserLayout>
        )}
      />
      <Route
        exact
        path="/games/:gameId/consoles/:consoleId/leagues/:leagueId/teams/:teamId"
        render={(props_) => (
          <UserLayout {...props} {...props_}>
            <League {...props} {...props_} />
          </UserLayout>
        )}
      />
      <Route
        exact
        path="/games/:gameId/consoles/:consoleId/leagues/:leagueId/teams/:teamId/details"
        render={(props_) => (
          <UserLayout {...props} {...props_}>
            <League {...props} {...props_} />
          </UserLayout>
        )}
      />
      <Route
        exact
        path="/games/:gameId/consoles/:consoleId/leagues/:leagueId/teams/:teamId/members"
        render={(props_) => (
          <UserLayout {...props} {...props_}>
            <League {...props} {...props_} />
          </UserLayout>
        )}
      />
      <PrivateRoute exact path="/users/:userId">
        <UserLayout {...props}>
          <User {...props} />
        </UserLayout>
      </PrivateRoute>
      <PrivateRoute exact path="/users/:userId/edit">
        <UserLayout {...props}>
          <EditProfile {...props} />
        </UserLayout>
      </PrivateRoute>
      <PrivateRoute exact path="/users/:userId/withdraw">
        <UserLayout {...props}>
          <Suspense fallback={spinLoader()}>
            <Withdraw {...props} />
          </Suspense>
        </UserLayout>
      </PrivateRoute>
      <PrivateRoute exact path="/users/:userId/transactions">
        <UserLayout {...props}>
          <Suspense fallback={spinLoader()}>
            <UserTransactions {...props} />
          </Suspense>
        </UserLayout>
      </PrivateRoute>
      <PrivateRoute exact path="/users/:userId/user-accounts">
        <UserLayout {...props}>
          <UserAccounts {...props} />
        </UserLayout>
      </PrivateRoute>
      <PrivateRoute exact path="/users/:userId/followers">
        <UserLayout {...props}>
          <Followers {...props} />
        </UserLayout>
      </PrivateRoute>
      <PrivateRoute exact path="/users/:userId/followings">
        <UserLayout {...props}>
          <Followings {...props} />
        </UserLayout>
      </PrivateRoute>
      <PrivateRoute exact path="/notifications/:notificationId">
        <UserLayout {...props}>
          <Notifications {...props} />
        </UserLayout>
      </PrivateRoute>
      <PrivateRoute exact path="/notifications/:notificationId/:matchId">
        <UserLayout {...props}>
          <Notifications {...props} />
        </UserLayout>
      </PrivateRoute>
      <Route
        exact
        path="/registration"
        render={(props_) => (
          <UserLayout {...props_} {...props}>
            <Registration />
          </UserLayout>
        )}
      />
      <Route
        exact
        path="/mobile/registration"
        render={() => (
          <UserLayout {...props} {...props}>
            <Registration />
          </UserLayout>
        )}
      />
      <PrivateRoute exact path="/dispatcher">
        <Dispatcher {...props} />
      </PrivateRoute>
      <Route
        path="/500"
        component={() => (
          <PublicLayout {...props}>
            <Error />
          </PublicLayout>
        )}
      />
      <PrivateAdminRoute exact path="/admin/settings/:settingId">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <SettingsContainer {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/landing">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminLanding {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/landing/:landingId">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminLandingEdit {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/user-accounts">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminUserAccounts {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/user-accounts/:userAccountId">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminUserAccountId {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/users">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminUsers {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/users/:userId">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminUserEdit {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/rejected-cards">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminRejectedCards {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/withdrawals">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminWithdrawals {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/withdrawals/:withdrawalId">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminWithdrawal {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/consoles">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminConsoles {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/consoles/:consoleId">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminConsoleEdit {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/games">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminGames {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/games/:gameId">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminGameEdit {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/games/:gameId/rules">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <GameTabsContainer {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/games/:gameId/rules/:ruleId">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminRuleEdit {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/games/:gameId/formats">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <GameTabsContainer {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/games/:gameId/formats/:formatId">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminFormatEdit {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/games/:gameId/tournament-rules">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminTournamentRules {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute
        exact
        path="/admin/games/:gameId/tournament-rules/:tournamentRuleId"
      >
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminTournamentRuleEdit {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/claims">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminClaims {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/claims/:claimId">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminClaim {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/matches-history/:claimId/edit">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminClaim {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/advertisements">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminAdvertisements {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/advertisements/:advertisementId">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminAdvertisementEdit {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/matches-history">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminMatchesHistory {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/matches-history/:matchHistoryId">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminMatchHistory {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/documents">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminDocuments {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/documents/:documentId">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminDocument {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/coupons">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminCoupons {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/coupons/:couponId">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminCouponEdit {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/suggestions">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminSuggestions {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/ballots">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <Ballots {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/games/:gameId/tournaments">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminTournaments {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute
        exact
        path="/admin/games/:gameId/tournaments/:tournamentId"
      >
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminTournamentEdit {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute
        exact
        path="/admin/tournaments/:tournamentId/tournament-teams"
      >
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminTournamentTeams {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute
        exact
        path="/admin/tournaments/:tournamentId/tournament-groups"
      >
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminTournamentGroups {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute
        exact
        path="/admin/tournaments/:tournamentId/tournament-groups/:tournamentGroupId"
      >
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminGroupEdit {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/tournaments/:tournamentId/awards">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminTournamentAwards {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/users/:userId/acls">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <AdminUserAcls {...props} />
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/roles">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <div>...roles</div>
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <PrivateAdminRoute exact path="/admin/roles/:roleId">
        <Suspense fallback={spinLoader()}>
          <BaseLayout {...props}>
            <div>...roleId</div>
          </BaseLayout>
        </Suspense>
      </PrivateAdminRoute>
      <Redirect to="/" />
    </Switch>
  );
};
