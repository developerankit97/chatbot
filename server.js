// Core libraries
const path = require('path');
const fs = require('fs');

// Third party libraries
const express = require("express");
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT
const mongoose = require('mongoose');
const { sendAndDeleteFile } = require('./services/services');


// NLP Manager libraries
const { NlpManager, BrainNLU } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'], forceNER: true });
// let nspell = require('nspell');
// let spell;
// let dictionary;

const app = express();
app.set('view engine', 'ejs');

// Local libraries
const processResponse = require("./services/processResponse");
const allCorpuses = require("./modelData/saveAllModels");
const addEntities = require("./entities/entities");
const { getFileData, saveFileData, Query } = require("./database/db");
const { COUNTRIES, sendResponseToClient, isValidArrayOrString, SOCKET_EVENTS } = require('./utils/helpers');

// Enable Cross-Origin Resource Sharing (CORS) for all origins
app.use(cors({ origin: "*" }));

// Static Middleware
app.use('/views', express.static(path.join(__dirname, 'views')));

app.use('/itinerary', sendAndDeleteFile)

const server = app.listen(PORT, async () => {
    addEntities(manager);
    allCorpuses(manager);
    dictionary = await import('dictionary-en');
    // spell = nspell(dictionary.default.aff, dictionary.default.dic)
    await mongoose.connect(process.env.db_uri);
});

// Socket for live connections
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on(SOCKET_EVENTS.CONNECTION, async (socket) => {
    const agentId = socket.handshake.headers['agentid'];;
    if (agentId && agentId.length > 0) {
        const data = await getFileData(agentId);
        data.queries && sendResponseToClient(io, socket.id, SOCKET_EVENTS.LAST_DATA, data.queries);
    }

    socket.on(SOCKET_EVENTS.LAST_DATA, async (agentid) => {
        const data = await getFileData(agentid);
        data.queries && sendResponseToClient(io, socket.id, SOCKET_EVENTS.LAST_DATA, data.queries);
    })

    socket.on(SOCKET_EVENTS.CHAT, async (query, agentId, userValue) => {
        setTimeout(async () => {
            await processResponse(io, socket.id, manager, agentId, query, userValue);
        }, 1000);
    });

    socket.on(SOCKET_EVENTS.CLEAR_CHAT, async (query, agentId, userValue)=>{
        try {
            const data = await getFileData(agentId);
            data.queries = [];
            await saveFileData(agentId, data);
        } catch (error) {
            console.log(error.response); 
        }
    })

    socket.on(SOCKET_EVENTS.FORM_SUBMIT, async (formData, agentId) => {
        const data = await getFileData(agentId);
        data.feedback = { ...formData };
        await saveFileData(agentId, data)
    })

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
        console.log('user disconnected');
    });
    socket.on(SOCKET_EVENTS.AUTO_COMPLETE, async (query) => {
        !isValidArrayOrString(query) && sendResponseToClient(io, socket.id, SOCKET_EVENTS.AUTO_COMPLETE, []);

        isValidArrayOrString(query) && (() => {
            const result = [];
            const records = Object.keys(COUNTRIES); 
            for (let record of records) {
                const value = [record.replace(' ', ''), record];
                if (value[0].toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) > -1) {
                    result.push(value[1]);
                }
            }
            sendResponseToClient(io, socket.id, SOCKET_EVENTS.AUTO_COMPLETE, result);
        })();
    });
});
