const express = require("express");
const cors = require('cors');
const { NlpManager } = require('node-nlp');
const { trainModel } = require("./models");
const manager = new NlpManager({ languages: ['en'], forceNER: true });
const app = express();
app.use(cors({ origin: "*" }));

const server = app.listen(3000, async () => {
    await trainModel(manager);
});
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', async (msg) => {
        console.log(msg);
        setTimeout(async () => {
            const response = await manager.process('en', msg);
            console.log(response);
            if (response.answer == undefined) {
                io.emit('chat message', "I'm sorry, I didn't understand that. Would you like to talk about it with our expert?");
                return;
            }
            let sendReponse;
            if (typeof response.answer === 'function' && response.answer.constructor.name === 'AsyncFunction') {
                console.log('response.answer is an async function');
                sendReponse = await response.answer(msg);
            } else {
                sendReponse = response.answer;
            }
            io.emit('chat message', sendReponse);
        }, 2000);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


