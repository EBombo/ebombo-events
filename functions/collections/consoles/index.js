const {firestore} = require("../../config");

const fetchConsole = async (consoleId) => {
    const console_ = await firestore.doc("consoles/" + consoleId).get();
    return console_.data();
};

module.exports = {fetchConsole};
