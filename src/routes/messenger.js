require("express-async-errors")
const express = require('express')
const MessengerLogic = require("../controller/messenger")
const {LibraryRoles} = require("../../../library.io-libs/dist/roles");
const {libraryAuth} = require("../config/index")
const {verifyPermission, decodeToken, equalField} = libraryAuth

const router = express.Router()

router.get("/room/:id/member/:member", (async (req, res) => {
    const room = await MessengerLogic.getRoomChatByMembers({member1: req.params.id, member2: req.params.member})
    res.status(200).json({room})
}))

router.get("/room/:room/messages",(async (req, res) => {
    const messages = await MessengerLogic.getMessagesByRoom(req.params.room)
    res.status(200).json({messages})
}))

router.post("/message/:id",(async (req, res) => {
    await MessengerLogic.sendMessage({...req.body, transmitter: req.params.id})
    res.status(202).json({message: "success"})
}))

module.exports = router

