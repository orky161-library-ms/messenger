require("express-async-errors")
const express = require('express')
const MessengerLogic = require("../controller/messenger")
const {LibraryRoles} = require("../../../library.io-libs/dist/roles");
const {libraryAuth} = require("../config/index")
const {verifyPermission, decodeToken, equalField} = libraryAuth

const router = express.Router()

router.get("/:id/member/:member", [decodeToken, equalField("id")], (async (req, res) => {
    const room = await MessengerLogic.getRoomChatByMembers({member1: req.params.id, member2: req.params.member})
    res.status(200).json({room})
}))

router.get("/:id/member/:member/messages", [decodeToken, equalField("id")], (async (req, res) => {
    const messages = await MessengerLogic.getMessagesByRoom({member1: req.params.id, member2: req.params.member})
    res.status(200).json({messages})
}))

router.post("/:id/message", [decodeToken, equalField("id")], (async (req, res) => {
    await MessengerLogic.sendMessage({...req.body, transmitter: req.params.id})
    res.status(202).json({message: "success"})
}))

module.exports = router

