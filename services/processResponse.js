const { COUNTRIES, stopwordList, context } = require('../utils/helpers');
const { INTENTS, ENTITIES } = require('./services');
const { insert, Query } = require('../database/db');
const { NlpManager } = require('node-nlp');
const path = require('path');
const { removeStopwords } = require('stopword');
const { Hercai } = require('hercai');
const { model } = require('mongoose');
const herc = new Hercai();

module.exports = async (msg, manager, io, id, socket, rawValue) => {
    const dbValueKey = (typeof rawValue == 'undefined' || rawValue == null) ? msg : rawValue;
    console.log(rawValue == null, msg, rawValue, dbValueKey);
    msg = msg.replace(/\?/g, ' '); // Replace all '?' with a space
    const filterMessage = removeStopwords(msg.split(' '), stopwordList).join(' ');

    const { Filter } = await import('bad-words');
    const filter = new Filter();
    if (filter.isProfane(filterMessage)) {
        return io.to(socket.id).emit('chat message', `We aim for positive and helpful interactions.<br>Could you kindly ask something else related to your travel inquiries? 
    <br>I’m here to help with any travel-related questions you may have!`);
    }
    const response = await manager.process('en', filterMessage, { useSimilarSearch: true });
    if (response.intent == 'None') {
        herc.question({ model: "v3", content: msg }).then(response => {
            io.to(socket.id).emit('chat message', response.reply);
        });
        return;
    }
    console.log(response);
    response.entities.forEach(entity => {
        if (entity.entity == 'country') {
            (!context[id]) && (context[id] = {});
            context[id]['country'] = entity.sourceText;
        }
        if (entity.entity == 'countrycode') {
            (!context[id]) && (context[id] = {});
            context[id]['countrycode'] = entity.sourceText;
        }
    });
    let sendReponse;
    if (typeof response.answer === 'function' || typeof response.answer === 'AsyncFunction') {
        sendReponse = await response.answer(filterMessage, response.entities, id, io);
        await insert({ [dbValueKey]: sendReponse }, id);
        const newQuery = new Query({
            query: dbValueKey,
            reply: response.intent
        });
        newQuery.save();
        return io.to(socket.id).emit('chat message', sendReponse);
    }
    if (response.answer == undefined) {
        await insert({ [dbValueKey]: response.answer }, id);
        const newQuery = new Query({
            query: dbValueKey,
            reply: response.intent
        });
        newQuery.save();
        io.to(socket.id).emit('chat message', "I'm sorry, I didn't understand that. Would you like to talk about it with our expert?");
        return;
    }
    if (response.score > 0.8) {
        sendReponse = response.answer;
        console.log(id);
        await insert({ [dbValueKey]: sendReponse }, id);
        const newQuery = new Query({
            query: dbValueKey,
            reply: response.intent
        });
        newQuery.save();
    } else {
        sendReponse = "I'm sorry, I didn't understand that. Would you like to talk about it with our expert?"
    }
    io.to(socket.id).emit('chat message', sendReponse);
}