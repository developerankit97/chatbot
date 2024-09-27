// Core libraries

// Third party libraries
const express = require("express");
const cors = require('cors');
const ejs = require('ejs');
const path = require('path');
const { NlpManager, BrainNLU } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'], forceNER: true });
const dictionary = require('dictionary-en')
const nspell = require('nspell')
const spell = nspell(a)

dictionary(ondictionary)
function ondictionary(err, dict) {
    if (err) {
        throw err
    }

    var spell = nspell(dict)

    console.log(spell.correct('colour')) // => false
    console.log(spell.suggest('colour')) // => ['color']
    console.log(spell.correct('color')) // => true
    console.log(spell.correct('npm')) // => false
    spell.add('npm')
    console.log(spell.correct('npm')) // => true
}
const app = express();

// Local libraries
const { COUNTRIES } = require("./utils/helpers");
const processResponse = require("./utils/processResponse");
const allCorpuses = require("./models/saveAllModels");
const addEntities = require("./entities/entities");

// Enable Cross-Origin Resource Sharing (CORS) for all origins
app.use(cors({ origin: "*" }));

// Static Middleware
app.use(express.static(path.join(__dirname, 'utils')))


app.set('view engine', 'ejs');

const server = app.listen(3000, async () => {
    addEntities(manager);
    allCorpuses(manager);
});

// Socket for live connections
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('autocomplete', async (query) => {
        console.log(query);
        const result = [];
        const records = Object.keys(COUNTRIES);
        for (const record of records) {
            if (record.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) > -1) {
                result.push(record);
            }
        }
        console.log(result);
        return io.emit('autocomplete', result);;
    });
    socket.on('chat message', async (msg) => {
        setTimeout(async () => {
            await processResponse(msg, manager, io);
        }, 2000);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


