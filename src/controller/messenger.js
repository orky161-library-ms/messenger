const MessengerDal = require('../dal/messenger')


async function getRoomChatByMembers({member1, member2}) {
    const mem1 = Math.min(member1, member2);
    const mem2 = Math.max(member1, member2);
    let room = await MessengerDal.getRoomChatByMembers(mem1, mem2)
    if (!room)
        room = await MessengerDal.createChat(mem1, mem2)
    return room
}

async function sendMessage({roomId, transmitter, message}) {
    await MessengerDal.sendMessage(roomId ,transmitter, message)
}

async function getMessagesByRoom(room) {
    return MessengerDal.getMessagesByRoom(room)
}

module.exports = {
    getRoomChatByMembers,
    sendMessage,
    getMessagesByRoom,
}
