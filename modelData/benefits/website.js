const axios = require('axios');
const path = require('path');
const fs = require('fs');

module.exports = async (manager) => {
    // Queries about what is a flyer
    manager.addDocument('en', 'create website', 'website.info');
    manager.addDocument('en', 'need website', 'website.info');
    manager.addDocument('en', 'how create website', 'website.info');
    manager.addDocument('en', 'give website', 'website.info');
    manager.addDocument('en', 'build website', 'website.info');

    // Responses for what a flyer is
    manager.addAnswer('en', 'website.info', async () => {
        return [`
        Want to boost your business with a professional online presence? Creating your own website is a powerful way to attract more clients and showcase your travel packages effortlessly! 🌐<br>
        Click the link below to get started and enjoy these benefits:<br>
        - Increase your visibility to a global audience<br>
        - Offer clients a seamless booking experience<br>
        - Highlight special offers, tour packages, and promotions<br>
    `, `<a href="javascript:void(0);" onclick="window.open('https://cultureholidays.com/createyourwebsite', '_blank'); return false;">Start Creating Your Website Now!</a>`]
    });
     
    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'websiteModel.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);
}