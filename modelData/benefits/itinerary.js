const axios = require('axios');
const { context, COUNTRIES } = require('../../utils/helpers');
const { generatePdf } = require('../../utils/generatePDF');
const path = require('path');
const fs = require('fs');
const { getCountries } = require('../../services/services');

module.exports = async (manager) => {

    // Basic phrases to ask for itineraries
    manager.addDocument('en', '%itinerary%', 'itinerary.request.country');
    manager.addDocument('en', '%create% %itinerary%', 'itinerary.request.country');
    manager.addDocument('en', 'how %create% %itinerary%', 'itinerary.request.country');

    // Response for the general itinerary request
    manager.addAnswer('en', 'itinerary.request.country', async () => {
        // const countries = await axios.get('https://apidev.cultureholidays.com/api/Holidays/Countrylist');
        // // Generate the select options
        // let options = `<option value="" disabled selected>Select a country</option>`;
        // countries.data.forEach(country => {
        //     options += `<option value="itinerary ${country.countryCode}">${country.countryName}</option>`;
        // });
        const countries = await getCountries('itinerary');
        return [
            "✈️ I'd be thrilled to assist you in creating your perfect itinerary! 🌟",
            "🌍 Which city are you planning to explore? 🏙️",
            countries];
    });

    manager.addDocument('en', '%itinerary% %countrycode%', 'itinerary.request.package');

    manager.addAnswer('en', 'itinerary.request.package', async (countryCode) => {
        console.log(countryCode);
        const packages = await axios.get(`https://apidev.cultureholidays.com/api/Account/PackageDetailsbyCountryCode?CountryCode=${countryCode.split(' ')[1]}&AgentID=chagt0001000012263 `);
        // Generate the select options
        let options = `<option value="" disabled selected>Select a package</option>`;
        packages.data.forEach((package) => {
            options += `<option value="itinerary dates ${package.pkG_ID} ${countryCode.split(' ')[1]}">${package.packageName}</option>`; // Adjust property names as needed
        });
        console.log(options);
        return ["📦 Please select a package for your itinerary that suits your perfect trip! 🌟",
            "✨ We're excited to help you craft an amazing travel experience!",
            `<div class= "select">
            <select id="package-select">
                ${options}
            </select>
            </div >
        `];
    })

    manager.addDocument('en', '%itinerary% %country%', 'itinerary.process.country.package');
    manager.addDocument('en', '%create% %itinerary% %country%', 'itinerary.process.country.package');
    manager.addAnswer('en', 'itinerary.process.country.package', async (country) => {
        const packages = await axios.get(`https://apidev.cultureholidays.com/api/Account/PackageDetailsbyCountryCode?CountryCode=${COUNTRIES[country]}&AgentID=chagt0001000012263 `);
        // Generate the select options
        let options = `<option value="" disabled selected>Select a package</option>`;
        packages.data.forEach((package) => {
            options += `<option value="itinerary dates ${package.pkG_ID} ${COUNTRIES[country]}">${package.packageName}</option>`; // Adjust property names as needed
        });
        return [`📦 Please select a package for your itinerary to ${country}! 🌟`,
            "✨ We're excited to help you craft an amazing travel experience in this beautiful destination!",
        `<div class= "select">
            <select id="package-select">
                ${options}
            </select>
            </div >
        `];
    })

    manager.addDocument('en', '%itinerary% dates %number% %countrycode%', 'itinerary.request.dates');
    manager.addAnswer('en', 'itinerary.request.dates', async (pkg) => {
        const [, , pkgId, code] = pkg.split(' ');
        const availableDates = await axios.get(`https://apidev.cultureholidays.com/api/Account/GetPackageRoomAvlDate?PKGID=${pkgId}`);
        // Generate the select options
        let options = `<option value="" disabled selected>Select a package</option>`;
        if (availableDates.data.length == 0) {
            return 'No dates available';
        }
        availableDates.data.forEach(date => {
            options += `<option value="itinerary details ${pkgId} ${code}">${date.ratE_AVIAL_DATE}</option>`;
        });
        return [`📅 Please select a date for your itinerary`,
            `<div class="select">
             <select id="date-select">
                 ${options}
             </select>
         </div>`];

    })

    manager.addDocument('en', 'itinerary details %number% %countrycode%', 'itinerary.request.details');
    manager.addAnswer('en', 'itinerary.request.details', async (pkg) => {
        const [, , pkgId, code] = pkg.split(' ');
        const packageInfos = await axios(`https://apidev.cultureholidays.com/api/Holidays/PacKageInfo?PKG_ID=${pkgId}`)
        await generatePdf();
        return ["🌟 Here are the highlights for your selected tour:",
            `<div class="highlight-text">
                ${packageInfos.data[0].inF_DESCRIPTION}<br>
            </div>`,
            `<div>📄 <a href="#" onClick="window.open('http://localhost:3000/output.pdf');" class="download-link">Download itinerary here!</a></div>`,
            "✨ We hope you enjoy your journey!"];
    })

    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'itineraryModel.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);
}