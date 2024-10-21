const axios = require('axios');
const path = require('path');
const fs = require('fs');

async function destinationModel(manager) {


    // 1. How To Become a Destination Expert and Get a Certificate?
    manager.addDocument('en', 'How to become a destination expert and get a certificate?', 'expert.certificate');
    manager.addDocument('en', 'How can I become a certified destination expert?', 'expert.certificate');
    manager.addDocument('en', 'What are the steps to earn a destination expert certificate?', 'expert.certificate');
    manager.addDocument('en', 'Can you guide me on getting certified as a destination expert?', 'expert.certificate');
    manager.addDocument('en', 'What is the process to become a certified destination expert?', 'expert.certificate');

    // 2. How to Customize Your Tour?
    manager.addDocument('en', 'How to customize your tour?', 'tour.customize');
    manager.addDocument('en', 'How can I personalize my tour package?', 'tour.customize');
    manager.addDocument('en', 'What are the steps to modify a tour?', 'tour.customize');
    manager.addDocument('en', 'Can you guide me on customizing my tour?', 'tour.customize');
    manager.addDocument('en', 'What’s the process to create a personalized tour?', 'tour.customize');

    // 3. How to Create Your Own Itinerary?
    // manager.addDocument('en', 'How to create your own itinerary?', 'itinerary.create');
    // manager.addDocument('en', 'How can I plan my own itinerary?', 'itinerary.create');
    // manager.addDocument('en', 'What steps should I take to create a custom itinerary?', 'itinerary.create');
    // manager.addDocument('en', 'How do I design a personalized travel itinerary?', 'itinerary.create');
    // manager.addDocument('en', 'Can you guide me on creating a tailor-made itinerary?', 'itinerary.create');

    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'toursModel.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);
}
module.exports = destinationModel;