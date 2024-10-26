const path = require('path');
const fs = require('fs');

module.exports = async (manager) => {
    // Queries about what is a flyer
    manager.addDocument('en', 'customer service', 'customer.service');
    manager.addDocument('en', 'service and support', 'customer.service');

    // Responses for what a flyer is
    manager.addAnswer('en', 'customer.service', async function (agentId, context, filteredQuery, entities, io) {

        return [`Email: <b>info@cultureholidays.com</b><br><br>WhatsApp : <b>(+91) 987 355 5111</b><br><br>Phone: <b>800 315 0755</b>`];
    });

    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'customerService.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);
}