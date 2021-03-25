const {postWelcomeSettings} = require("./admin/settings/post");
const {chargeVisanet, chargePaypal} = require("./users/post");
const {
    putUser,
    uploadDocument,
    putUserAccounts,
    uploadProfilePicture,
    validateAccount,
    requestNewDocument,
    putUserFavoriteGames,
} = require("./users/put");
const {
    userTeams,
    userPlayers,
    userAwards,
    verifyCode,
    resendVerifyCode,
} = require("./users/get/");
const {getTime} = require("./get-time");
const {update} = require("./registrations/put");
const {cleanExpiredMoney} = require("./clean-expired-coins");
const {withdraw, withdrawRapyd, paypalWithdraw} = require("./users/post");
const {
    adminChargeMoney,
    adminWithdrawal,
    takeMoney,
    adminCancelWithdrawal,
    adminIsVerified,
} = require("./admin/users_/put");
const {payWinners} = require("./admin/tournaments/post");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {putAcceptRequest} = require("./tournamentTeams/put");
const {putTournamentInscriptionTeamBrief} = require("./tournamentTeams/put");
const {postEvent} = require("./events/post");
const {validateRequest} = require("./validateRequest");
const {validateAdmin} = require("./validateAdmin");
const {query, body} = require("express-validator");
const {postMessage} = require("./chats/post");
const {postSuggestion} = require("./suggestions/post");
const {addFollower} = require("./followers/post");
const {deleteFollower} = require("./followers/delete");
const {validateCoupon} = require("./coupon");
const {
    putAcceptInvitation,
    putSendInvitation,
    putName,
    putRejectInvitation,
    putRejectTeam,
    putReadyToPay,
    putPay,
    putDescription,
    putMembers,
    putTeamImage,
    putStreamUrl,
    putScore,
    putTeamEvidences,
} = require("./tournamentTeams/put");
const {postTeamInscription} = require("./tournamentTeams/post");
const {postTournament} = require("./tournaments/post");
const {putUserPhoneNumber} = require("./users/put/putUserPhoneNumber");
const {putUserReceiveEmail} = require("./users/put/putUserReceiveEmail");
const {putCalculatePointsByGroup} = require("./tournamentGroup/put");
const {businessEmail} = require("./b2b");
const {postChallenge} = require("./challenges/post");
const {getChallenge} = require("./challenges/get");
const {postError} = require("./error");
const {webhookPayout} = require("./rapyd");
const {getManifest} = require("./manifest/get");

const app = express();

app.use(cors({origin: "*"}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));

app.get("/", async (req, res) => res.send("Hello!"));

app.get("/210", async (req, res) => res.status(210).send("mensaje " + 210));

app.get("/310", async (req, res) => res.status(310).send("mensaje " + 310));

app.get("/410", async (req, res) => res.status(410).send("mensaje " + 410));

app.get("/get-time", getTime);

//app.post("/admin/game-weeks/:gameWeekId/pay", validateAdmin, payAwards);

app.post("/error-boundary", [], postError);

app.post(
    "/admin/welcome-settings",
    [
        body("commission").exists(),
        body("registerMoney").exists(),
        body("defaultExpirationOfMoney").exists(),
        body("entryCosts").exists(),
    ],
    validateAdmin,
    postWelcomeSettings
);

app.post(
    "/challenges",
    [
        body("userId").exists(),
        body("gameRuleId").optional(),
        body("gameId").exists(),
        body("consoleId").exists(),
        body("gameEntryCost").exists(),
    ],
    validateRequest,
    postChallenge
);

app.get("/challenges/:challengeId/users/:userId", getChallenge);

app.get("/challenges/:challengeId/users/:userId/:action", getChallenge);

app.post("/business-email", businessEmail);

app.post(
    "/users/:userId/token/:token/amount/:amount/currency/:currency/purchase-number/:purchaseNumber/procesar_pago",
    chargeVisanet
);

app.post(
    "/users/:userId/token/:token/amount/:amount/currency/:currency/purchase-number/:purchaseNumber/coupon/:couponId/procesar_pago",
    chargeVisanet
);

app.post("/users/:userId/paypal", chargePaypal);

app.post(
    "/users/:userId/withdraw/:amount",
    [
        body("accountType").exists(),
        body("accountNumber").exists(),
        body("holderName").exists(),
        body("documentType").exists(),
        body("document").exists(),
    ],
    validateRequest,
    withdraw
);

app.post("/users/:userId/withdraw-rapyd", withdrawRapyd);

app.post("/users/:userId/withdraw-paypal", paypalWithdraw);

app.put(
    "/user/:userId",
    [
        body("name").exists(),
        body("lastName").exists(),
        body("nickname").exists(),
        body("phoneNumber").exists(),
        body("birthDate").exists(),
    ],
    validateRequest,
    update
);

app.put(
    "/users/:userId/document",
    [body("documentImageUrl").exists(), body("documentImageUrlThumb").exists()],
    validateRequest,
    uploadDocument
);

