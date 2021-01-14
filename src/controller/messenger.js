const MessengerDal = require('../dal/messenger')
const {sendChatMessage} = require("../queue/rabbit/producers/publish");

async function getRoomChatByMembers({member1, member2}) {
    const mem1 = Math.min(member1, member2);
    const mem2 = Math.max(member1, member2);
    let room = await MessengerDal.getRoomChatByMembers(mem1, mem2)
    if (!room)
        room = await MessengerDal.createChat(mem1, mem2)
    return room
}

async function sendMessage({transmitter, receiver, message}) {
    const roomId = await getRoomChatByMembers({member1: transmitter, member2: receiver})
    await MessengerDal.sendMessage(roomId ,transmitter, message)
    sendChatMessage(receiver, message)
}

async function getMessagesByRoom({member1, member2}) {
    const roomId = await getRoomChatByMembers({member1, member2})
    return MessengerDal.getMessagesByRoom(roomId)
}

module.exports = {
    getRoomChatByMembers,
    sendMessage,
    getMessagesByRoom,
}
