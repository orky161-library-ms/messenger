const {publish} = require("./index")

function sendChatMessage(user, message) {
    publish("", process.env.SEND_CLIENT_MESSAGE, Buffer.from(JSON.stringify({user, message})))
}

module.exports = {
    sendChatMessage,
}
