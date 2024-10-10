// Core libraries
const path = require('path');

// Third party libraries
const express = require("express");
const cors = require('cors');
const ejs = require('ejs');
require('dotenv').config();
const { NlpManager, BrainNLU } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'], forceNER: true });
var nspell = require('nspell');
const mongoose = require('mongoose');
let spell;
let dictionary;
const app = express();
app.set('view engine', 'ejs');

// Local libraries
const processResponse = require("./services/processResponse");
const allCorpuses = require("./modelData/saveAllModels");
const addEntities = require("./entities/entities");
const { getFileData } = require("./database/db");

// Enable Cross-Origin Resource Sharing (CORS) for all origins
app.use(cors({ origin: "*" }));

// Static Middleware
app.use('/views', express.static(path.join(__dirname, 'views')));

app.post('/agentId', async (req, res, next) => {
    const data = await getFileData(req.body.agentId);
    if (data || (Object.keys(data).length == 0)) {
        res.status(200);
    } else {
        res.status(404);
    }
})

app.use('/', (req, res) => {
    console.log(req.query.userId);
    res.sendFile(path.join(__dirname, 'views', 'bot.html'));
})

const server = app.listen(3000, async () => {
    addEntities(manager);
    allCorpuses(manager);
    dictionary = await import('dictionary-en');
    spell = nspell(dictionary.default.aff, dictionary.default.dic)
    await mongoose.connect('mongodb+srv://ankitshdeveloper:Chatbot-4800@cluster0.lxxhdp6.mongodb.net/queries?retryWrites=true&w=majority&appName=Cluster0');
});

// Socmongoose.ket for live connections
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', async (socket) => {
    const { agentid } = socket.handshake.headers;

    if (agentid == undefined || agentid == null || agentid == "" || typeof agentid == "undefined") {
        io.emit('getLastData', "agentid is not provided");
    }

    socket.on('getLastData', async () => {
        const data = await getFileData(agentid);

        if (data.queries) {
            io.emit('getLastData', data.queries);
        }
    })

    socket.on('chat message', async (msg, agentid, rawValue) => {
        setTimeout(async () => {
            await processResponse(msg, manager, io, agentid, rawValue);
        }, 2000);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    // socket.on('autocomplete', async (query) => {
    //     console.log('autocomplete')
    //     const result = [];
    //     const records = Object.keys(COUNTRIES);
    //     for (const record of records) {
    //         if (record.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) > -1) {
    //             result.push(record);
    //         }
    //     }
    //     console.log(result);
    //     return io.emit('autocomplete', result);;
    // });
});