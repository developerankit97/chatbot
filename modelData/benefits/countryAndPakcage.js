const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { COUNTRIES } = require('../../utils/helpers');

module.exports = async (manager) => {

    manager.addDocument('en', '%country%', 'country.select');

    manager.addAnswer('en', 'country.select', async (country) => {
        const menuOptions = [
            {
                info: `flyer ${COUNTRIES.country}`,
                value: "- 🌟 Create stunning Flyer"
            },
            {
                info: `itinerary ${COUNTRIES.country}`,
                value: "- 📜 View detailed itineraries"
            }, {
                info: 'country',
                value: "- 📅 Check available packages"
            }
        ]

        let buttons = ``;
        menuOptions.forEach((option) => {
            buttons += `<button data-button-info="${option.info}" class="menu-btn">${option.value}</button>`;
        });

        return [
            `🌍 You've selected **${country}**! Great choice! 🎉`,
            "Here's what we can do next:",
            `<div class="menu-container">
                <div class="menu-options">
                    ${buttons}
                </div>
            </div>`,
            "Please click one of the options above to continue!"
        ];
    });

    manager.addDocument('en', '%packageslist%', 'package.select');


    // Responses for what a flyer is
    manager.addAnswer('en', 'package.select', async (package) => {
        console.log('package', package)
        return ["package selected", package];
    });



    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'countryAndPackage.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);
}