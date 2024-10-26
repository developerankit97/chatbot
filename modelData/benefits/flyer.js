const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { COUNTRIES, context, sendResponseToClient } = require('../../utils/helpers');
const { getCountries } = require('../../services/services');
const { saveFileData, getFileData } = require('../../database/db');

module.exports = async (manager) => {

    // Queries about how flyers can help agents
    manager.addDocument('en', 'How flyer help travel agent?', 'flyer.help');
    manager.addDocument('en', 'Why use flyers', 'flyer.help');
    manager.addDocument('en', 'How flyers help business', 'flyer.help');
    manager.addDocument('en', 'What benefits flyers offer travel agents', 'flyer.help');
    manager.addDocument('en', 'Why flyers useful promoting tours', 'flyer.help');

    // Responses for how flyers help travel agents
    manager.addAnswer('en', 'flyer.help', `
        Flyers are a great tool for travel agents to attract clients. They help showcase special offers, tour packages, or promotions in a visually appealing way.
        Flyers allow you to quickly communicate key details about trips or discounts, which can drive more sales and client interest in your services at Culture Holidays.
    `);

    manager.addAnswer('en', 'flyer.help', `
        Flyers can help you promote exclusive travel deals and unique packages from Culture Holidays. 
        By distributing them physically or digitally, you can reach potential clients who may not be aware of your offers, increasing your visibility and sales.
    `);

    manager.addAnswer('en', 'flyer.help', `
        As a travel agent, flyers can act as an effective promotional tool to advertise upcoming trips or seasonal offers. 
        They provide a simple yet impactful way to generate interest and increase bookings, helping you grow your business with Culture Holidays.
    `);

    // Query to start the flyer creation process
    manager.addDocument('en', '%flyer%', 'flyer.process.country');
    manager.addDocument('en', '%create% %flyer%', 'flyer.process.country');
    manager.addDocument('en', 'how %create% %flyer%', 'flyer.process.country');

    // Initial response asking if they want to create a flyer
    manager.addAnswer('en', 'flyer.process.country', flyerProcess);

    manager.addDocument('en', '%flyer% %countrycode%', 'flyer.process.package');

    manager.addAnswer('en', 'flyer.process.package', flyerProcess)

    manager.addDocument('en', '%flyer% %country%', 'flyer.process.country.package');
    manager.addDocument('en', '%create% %flyer% %country%', 'flyer.process.country.package');
    manager.addAnswer('en', 'flyer.process.country.package', flyerProcess)

    manager.addDocument('en', 'flyerdetails %number% %countrycode%', 'flyer.details');
    manager.addAnswer('en', 'flyer.details', flyerProcess)

    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'flyerModel.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);
}


async function flyerProcess(agentId, context, query, response, io) {
    if (response.intent == 'flyer.process.country') {
        if (!context.country) {
            const countries = await getCountries('flyer');
            return ["🌟 Awesome! You’re all set to create your flyer! 🎉 Let's make it amazing together!",
                "🌍 Please select a country for your flyer. Your journey starts here!"
                , countries];
        } else if (!context?.pkgId) {
            const packages = await axios.get(`${process.env.api}/Account/PackageDetailsbyCountryCode?CountryCode=${context.countrycode}&AgentID=${agentId} `);
            let options = ``;
            packages.data.forEach((package) => {
                options += `<li class="select-list-item" data-info="flyerdetails ${package.pkG_ID} ${context.countrycode}">${package.packageName}</li>`;
            });
            return ["🎨 Great choice! Now, let’s select the perfect package for your stunning flyer! 🌟",
                `<span class="select">
                    <div class="select-textbox">
                        <input type="text" placeholder="Type here" id="select-input" autocomplete="off">
                    </div>
                    <ul class="select-list hide">
                        ${options}
                    </ul>
                </span>`];
        } else {
            return ["🎉 Great News! Your flyer details are ready! ✨", "🌈 Ready to finalize your template? Click the button below to complete your flyer creation! 👇",
                `<a href="#" onClick="window.open('https://cultureholidays.com/createyourflyer?countrycode=${context.countrycode.toLowerCase()}&pkgid=${context.pkgId}#')">Finalize Your Flyer</a>`];
        }
    } else if (response.intent == 'flyer.process.package' && !context?.pkgId) {
        const packages = await axios.get(`${process.env.api}/Account/PackageDetailsbyCountryCode?CountryCode=${context.countrycode}&AgentID=${agentId}`);
        let options = `<option value="" disabled selected>Select a package</option>`;
        packages.data.forEach((package) => {
            options += `<option value="flyerdetails ${package.pkG_ID} ${context.countrycode}">${package.packageName}</option>`;
        });
        return ["🎨 Great choice! Now, let’s select the perfect package for your stunning flyer! 🌟", `<div class="select"><select id="package-select">
                    ${options}
                </select>
            </div>`];
    } else if (response.intent == 'flyer.process.country.package') {
        const packages = await axios.get(`${process.env.api}/Account/PackageDetailsbyCountryCode?CountryCode=${COUNTRIES[context.country]}&AgentID=${agentId} `);
        // Generate the select options
        let options = `<option value="" disabled selected>Select a package</option>`;
        packages.data.forEach((package) => {
            options += `<option value="flyerdetails ${package.pkG_ID} ${COUNTRIES[context.country]}">${package.packageName}</option>`; // Adjust property names as needed
        });
        return ["🎨 Great choice! Now, let’s select the perfect package for your stunning flyer! 🌟", `<div class="select"><select id="package-select">
                    ${options}
                </select>
            </div>`];
    } else if (response.intent == 'flyer.details') {
        const data = await getFileData(agentId);
        data.context['pkgId'] = query.split(' ')[1];
        await saveFileData(agentId, data);
        return ["🎉 Great News! Your flyer details are ready! ✨", "🌈 Ready to finalize your template? Click the button below to complete your flyer creation! 👇",
            `<a href="#" onClick="window.open('https://cultureholidays.com/createyourflyer?countrycode=${context.countrycode.toLowerCase()}&pkgid=${query.split(' ')[1]}#')">Finalize Your Flyer</a>`];
    }
}