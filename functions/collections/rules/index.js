const {firestore} = require("../../config");

const fetchRule = async (gameRuleId) => {
    const rule = await firestore.doc("rules/" + gameRuleId).get();
    return rule.data();
};

module.exports = {fetchRule};
