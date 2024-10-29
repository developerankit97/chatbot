const axios = require('axios');
const path = require('path');
const fs = require('fs');

module.exports = async (manager) => {
    // Queries about what is a flyer
    manager.addDocument('en', 'help', 'help.ask');
    manager.addDocument('en', 'need help', 'help.ask');

    // Responses for what a flyer is
    manager.addAnswer('en', 'help.ask', async () => {
        const menuOptions = [
            {
                info: `create flyer`,
                value: "- 🌟 Do you need help creating a Flyer"
            },
            {
                info: `create itinerary`,
                value: "- 📜 Would you like assistance with itineraries"
            },
            {
                info: 'package help',
                value: "- 📅 Do you need help finding available packages"
            },
        ];
        let buttons = ``;
        menuOptions.forEach((option) => {
            buttons += `<button data-button-info="${option.info}" class="menu-btn">${option.value}</button>`;
        });

        return ["Please select the help you need, or let us know if there's something else you'd like assistance with!",
            `<span class="menu">
                <div class="menu-options" onclick="menuButtonClicked(event)">
                    ${buttons}
                </div>
            </span>`,
            "Please click one of the options above to continue!"
        ];
    });

    manager.addDocument('en', 'tool', 'sales.tools');
    manager.addDocument('en', 'tools', 'sales.tools');
    manager.addDocument('en', 'sales tools', 'sales.tools');
    manager.addDocument('en', 'sale tools', 'sales.tools');

    manager.addAnswer('en', 'sales.tools', async () => {
        const menuOptions = [
            {
                info: `create flyer`,
                value: "- 🌟 Create Flyer"
            },
            {
                info: `create itinerary`,
                value: "- 📜 Generate Itinerary"
            },
        ];
        let buttons = '';
        menuOptions.forEach((option) => {
            buttons += `<button data-button-info="${option.info}" class="menu-btn">${option.value}</button>`;
        });
        return ["Please select one of the below options to continue!",
            `<span class="menu">
                <div class="menu-options" onclick="menuButtonClicked(event)">
                    ${buttons}
                </div>
            </span>`];
    })

    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'helpModel.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);
}