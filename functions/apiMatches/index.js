const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {putChallengerReady} = require("./matches/put");
const {query, body, param} = require("express-validator");
const {validateRequest} = require("../api/validateRequest");
const {postMatches, postReturnSteps, postSteps} = require("./matches/post");
const {putClaim, putEvidence} = require("./matches/put");
const {
    getRejectUser,
    getInvitation,
    getUserCancel,
} = require("./matches/get");

const api = express();

api.use(cors({origin: "*"}));

api.use(bodyParser.json());

api.use(bodyParser.urlencoded({extended: false}));

api.get("/", async (req, res) => res.send("Hello!"));

api.post(
    "/matches",
    [
        body("matchId").optional(),
        body("challengerId").exists(),
        body("challengedId").exists(),
        body("gameId").exists(),
        body("consoleId").exists(),
        body("gameRuleId").exists(),
        body("gameEntryCost").exists(),
    ],
    validateRequest,
    postMatches
);

api.post(
    "/matches/:matchId",
    [body("step").exists(), body("userId").exists()],
    validateRequest,
    postSteps
);

api.put(
    "/matches/:matchId/challenger-ready",
    validateRequest,
    putChallengerReady
);

api.post(
    "/matches/:matchId/return",
    [body("step").exists(), body("userId").exists()],
    validateRequest,
    postReturnSteps
);

api.put(
    "/matches/:matchId/claim",
    [
        body("message").exists(),
        body("imageUrl").exists(),
        body("imageUrlThumb").exists(),
    ],
    validateRequest,
    putEvidence
);

api.put("/matches/:matchId", [body("hasClaim").exists()], putClaim);

api.get("/matches/:matchId/users/:userId/reject", getRejectUser);

api.get("/matches/:matchId/users/:userId/action/:action", getUserCancel);

api.get(
    "/matches/:matchId/users/:userId/invitation/:invitationId",
    getInvitation
);

module.exports = {api};
