const { isUndefinedNullOrFalsy, filterQueryForChat, updateContextWithEntities, SOCKET_EVENTS, undefinedText, sendResponseToClient } = require('../utils/helpers');
const { insert, Query } = require('../database/db');

module.exports = async (io, socketId, manager, agentId, customizeQuery, userRawQuery) => {
    console.log(customizeQuery, userRawQuery, 'customizeQuery, userRawQuery');
    const queryAsKeyForDB = isUndefinedNullOrFalsy(userRawQuery) ? customizeQuery : userRawQuery;
    console.log(queryAsKeyForDB, 'queryAsKeyForDB');
    const filteredQuery = await filterQueryForChat(io, socketId, customizeQuery);
    if (filteredQuery) {
        const response = await manager.process('en', filteredQuery, { useSimilarSearch: true });
        console.log(response.intent, 'intent');
        const context = await updateContextWithEntities(agentId, response.entities);
        let sendReponse;
        if (typeof response.answer === 'function' || typeof response.answer === 'AsyncFunction') {
            sendReponse = await response.answer(agentId, context, filteredQuery, response.entities, io);
            try {
                if (sendReponse) {
                    await insert({ [queryAsKeyForDB]: sendReponse }, agentId);
                    Query.create({
                        query: queryAsKeyForDB,
                        reply: response.intent
                    });
                }
            } catch (error) {
                console.log('do nothing');
            }
            return io.to(socketId).emit('chat message', sendReponse);
        }
        if (response.answer == undefined) {
            await insert({ [queryAsKeyForDB]: undefinedText }, agentId);
            Query.create({
                query: queryAsKeyForDB,
                reply: undefinedText
            });
            sendResponseToClient(io, socketId, SOCKET_EVENTS.CHAT, undefinedText);
            return;
        }
        if (response.score > 0.8) {
            sendReponse = response.answer;
            try {
                await insert({ [queryAsKeyForDB]: sendReponse }, agentId);
                Query.create({
                    query: queryAsKeyForDB,
                    reply: response.intent
                });
            } catch (error) {
                console.log('do nothing')
            }
        }
        else {
            sendReponse = undefinedText;
            await insert({ [queryAsKeyForDB]: sendReponse }, agentId);
            Query.create({
                query: queryAsKeyForDB,
                reply: sendReponse
            });
        }
        sendResponseToClient(io, socketId, SOCKET_EVENTS.CHAT, sendReponse);
    }
}


// if (response.intent == 'None') {
//     herc.question({ model: "v3", content: query }).then(response => {
//         console.log(response, 'hercai')
//         io.to(socketId).emit('chat message', response.reply);
//     });
//     return;
// }