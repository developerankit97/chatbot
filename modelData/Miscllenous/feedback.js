const axios = require('axios');
const path = require('path');
const fs = require('fs');

module.exports = async (manager) => {
    // Queries about what is a flyer
    manager.addDocument('en', 'feedback', 'feedback.form');

    // Responses for what a flyer is
    manager.addAnswer('en', 'feedback.form', [
        `<div class="chatbot-input-form-div">
            <form class="chatbot-input-form">
                <input type="text" placeholder="Name" id="feedback-name" class="chatbot-form-input"
                    required>
                <input type="email" placeholder="Email" id="feedback-email" class="chatbot-form-input"
                    required>
                <textarea placeholder="Type here" id="feedback-textarea" class="chatbot-form-input" rows="5"
                    required></textarea>
                <button type="submit" id="feedback-submit" class="chatbot-form-submit">Submit</button>
            </form>
        </div>`
    ], ["Thank you for your feedback! We appreciate your input and strive to improve our services. If you have any more suggestions or comments, feel free to share!"]);

    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'feedbackModel.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);
}