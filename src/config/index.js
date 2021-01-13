const mysql = require('mysql2');
const amqp = require('amqplib/callback_api');
const {startPublisher} = require("../queue/rabbit/producers");
const {channelConsume} = require("../queue/rabbit/consumers");
const LibraryAuth = require("library.io-libs/dist/authorization")
const cassandra = require('cassandra-driver');

const cassandraClient = new cassandra.Client({
    keyspace: 'test_keyspace',
    localDataCenter: "datacenter1",
    contactPoints:["localhost:9042"]
});

function createRabbitConnection (){
    amqp.connect(process.env.RABBIT_URL + "?heartbeat=60", async (err, conn) => {
        if (err) {
            console.error("[AMQP]", err.message);
            return setTimeout(createRabbitConnection, 1500 + (Math.random() * 3000));
        }
        conn.on("error", (err) => {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });
        conn.on("close", () => {
            console.error("[AMQP] reconnecting");
            return setTimeout(createRabbitConnection, 1500 + (Math.random() * 3000));
        });
        console.log("[AMQP] connected");
        await channelConsume(conn)
        await startPublisher(conn)
    });
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
});

const promisePool = pool.promise();

const libraryAuth = new LibraryAuth(process.env.TOKEN_PRIVATE_KEY)

module.exports = {
    pool: promisePool,
    createRabbitConnection,
    libraryAuth,
    cassandraClient
}
