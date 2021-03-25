const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {Knockout} = require("./tournamentGroups");
const {postForwardingBallots} = require("./ballots/post");

const api = express();

api.use(cors({origin: "*"}));

api.use(bodyParser.json());

api.use(bodyParser.urlencoded({extended: false}));

api.get("/", async (req, res) => res.send("Hello!"));

api.post(
    "/transactions/:transactionId/forwarding-ballots",
    postForwardingBallots
);

api.post("/tournaments/:tournamentId/tournament-groups/knockout", Knockout);

module.exports = {api};
