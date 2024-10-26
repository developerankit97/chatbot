const path = require('path');
const fs = require('fs');
const { getAllQueries } = require('../../services/services');

module.exports = async (manager) => {

    manager.addDocument('en', 'query status', 'query.status');
    manager.addDocument('en', 'my last queries', 'query.status');

    manager.addAnswer('en', 'query.status', async function (agentId, context, query, response, io, socketId) {
        return await getAllQueries(agentId);
    });

    manager.addDocument('en', 'query details %number% %name%', 'query.details');
    manager.addAnswer('en', 'query.details', async function (agentId, context, query, response, io, socketId) {
        return [`<a href="#" onClick="wundow.open('https://cultureholidays.com/home/chaturl?id=${query.split(' ')[2]}/Open/${query.split(' ')[3]}/A//')"`];
    })

    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'queryStatus.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);
}