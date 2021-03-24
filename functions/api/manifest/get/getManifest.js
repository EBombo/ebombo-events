const logger = require("../../../utils/logger");
const {defaultTo, get} = require("lodash");
const {firestore} = require("../../../config");

exports.getManifest = async (req, res, next) => {
    try {
        logger.log("getManifest->", req.params);

        let {domain} = req.params;

        const manifestRef = await firestore
            .doc(`settings/manifest`)
            .get();

        let manifest = manifestRef.data();

        domain = domain.replace(".", "&").replace(".", "&");

        manifest = get(manifest, domain);

        logger.log("manifest->", manifest);

        res.set('Content-Type', 'application/json');

        return res.send({...defaultTo(manifest, {})});
    } catch (error) {
        logger.error(error);
        next(error);
    }
};
