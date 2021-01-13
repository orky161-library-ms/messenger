const {cassandraClient} = require('../config/index')
const messagesQuery = require("./query_builder/queries")
const TimeUuid = require('cassandra-driver').types.TimeUuid;

async function getRoomChatByMembers(member1, member2) {
    const rooms = await cassandraClient.execute(messagesQuery.getRoomChatByMembers, [member1, member2], { prepare : true })
    if (rooms.rows[0])
        return rooms.rows[0].id
}

async function createChat(member1, member2) {
    const timeId = TimeUuid.now();
    await cassandraClient.execute(messagesQuery.createRoomChat, [member1, member2, timeId], { prepare : true })
    return timeId
}

async function sendMessage(roomId ,transmitter, message) {
    await cassandraClient.execute(messagesQuery.createMessage, [roomId ,transmitter, message], { prepare : true })
}

async function getMessagesByRoom(room) {
    const messages = await cassandraClient.execute(messagesQuery.getMessagesByRoomChat, [room], { prepare : true })
    console.log(messages)
    return messages.rows
}

function checkConnection() {
    return cassandraClient.execute(messagesQuery.checkConnectionQuery, [], { prepare : true })
}

module.exports = {
    checkConnection,
    sendMessage,
    createChat,
    getRoomChatByMembers,
    getMessagesByRoom,

}
