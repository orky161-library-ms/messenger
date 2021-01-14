require('dotenv').config("./env");
const {checkConnection} = require("./dal/messenger")
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const messengerRoutes = require("./routes/messenger")
const {createRabbitConnection} = require("./config/index")

const app = express()
const port = 30007

app.use(cors())
app.use(bodyParser.json())
app.use("/api/messenger", messengerRoutes)

app.get('/ping', function (req, res) {
    res.status(200).json({msg: "ping"})
})

app.get('/health', async function (req, res) {
    await checkConnection()
    res.status(200).json({msg: "health"})
})

app.listen(port, () => {
    createRabbitConnection()
    console.log(`app listening at http://localhost:${port}`);
});

