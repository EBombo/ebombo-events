const logger = require("../../../utils/logger");
const {defaultTo} = require("lodash");
const {firestore} = require("../../../config");

exports.getManifest = async (req, res, next) => {
    try {
        logger.log("getManifest->", req.params);

        let {domain} = req.params;

        const manifestRef = await firestore.doc(`settings/manifest`).get();

        let manifest = manifestRef.data();

        domain = domain.replace(".", "&").replace(".", "&");

        manifest = manifest[domain];

        res.set("Content-Type", "application/json");

        return res.send({...defaultTo(manifest, {})});
    } catch (error) {
        logger.error(error);
        next(error);
    }
};
