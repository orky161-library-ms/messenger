
const checkConnectionQuery = "SELECT now() FROM system.local"


const getRoomChatByMembers = `SELECT id FROM rooms_by_members WHERE member1 = ? AND member2 = ?`;
const createRoomChat = `INSERT INTO rooms_by_members (member1, member2, id, createdOn) VALUES (?, ?, ?, toUnixTimestamp(now()))`;

const createMessage = `INSERT INTO messages_by_room (room, id , sender, message, createdOn) VALUES (?, now(), ?, ?, toUnixTimestamp(now()))`;
const getMessagesByRoomChat = `SELECT * FROM messages_by_room WHERE room = ?`;



module.exports ={
    checkConnectionQuery,
    createRoomChat,
    createMessage,
    getMessagesByRoomChat,
    getRoomChatByMembers
}
