const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {postError} = require("./error");
const {getManifest} = require("./manifest/get");
const {getResendVerifyCode} = require("./users/get");
const {getVerifyCode} = require("./users/get");
const {body} = require("express-validator");
const {validateRequest} = require("./validateRequest");
const {deleteUser} = require("./users/delete");
const {putUser} = require("./users/put");

const api = express();
const router = express.Router();

router.use(cors({origin: "*"}));

router.use(bodyParser.json());

router.use(bodyParser.urlencoded({extended: false}));

router.get("/", async (req, res) => res.send("Hello!"));

router.post("/users/:userId", [
    body("firstName").exists(),
    body("lastName").exists()
], validateRequest, () => console.log("post user"));

router.put("/users/:userId", [], validateRequest, putUser);

router.delete("/users/:userId", [], validateRequest, deleteUser);

router.get("/verify/:userId/verification-code/:verificationCode", getVerifyCode);

router.get("/verify/:userId/resend-code", getResendVerifyCode);

router.get("/manifest/:domain", getManifest);

app.post("/error-boundary", [], postError);

api.use("/api", router);

module.exports = {api};
