const { INTENTS, ENTITIES, COUNTRIES } = require('./helpers');
const { insert } = require('./db');

module.exports = async (msg, manager, io) => {
    const response = await manager.process('en', msg);
    console.log(response.intent, response.answer, response.entities);

    if (response.entities.length > 0) {
        const entity = response.entities.map((entity) => entity.sourceText)
        return io.emit('chat message', entity);
    }
    let query = {}
    query[msg] = (response.intent + '\n' + response.answer);

    await insert(query);
    let sendReponse;
    if (typeof response.answer === 'function' && response.answer.constructor.name === 'AsyncFunction') {
        console.log('response.answer is an async function');
        sendReponse = await response.answer(msg);
        console.log(sendReponse)
        return io.emit('chat message', sendReponse);
    }
    if (INTENTS[response.intent]) {
        console.log('working', typeof INTENTS[response.intent]);
        if (typeof INTENTS[response.intent] == 'function') {
            sendReponse = await INTENTS[response.intent]();
        } else {
            sendReponse = ENTITIES[response.entities?.[0]?.entity] && ENTITIES[response.entities[0].entity](response.entities[0].sourceText);
        }

        return io.emit('chat message', sendReponse);
    }
    if (response.answer == undefined) {
        io.emit('chat message', "I'm sorry, I didn't understand that. Would you like to talk about it with our expert?");
        return;
    }
    if (response.score > 0.8 || response.sentiment.numWords > 2) {
        sendReponse = response.answer;
    } else {
        sendReponse = "I'm sorry, I didn't understand that. Would you like to talk about it with our expert?"
    }
    io.emit('chat message', sendReponse);
}



// if (typeof response.answer === 'function' && response.answer.constructor.name === 'AsyncFunction') {
//     console.log('response.answer is an async function');
//     sendReponse = await response.answer(msg);
//     return;
// } else {

// }