const {closeOnErr, processMsg} = require("./utils")

async function channelConsume(conn){
    conn.createChannel(function(err, ch) {
        if (closeOnErr(err)) return;
        ch.on("error", function(err) {
            console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function() {
            console.log("[AMQP] channel closed");
        });

        ch.prefetch(10);
        createAuthorQueue(conn, ch)
    });
}

function createAuthorQueue (conn, ch){
    ch.assertQueue(process.env.CREATE_AUTHOR_QUEUE, { durable: true }, function(err, _ok) {
        if (closeOnErr(err)) return;
        ch.consume(process.env.CREATE_AUTHOR_QUEUE, processMsg(conn, ch, createAuthorWorker), { noAck: false });
        console.log("Worker is started");
    });

}

function createAuthorWorker(msg, cb) {
    require("../../../controller/authors").addAuthor(JSON.parse(msg.content.toString())).then(()=>{
        cb(true);
    })
}

module.exports ={
    channelConsume
}
