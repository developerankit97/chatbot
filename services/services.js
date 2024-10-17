const axios = require('axios');
const { COUNTRIES, getRequest, postRequest } = require('./../utils/helpers');

const INTENTS = {
    'flyer.selected.country': 'flyer.selected.country',
    'flyer.select.country': true
}

const ENTITIES = {
    'destination': true,
    'package': true,
    'flyer_size': true,
    'flyer_color': true,
    'flyer_type': true,
    'flyer_text_color': true,
}

async function generateToken() {
    
    const response = await postRequest({
        "userId": process.env.id,
        "password": process.env.pass,
    }, 'Content-Type: application/json', `${process.env.token_api}/Authentication/authentication`);
    return response.data.token;
}

async function getCountries(id) {
    console.log(`${process.env.mainurl}/Holidays/Countrylist`);
    const countries = await axios.get(`${process.env.api}/Holidays/Countrylist`);
    console.log(countries);
    if (countries.data.length > 0) {
        // Generate the select options
        let options = `<option value="" disabled selected>Select a country</option>`;
        countries.data.forEach(country => {
            options += `<option value="${id} ${country.countryCode}">${country.countryName}</option>`;
        });
        return `<div class="select">
                <select id="country-select">
                    ${options}
                </select>
            </div>`;
    }
    return [];
}

async function getPackages(id, countryName, agentId) {
    const packages = await axios.get(`${process.env.api}/Account/PackageDetailsbyCountryCode?CountryCode=${COUNTRIES[countryName]}&AgentID=${agentId}`);
    console.log(packages, 'Package details by country code');

    // Generate the select options
    let options = `<option value="" disabled selected>Select a package</option>`;
    packages.data.forEach((package) => {
        options += `<option value="${id} ${package.pkG_ID} ${COUNTRIES[countryName]}">${package.packageName}</option>`; // Adjust property names as needed
    });
    return `<div class="select">
                <select id="package-select">
                    ${options}
                </select>
            </div>`;
}

async function getTopSellingTours(agentID = 'CHAGT0001000012263') {

    try {

        const { data } = await getRequest('https://apidev.cultureholidays.com/api/Holidays/TopSellingTours');

        const response = ["Here are our Top Selling Tours"];

        for (let i = 0; i < 3; i++) {
            if (i == data.length) break;
            response.push(data[i].pkG_TITLE)
        }

        return response;

    } catch (error) {
        console.log(error);

    }
}

async function getPackagesByCountryCode(countryCode, agentId = 'CHAGT0001000012263') {
    try {
        const token = await generateToken();
        const response = await postRequest({ 'Region': '', 'CountryCode': countryCode, 'AgentId': agentId, 'FetchType': 'Country' }, { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }, 'https://searchapi.cultureholidays.com/api/get-package-list');
        return response.data.response;
    } catch (error) {
        console.log(error.response.data);
    }
}

async function getPackageNightsByCountryCode(countrycode) {
    const packageList = await getPackagesByCountryCode(countrycode);
    // Generate the select options
    let options = `<option value="" disabled selected>How many night you are looking for</option>`;
    const uniqueNights = new Set();
    packageList.forEach((pkg) => {
        uniqueNights.add(pkg.pkgNight); // Add only unique values to the Set
    });
    // Loop through the unique nights and create options
    uniqueNights.forEach((night) => {
        options += `<option value="booking nights ${night} ${countrycode}">${night} nights</option>`;
    });
    return ["Great choice! Now, let's pick the perfect package for your trip", `<div class="select">
                <select id="date-select">
                    ${options}
                </select>
            </div>`];
}

async function getPackagesbyNightAndCountryCode(nights, countrycode) {
    console.log(nights, countrycode);
    if (!countrycode) {
        return ["You are trying to book but country is not specified. please select a country"];
    }

    const packageList = await getPackagesByCountryCode(countrycode);

    const filteredPackages = packageList.filter(pkg => pkg.pkgNight == nights);
    // Generate the select options
    // let options = `<option value="" disabled selected>Select a package</option>`;
    let cards = ``;

    // Check if there are any filtered packages
    if (filteredPackages.length === 0) {
        return 'No packages available for the selected number of nights';
    }
    filteredPackages.forEach((package) => {
        // car += `<option value="newbooking packageselect ${package.pkG_ID} ${countrycode}">${package.pkG_TITLE}</option>`; // Adjust property names as needed
        cards += `<div class="card" data-card-info="newbooking packageselect ${package.pkG_ID} ${countrycode}">
                    <img data-card-info="newbooking packageselect ${package.pkG_ID} ${countrycode}" src="https://cms.tripoculture.com/../Content/packagegalleryImage/${package.pkG_ID}.jpg" alt="Card">
                    <h3 data-card-info="newbooking packageselect ${package.pkG_ID} ${countrycode}">${package.pkG_TITLE}</h3>
                </div>`;
    });
    return ["Please select the package",
        `<div class="slider-wrapper">
            <button id="prev" class="scroll-btn">◀</button>
            <div class="card-container">
            ${cards}
            </div>
            <button id="next" class="scroll-btn">▶</button>
        </div>`
    ]

}

async function getSearchIdByCountryCodeAndPkgId(pkgId, countrycode, agentId = 'CHAGT0001000012263') {

    const token = await generateToken();
    const { data: { response: { searchId } } } = await postRequest({
        'TourDate': '',
        'AgentId': agentId,
        'CountryCode': countrycode,
        'PackageId': pkgId,
        'FetchType': 'All'
    }, {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
    }, 'https://searchapi.cultureholidays.com/api/get-package-detail');

    return `<div>✨ <a href="#" onClick="window.open('https://cultureholidays.com/holidays/HolidaysDetails?SearchId=${searchId}');return true;">Click here</a> to visit the details page and complete your booking process! 🎉</div>`;
}

async function getExistingBookings(agentID = 'CHAGT0001000012263') {
    try {
        const { data } = await getRequest(`https://apidev.cultureholidays.com/api/Holidays/BookingDetails?AgencyID=${agentID}`);

        const response = ["Your Upcomings are listed here"];
        console.log(data);

        for (let i = 0; i < 3; i++) {
            if (i == data.length) break;
            response.push(data[i].tourName || `Tour ${i}`)
        }

        return response;

    } catch (error) {
        console.log(error);


    }
}

async function getAgentDetails(agentId = 'CHAGT0001000012263') {
    const response = await getRequest(`https://apidev.cultureholidays.com/api/Account/GetAgencyProfileDetails?AgentID=${agentId}`)
    return response.data;
}

async function updateAgentDetails(agentId = 'CHAGT0001000012263') {
    const response = await postRequest(data, `https://apidev.cultureholidays.com/api/Account/UpdateAgencyProfileDetails`);
    return response.data;
}

async function changeAgentPassword(data) {
    const response = await postRequest(data, `https://apidev.cultureholidays.com/api/Account/AgencyChangePassword`);
    return response.data;
}

module.exports = {
    getCountries,
    getPackages,
    getExistingBookings,
    getPackageNightsByCountryCode,
    getPackagesbyNightAndCountryCode,
    getSearchIdByCountryCodeAndPkgId,
    INTENTS,
    ENTITIES
}