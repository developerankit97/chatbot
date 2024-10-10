const axios = require('axios');
const path = require('path');
const fs = require('fs');

module.exports = async function rewardModel(manager) {

    // 1. How To Claim Your Commission?
    manager.addDocument('en', 'How to claim your commission?', 'commission.claim');
    manager.addDocument('en', 'How do I claim my commission?', 'commission.claim');
    manager.addDocument('en', 'What are the steps to get my commission?', 'commission.claim');
    manager.addDocument('en', 'How can I request my commission?', 'commission.claim');
    manager.addDocument('en', 'Can you guide me on how to claim my commission?', 'commission.claim');

    // 2. How To Create Your Own Flyer?
    manager.addDocument('en', 'How to create your own flyer?', 'flyer.create');
    manager.addDocument('en', 'How do I make a flyer for my tour?', 'flyer.create');
    manager.addDocument('en', 'What steps should I take to design a flyer?', 'flyer.create');
    manager.addDocument('en', 'How can I create a tour flyer?', 'flyer.create');
    manager.addDocument('en', 'Can you guide me on creating a flyer for a tour?', 'flyer.create');

    // 3. How To Create Your Own Website?
    manager.addDocument('en', 'How to create your own website?', 'website.create');
    manager.addDocument('en', 'How do I build my own website?', 'website.create');
    manager.addDocument('en', 'What are the steps to create my travel website?', 'website.create');
    manager.addDocument('en', 'How can I make a website for my business?', 'website.create');
    manager.addDocument('en', 'Can you guide me on how to create my own website?', 'website.create');

    // 4. How to Create Your Own Flyer for a New Tour?
    manager.addDocument('en', 'How to create your own flyer for a new tour?', 'flyer.new_tour');
    manager.addDocument('en', 'How do I design a flyer for a new tour?', 'flyer.new_tour');
    manager.addDocument('en', 'What steps should I take to make a flyer for a new tour?', 'flyer.new_tour');
    manager.addDocument('en', 'How can I create a flyer for a newly launched tour?', 'flyer.new_tour');
    manager.addDocument('en', 'Can you guide me on designing a flyer for a new tour?', 'flyer.new_tour');

    manager.addAnswer('en', 'flyer.new_tour', 'I Got Rewards')

    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'rewardsModel.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);
}
