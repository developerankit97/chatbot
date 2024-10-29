const axios = require('axios');
const path = require('path');
const fs = require('fs');
let { COUNTRIES, autoCompleteOptions } = require('../../utils/helpers');

module.exports = async (manager) => {

    manager.addDocument('en', 'country', 'country.choose');

    manager.addDocument('en', 'destination', 'country.choose');

    manager.addAnswer('en', 'country.choose', async (agentId, context, query) => {
        autoCompleteOptions = Object.keys(COUNTRIES);
        return [`🌍 Which destination are you looking for?`];
    })  

    manager.addDocument('en', '%country%', 'country.select');

    manager.addAnswer('en', 'country.select', async (agentId, context, query) => {
        const menuOptions = [
            {
                info: `flyer ${COUNTRIES[context.country]}`,
                value: "- 🌟 Create stunning Flyer"
            },
            {
                info: `itinerary ${COUNTRIES[context.country]}`,
                value: "- 📜 View detailed itineraries"
            },
            // {
            //     info: `bookingcountry ${COUNTRIES[context.country]}`,
            //     value: "- 📅 Check available packages"
            // }
        ]

        let buttons = ``;
        menuOptions.forEach((option) => {
            buttons += `<button data-button-info="${option.info}" class="menu-btn">${option.value}</button>`;
        });
        return [`🌍 You've selected <strong>${context.country}!</strong> Great choice! 🎉`,
            "Here's what we can do next:",
            `<span class="menu">
                <div class="menu-options" onclick="menuButtonClicked(event)">
                    ${buttons}
                </div>
            </span>`];
    });

    // manager.addDocument('en', '%packageslist%', 'package.select');


    // // Responses for what a flyer is
    // manager.addAnswer('en', 'package.select', async (package) => {
    //     return ["package selected", package];
    // });



    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'countryAndPackage.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);
}