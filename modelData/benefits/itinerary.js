const axios = require('axios');
const { COUNTRIES } = require('../../utils/helpers');
const { getCountries, generateWithPuppeteer, getSearchIdByCountryCodeAndPkgId } = require('../../services/services');
const path = require('path');
const fs = require('fs');

module.exports = async (manager) => {

    // Basic phrases to ask for itineraries
    manager.addDocument('en', '%itinerary%', 'itinerary.request.country');
    manager.addDocument('en', '%create% %itinerary%', 'itinerary.request.country');
    manager.addDocument('en', 'how %create% %itinerary%', 'itinerary.request.country');


    // Response for the general itinerary request
    manager.addAnswer('en', 'itinerary.request.country', itineraryProcess);

    manager.addDocument('en', '%itinerary% %countrycode%', 'itinerary.request.package');

    manager.addAnswer('en', 'itinerary.request.package', itineraryProcess)

    manager.addDocument('en', '%itinerary% %country%', 'itinerary.process.country.package');
    manager.addDocument('en', '%create% %itinerary% %country%', 'itinerary.process.country.package');
    manager.addAnswer('en', 'itinerary.process.country.package', itineraryProcess)

    manager.addDocument('en', '%itinerary% dates %number% %countrycode%', 'itinerary.request.dates');
    manager.addAnswer('en', 'itinerary.request.dates', itineraryProcess)

    manager.addDocument('en', '%itinerary% download dates %number% %countrycode% %number%%date%%number%/%number%', 'itinerary.request.details');
    manager.addAnswer('en', 'itinerary.request.details', itineraryProcess)

    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'itineraryModel.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);
}

async function itineraryProcess(agentId, context, query, response, io, socketId) {
    if (response.intent == "itinerary.request.country") {
        return await itineraryCountries(agentId, context, query, response, io);
    }
    if (response.intent == "itinerary.request.package") {
        return await itineraryPackages(agentId, context, query, response, io);
    }
    if (response.intent == "itinerary.process.country.package") {
        return await itineraryCountryPackages(agentId, context, query, response, io);
    }
    if (response.intent == "itinerary.request.dates") {
        return await itineraryDates(agentId, context, query, response, io);
    }
    if (response.intent == "itinerary.request.details") {
        return await itineraryDetails(agentId, context, query, response, io, socketId);
    }
}

async function itineraryCountries() {
    const countries = await getCountries('itinerary');
    return [
        "✈️ I'd be thrilled to assist you in creating your perfect itinerary! 🌟",
        "🌍 Which city are you planning to explore? 🏙️",
        countries];
}

async function itineraryPackages(agentId, context) {
    const packages = await axios.get(`${process.env.api}/Account/PackageDetailsbyCountryCode?CountryCode=${context.countrycode}&AgentID=${agentId} `);
    // Generate the select options
    let options = ``;
    packages.data.forEach((package) => {
        options += `<li class="select-list-item" data-info="itinerary dates ${package.pkG_ID} ${context.countrycode}">${package.packageName}</li>`;
    });
    console.log(options);
    return ["📦 Please select a package for your itinerary that suits your perfect trip! 🌟",
        "✨ We're excited to help you craft an amazing travel experience!",
        `<span class="select" onclick="selectListClicked(event)">
            <div class="select-textbox">
                <input type="text" placeholder="Type here" id="select-input" autocomplete="off">
            </div>
            <ul class="select-list hide">
                ${options}
            </ul>
        </span>`];
}

async function itineraryCountryPackages(agentId, context) {
    const packages = await axios.get(`https://apidev.cultureholidays.com/api/Account/PackageDetailsbyCountryCode?CountryCode=${COUNTRIES[context.country]}&AgentID=chagt0001000012263 `);
    // Generate the select options
    let options = ``;
    packages.data.forEach((package) => {
        options += `<li class="select-list-item" data-info="itinerary dates ${package.pkG_ID} ${COUNTRIES[context.country]}">${package.packageName}</li>`;
    });
    return [`📦 Please select a package for your itinerary to ${context.country}! 🌟`,
        "✨ We're excited to help you craft an amazing travel experience in this beautiful destination!",
        `<span class="select" onclick="selectListClicked(event)">
            <div class="select-textbox">
                <input type="text" placeholder="Type here" id="select-input" autocomplete="off">
            </div>
            <ul class="select-list hide">
                ${options}
            </ul>
        </span>`];
}

async function itineraryDates(agentId, context, query) {
    const [, , pkgId, code] = query.split(' ');
    const {data: availableDates} = await axios.get(`https://apidev.cultureholidays.com/api/Account/GetPackageRoomAvlDate?PKGID=${pkgId}`);
    // Generate the select options
    let options = `<option value="" disabled selected>Select Date</option>`;
    if (Array.isArray(availableDates) && availableDates.length > 0) {
        let dateCount = 0; // start a counter to check how many dates are available after        
        availableDates.forEach(availDate => {
            const [date, month, year] = availDate.ratE_AVIAL_DATE.split('/');
            const pkgDate = new Date(year, month - 1, date);
            const todayDate = new Date();
            const thirtyDaysFromToday = new Date().setDate(todayDate.getDate() + 30);

            if (pkgDate >= thirtyDaysFromToday) {
                dateCount++;
                options += `<li class="select-list-item" data-info="itinerary download dates ${pkgId} ${code} ${availDate.ratE_AVIAL_DATE}">${availDate.ratE_AVIAL_DATE}</li>`;
            }

        });
        return dateCount == 0 ? ['No dates Available after next Month'] : [`📅 Please select a date for your itinerary`,
            `<span class="select" onclick="selectListClicked(event)">
                <div class="select-textbox">
                    <input type="text" placeholder="Type here" id="select-input" autocomplete="off">
                </div>
                <ul class="select-list hide">
                    ${options}
                </ul>
            </span>`];
    } else {
        return ['No dates available'];
    }
}

async function itineraryDetails(agentId, context, query, response, io, socketId) {
    const [, , , pkgid, countryCode, date] = query.split(' ');
    const filename = generateWithPuppeteer(agentId, date, pkgid);
    const packageHighlights = await getSearchIdByCountryCodeAndPkgId(agentId, pkgid, countryCode, 'itinerary');
    sendResponseToClient(io, socketId, SOCKET_EVENTS.CHAT, packageHighlights)
    const prmoiseResponse = await Promise.all([filename]);
    return !prmoiseResponse[0] ? ["Cant generate"] : [`<a href="javascript:void(0);" onClick="window.open('itinerary?filename=${prmoiseResponse[0]}');" class="download-link">
            <img class = "chatbot-download-document" src="pdf-icon.png" width="50px">
                <br>Itinerary.pdf<br>⫝</a>`];
}