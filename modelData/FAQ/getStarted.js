const axios = require('axios');
const path = require('path');
const fs = require('fs');

async function getStartedModel(manager) {

    // 1. How to Register as a Travel Agent with Culture Holidays?
    manager.addDocument('en', 'How to register as a travel agent with Culture Holidays?', 'agent.register');
    manager.addDocument('en', 'How do I sign up as a travel agent for Culture Holidays?', 'agent.register');
    manager.addDocument('en', 'Can you guide me on how to become a registered travel agent?', 'agent.register');
    manager.addDocument('en', 'How can I create a travel agent account on Culture Holidays?', 'agent.register');
    manager.addDocument('en', 'What are the steps to register as a travel agent with Culture Holidays?', 'agent.register');

    // 2. How to Log into Your Travel Agent Account?
    manager.addDocument('en', 'How to log into your travel agent account?', 'agent.login');
    manager.addDocument('en', 'How do I sign into my travel agent account?', 'agent.login');
    manager.addDocument('en', 'How can I access my travel agent account?', 'agent.login');
    manager.addDocument('en', 'What steps should I follow to log in as a travel agent?', 'agent.login');
    manager.addDocument('en', 'Can you tell me how to log into my travel agent dashboard?', 'agent.login');

    // 3. Forgot Your Password? How to Recover?
    manager.addDocument('en', 'Forgot your password? How to recover?', 'agent.password_recover');
    manager.addDocument('en', 'I forgot my password, how can I reset it?', 'agent.password_recover');
    manager.addDocument('en', 'How do I recover my travel agent account password?', 'agent.password_recover');
    manager.addDocument('en', 'Can I reset my password for my travel agent account?', 'agent.password_recover');
    manager.addDocument('en', 'How can I retrieve my travel agent password?', 'agent.password_recover');

    // 4. How to Update Your Profile as a Travel Agent?
    manager.addDocument('en', 'How to update your profile as a travel agent?', 'agent.update_profile');
    manager.addDocument('en', 'How can I update my travel agent profile?', 'agent.update_profile');
    manager.addDocument('en', 'What steps do I need to follow to edit my travel agent profile?', 'agent.update_profile');
    manager.addDocument('en', 'Can I change my travel agent account details? How?', 'agent.update_profile');
    manager.addDocument('en', 'How do I modify my profile as a travel agent on Culture Holidays?', 'agent.update_profile');

    // 5. How to Contact Support for Travel Agents?
    manager.addDocument('en', 'How to contact support for travel agents?', 'agent.contact_support');
    manager.addDocument('en', 'How do I get in touch with support for travel agents?', 'agent.contact_support');
    manager.addDocument('en', 'What is the best way to contact support for my travel agent account?', 'agent.contact_support');
    manager.addDocument('en', 'How can I reach out to customer support for travel agents?', 'agent.contact_support');
    manager.addDocument('en', 'Where can I find help if I have issues with my travel agent account?', 'agent.contact_support');

    manager.addAnswer('en', 'agent.register', `Step :- 1<br>Visit Cultureholidays.com
Click on the link to visit the website- <a href ="https://cultureholidays.com">Click Here</a><br><br>Step :- 2<br>Go to Travel Agent Registration<br>Click on the ‘Travel Agent Registration’ option given at the top of the home page.<br><br>Step:- 3<br>Verify Now<br>Enter your email ID and click on the ‘Verify Now’ button.<br><br>Step :- 4<br>Check Your Email<br>Go to your email and click on the ‘Click to Verify Email’ button to complete the verification process.`)

    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'getStartedModel.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);
}
module.exports = getStartedModel;