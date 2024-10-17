// Core libraries
const path = require('path');

// Third party libraries
const express = require("express");
const cors = require('cors');
const ejs = require('ejs');
require('dotenv').config();
const { NlpManager, BrainNLU } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'], forceNER: true });
let nspell = require('nspell');
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

app.use('/chatbot-widget', (req, res) => {
    // Serve the chatbot JS dynamically
    const userId = req.query.userId || 'defaultId';

    res.setHeader('Content-Type', 'application/javascript');

    res.send(`
    (function() {
      var userId = '${userId}';
      var chatWidget = document.createElement('div');
      chatWidget.id = 'chatbot-widget';
      chatWidget.style.position = 'fixed';
      chatWidget.style.bottom = '20px';
      chatWidget.style.right = '20px';
      chatWidget.style.width = '60px';
      chatWidget.style.height = '60px';
      chatWidget.style.borderRadius = '50%';
      chatWidget.style.backgroundColor = '#0078ff';
      chatWidget.style.cursor = 'pointer';

      var iconImage = document.createElement('img');
      iconImage.src = 'http://127.0.0.1:3000/views/bot-logo.png';
      iconImage.alt = 'Chatbot Icon';
      iconImage.style.width = '100%';
      iconImage.style.height = '100%';
      iconImage.style.borderRadius = '50%';
      chatWidget.appendChild(iconImage);

      var iframe = document.createElement('iframe');
      iframe.src = 'http://127.0.0.1:3000?userId=' + userId;
      iframe.style.display = 'none';
      iframe.style.width = '400px';
      iframe.style.height = '500px';
      iframe.style.border = 'none';
      chatWidget.appendChild(iframe);

      document.body.appendChild(chatWidget);

      chatWidget.addEventListener('click', function () {
        if (iframe.style.display === 'none') {
          iframe.style.display = 'block';
          chatWidget.style.width = '400px';
          chatWidget.style.height = '500px';
          iconImage.style.display = 'none';
        } else {
          iframe.style.display = 'none';
          chatWidget.style.width = '60px';
          chatWidget.style.height = '60px';
          iconImage.style.display = 'block';
        }
      });
    })();
  `);
})

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

// app.use('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'bot.html'));
// })

const server = app.listen(3000, async () => {
    addEntities(manager);
    allCorpuses(manager);
    dictionary = await import('dictionary-en');
    spell = nspell(dictionary.default.aff, dictionary.default.dic)
    await mongoose.connect(process.env.db);
});

// Socmongoose.ket for live connections
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', async (socket) => {
    console.log(socket.id, 'hello');
    const agentId = socket.handshake.headers['agentid'];;
    console.log(agentId);
    if (agentId && agentId.length > 0) {
        const data = await getFileData(agentId);

        if (data.queries) {
            io.emit('getLastData', data.queries);
        }
    }
    socket.on('getLastData', async (agentid) => {
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