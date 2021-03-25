const {firestore} = require("../../config");

const fetchSettings = async () => {
    const settings = await firestore.doc("settings/default").get();
    return settings.data();
};

const updateSetting = async (settingId, setting) =>
    await firestore.doc(`settings/${settingId}`).update(setting);

module.exports = {fetchSettings, updateSetting};
