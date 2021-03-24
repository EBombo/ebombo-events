const {firestore} = require("../../config");

const fetchSettings = async () => {
    const settings = await firestore.doc("settings/default").get();
    return settings.data();
};

module.exports = {fetchSettings};
