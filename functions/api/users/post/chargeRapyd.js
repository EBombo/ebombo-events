const https = require("https");
const crypto = require("crypto");
const accessKey = "<your-access-key>";
const secretKey = "<your-secret-key>";
const log = false;

const makeRequest = async (method, urlPath, body = null) => {
    try {
        const httpMethod = method;
        const httpBaseURL = "sandboxapi.rapyd.net";
        const httpURLPath = urlPath;
        const salt = generateRandomString(8);
        const idempotency = new Date().getTime().toString();
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = sign(httpMethod, httpURLPath, salt, timestamp, body);

        const options = {
            hostname: httpBaseURL,
            port: 443,
            path: httpURLPath,
            method: httpMethod,
            headers: {
                "Content-Type": "application/json",
                salt: salt,
                timestamp: timestamp,
                signature: signature,
                access_key: accessKey,
                idempotency: idempotency,
            },
        };

        return await httpRequest(options, body, log);
    } catch (error) {
        console.error("Error generating request options");
        throw error;
    }
};

const sign = (method, urlPath, salt, timestamp, body) => {
    try {
        let bodyString = "";
        if (body) {
            bodyString = JSON.stringify(body);
            bodyString = bodyString === "{}" ? "" : bodyString;
        }

        let toSign =
            method.toLowerCase() +
            urlPath +
            salt +
            timestamp +
            accessKey +
            secretKey +
            bodyString;
        log && console.log(`toSign: ${toSign}`);

        let hash = crypto.createHmac("sha256", secretKey);
        hash.update(toSign);
        const signature = Buffer.from(hash.digest("hex")).toString("base64");
        log && console.log(`signature: ${signature}`);

        return signature;
    } catch (error) {
        console.error("Error generating signature");
        throw error;
    }
};

const generateRandomString = (size) => {
    try {
        return crypto.randomBytes(size).toString("hex");
    } catch (error) {
        console.error("Error generating salt");
        throw error;
    }
};

const httpRequest = async (options, body) => {
    return new Promise((resolve, reject) => {
        try {
            let bodyString = "";
            if (body) {
                bodyString = JSON.stringify(body);
                bodyString = bodyString === "{}" ? "" : bodyString;
            }

            log && console.log(`httpRequest options: ${JSON.stringify(options)}`);
            const req = https.request(options, (res) => {
                let response = {
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: "",
                };

                res.on("data", (data) => {
                    response.body += data;
                });

                res.on("end", () => {
                    response.body = response.body ? JSON.parse(response.body) : {};
                    log &&
                    console.log(`httpRequest response: ${JSON.stringify(response)}`);

                    if (response.statusCode !== 200) {
                        return reject(response);
                    }

                    return resolve(response);
                });
            });

            req.on("error", (error) => {
                return reject(error);
            });

            req.write(bodyString);
            req.end();
        } catch (err) {
            return reject(err);
        }
    });
};

exports.makeRequest = makeRequest;
