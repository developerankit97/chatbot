const axios = require('axios');
const path = require('path');
const fs = require('fs');

module.exports = async (manager) => {
    // Add training data for greetings
    manager.addDocument('en', 'Hello', 'greeting.hello');
    manager.addDocument('en', 'Hi', 'greeting.hi');
    manager.addDocument('en', 'Hey', 'greeting.hey');
    manager.addDocument('en', 'Good morning', 'greeting.good.morning');
    manager.addDocument('en', 'Good afternoon', 'greeting.good.afternoon');
    manager.addDocument('en', 'Good evening', 'greeting.good.evening');
    manager.addDocument('en', 'How are you?', 'greeting.how.are.you');
    manager.addDocument('en', 'What’s up?', 'greeting.whats.up');
    manager.addDocument('en', 'Howdy', 'greeting.howdy');
    manager.addDocument('en', 'Greetings', 'greeting.greetings');
    manager.addDocument('en', 'Hey there', 'greeting.hey.there');
    manager.addDocument('en', 'Hi there', 'greeting.hi.there');
    manager.addDocument('en', 'Hello there', 'greeting.hello.there');
    manager.addDocument('en', 'Hiya', 'greeting.hiya');
    manager.addDocument('en', 'Hey buddy', 'greeting.hey.buddy');
    manager.addDocument('en', 'What’s happening?', 'greeting.whats.happening');
    manager.addDocument('en', 'How’s it going?', 'greeting.hows.it.going');
    manager.addDocument('en', 'Hello, how can I help you?', 'greeting.hello.how.can.i.help');
    manager.addDocument('en', 'Hi, what can I do for you today?', 'greeting.hi.what.can.i.do');
    manager.addDocument('en', 'Hey, how’s your day?', 'greeting.hey.hows.your.day');

    // Add responses with "Culture Holidays"
    manager.addAnswer('en', 'greeting.hello', 'Hello! Welcome to Culture Holidays. How can I assist you today?');
    manager.addAnswer('en', 'greeting.hi', 'Hi there! Welcome to Culture Holidays. What can I do for you?');
    manager.addAnswer('en', 'greeting.hey', 'Hey! You’re speaking with Culture Holidays. How can I help?');
    manager.addAnswer('en', 'greeting.good.morning', 'Good morning! Welcome to Culture Holidays. How can I assist you today?');
    manager.addAnswer('en', 'greeting.good.afternoon', 'Good afternoon! You’ve reached Culture Holidays. How can I help you?');
    manager.addAnswer('en', 'greeting.good.evening', 'Good evening! Culture Holidays is here to assist you. How can I help?');
    manager.addAnswer('en', 'greeting.how.are.you', 'I’m doing great, thanks for asking! How can Culture Holidays assist you?');
    manager.addAnswer('en', 'greeting.whats.up', 'Not much, just here at Culture Holidays! What can I do for you?');
    manager.addAnswer('en', 'greeting.howdy', 'Howdy! Welcome to Culture Holidays. How can I be of service today?');
    manager.addAnswer('en', 'greeting.greetings', 'Greetings! You’ve reached Culture Holidays. What can we assist you with?');
    manager.addAnswer('en', 'greeting.hey.there', 'Hey there! Culture Holidays is here to help. How can I assist you?');
    manager.addAnswer('en', 'greeting.hi.there', 'Hi there! Welcome to Culture Holidays. What’s up?');
    manager.addAnswer('en', 'greeting.hello.there', 'Hello there! Culture Holidays is here to assist you. How can I help?');
    manager.addAnswer('en', 'greeting.hiya', 'Hiya! Welcome to Culture Holidays. How can I help you today?');
    manager.addAnswer('en', 'greeting.hey.buddy', 'Hey buddy! Culture Holidays is ready to assist. What do you need?');
    manager.addAnswer('en', 'greeting.whats.happening', 'Not much, just helping out at Culture Holidays! How can I assist you?');
    manager.addAnswer('en', 'greeting.hows.it.going', 'It’s going great, thanks! How can Culture Holidays assist you today?');
    manager.addAnswer('en', 'greeting.hello.how.can.i.help', 'Hello! You’re speaking with Culture Holidays. How can I help you today?');
    manager.addAnswer('en', 'greeting.hi.what.can.i.do', 'Hi! Welcome to Culture Holidays. What can I do for you today?');
    manager.addAnswer('en', 'greeting.hey.hows.your.day', 'Hey! Culture Holidays is doing great, thanks for asking. How can I assist you?');
    
    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'greetingsModel.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);
}