app.put(
    "/users/:userId/picture",
    [body("profileImageUrl").exists(), body("profileImageUrlThumb").exists()],
    validateRequest,
    uploadProfilePicture
);

app.put("/users/:userId/validate-account", validateAccount);

app.put("/users/:userId/request-new-document", requestNewDocument);

app.put(
    "/users/:userId/:phoneNumber/:countryCode/:dialCode",
    [],
    validateRequest,
    putUserPhoneNumber
);

app.put(
    "/users/:userId/received-email",
    [],
    validateRequest,
    putUserReceiveEmail
);

app.put(
    "/users/:userId/games/:gameId",
    [],
    validateRequest,
    putUserFavoriteGames
);

app.put(
    "/admin/user/:userId",
    [
        body("amount").isNumeric(),
        body("paymentType").exists(),
        body("noteTransaction").exists(),
    ],
    validateAdmin,
    adminChargeMoney
);

app.put(
    "/admin/user/:userId/take-money",
    [body("amount").isNumeric(), body("reason").exists()],
    validateAdmin,
    takeMoney
);

app.put("/admin/withdrawals/:withdrawalId", adminWithdrawal);

app.put("/admin/withdrawals/:withdrawalId/cancel", adminCancelWithdrawal);

app.put("/admin/users/:userId/verified", [], validateAdmin, adminIsVerified);

app.post(
    "/admin/tournaments/:tournamentId/pay-awards",
    [body("teamsWinners").exists()],
    validateAdmin,
    payWinners
);

app.post("/users/:userId/clean-expired-coins", cleanExpiredMoney);

app.get("/users/:userId/teams", userTeams);

app.get("/users/:userId/players", userPlayers);

app.get("/users/:userId/game-week-user-awards", userAwards);

app.put("/users/:userId", [body("name").exists()], validateRequest, putUser);

app.put("/users/:userId/user-accounts", [], validateRequest, putUserAccounts);

app.get("/verify/:userId/verification-code/:verificationCode", verifyCode);

app.get("/verify/:userId/resend-code", resendVerifyCode);

app.get("/coupons/:couponCode/:amount", validateCoupon);

app.post(
    "/chats/:chatId/messages",
    [body("content").exists()],
    validateRequest,
    postMessage
);

app.post(
    "/suggestions/:userId",
    [body("suggestion").exists()],
    validateRequest,
    postSuggestion
);

app.post(
    "/followers",
    [query("userId").exists(), query("followerUserId").exists()],
    validateRequest,
    addFollower
);

app.post(
    "/tournaments",
    [
        body("name").exists(),
        body("lastName").exists(),
        body("countryCode").exists(),
        body("dialCode").exists(),
        body("phoneNumber").exists(),
    ],
    validateRequest,
    postTournament
);

app.delete(
    "/followers",
    [query("userId").exists(), query("followerUserId").exists()],
    validateRequest,
    deleteFollower
);

app.post("/tournaments/:tournamentId/users/:userId", postTeamInscription);

app.put(
    "/tournaments/:tournamentId/users/:userId/brief",
    putTournamentInscriptionTeamBrief
);

app.put(
    "/tournaments/:tournamentId/calculate-points",
    putCalculatePointsByGroup
);

app.put(
    "/tournament-teams/:tournamentTeamId/users/:userId/sent-invitation",
    putSendInvitation
);

app.put(
    "/tournament-teams/:tournamentTeamId/users/:userId/accept-invitation",
    putAcceptInvitation
);

app.put(
    "/tournament-teams/:tournamentTeamId/users/:userId/reject-invitation",
    putRejectInvitation
);

app.put(
    "/tournament-teams/:tournamentTeamId/users/:userId/reject-team",
    putRejectTeam
);

app.put(
    "/tournament-teams/:tournamentTeamId/users/:userId/accept-request",
    putAcceptRequest
);

app.put("/tournament-teams/:tournamentTeamId/ready-to-pay", putReadyToPay);

app.put(
    "/tournament-teams/:tournamentTeamId/users/:userId/pay/:amount",
    putPay
);

app.put("/tournament-teams/:tournamentTeamId/name", putName);
app.put("/tournament-teams/:tournamentTeamId/description", putDescription);
app.put("/tournament-teams/:tournamentTeamId/members", putMembers);
app.put("/tournament-teams/:tournamentTeamId/image", putTeamImage);
app.put("/tournament-teams/:tournamentTeamId/stream-url", putStreamUrl);

//iu gamer => influencer
app.put("/tournament-teams/:tournamentTeamId/evidences", putTeamEvidences);
app.put("/tournament-teams/:tournamentTeamId/score", putScore);

app.post(
    "/events/tournaments/:tournamentId/users/:userId/action/:action",
    postEvent
);

app.post("/disburse/rapyd", webhookPayout);

app.get("/manifest/:domain", getManifest);

module.exports = {app};
