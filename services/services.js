const axios = require('axios');
const { getRequest, postRequest, isValidArrayOrString } = require('./../utils/helpers');

async function generateToken() {
    const response = await postRequest({
        "userId": process.env.searchapi_id,
        "password": process.env.searchapi_pass,
    }, 'Content-Type: application/json', `${process.env.token_api}/Authentication/authentication`);
    return response.data.token;
}

async function getCountries(id) {
    const countries = await axios.get(`${process.env.api}/Holidays/Countrylist`);
    if (countries.data.length > 0) {
        // Generate the select options
        let options = ``;
        countries.data.forEach(country => {
            options += `<li class="select-list-item" data-info="${id} ${country.countryCode}">${country.countryName}</li>`;
        });
        return `<span class="select" onclick="selectListClicked(event)">
                    <div class="select-textbox">
                        <input type="text" placeholder="Select Destination" id="select-input" autocomplete="off">
                    </div>
                    <ul class="select-list hide">
                        ${options}
                    </ul>
                </span>`;
    }
    return [];
}

async function verifyPackageId(pkgId) {
    try {
        const { data } = await getRequest(`${process.env.api}/Holidays/PacKageInfo?PKG_ID=${pkgId}`);
        if (isValidArrayOrString(data) && data.length > 0) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error)
    }
}

async function verifyTravelerId(travelerId) {
    try {
        const { data } = await postRequest({ "tourId": travelerId },
            { 'Content- Type': 'application / json' },
            `${process.env.api}/Holidays/PacKageInfo?PKG_ID=${pkgId}`);
        if (isValidArrayOrString(data) && data.length > 0) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error)
    }
}

async function getSearchIdByCountryCodeAndPkgId(agentId = process.env.dummy_agentId, pkgId, countrycode, requireText) {
    try {
        const token = await generateToken();
        const { data: { response } } = await postRequest({
            'TourDate': '',
            'AgentId': agentId,
            'CountryCode': countrycode,
            'PackageId': pkgId,
            'FetchType': 'All'
        }, {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }, 'https://searchapi.cultureholidays.com/api/get-package-detail');

        let trip_details = `<b>${response.name}</b><br>${response.duration}<br><br><b>Overview</b><br>`;
        if ((Array.isArray(response.tripHighlights)) && (requireText && requireText == 'itinerary')) {
            response.tripHighlights.forEach(highlight => {
                trip_details += "<b>•</b>" + highlight + "<br>"
            })
            return trip_details;
        }
        trip_details += `${response.tripOverview.slice(0, 150)}...<br>`;
        trip_details += "<br><b>Trip Includes:-</b><br>"
        if (Array.isArray(response.inclusion)) {
            response.inclusion.forEach(inclusion => {
                trip_details += "<b>•</b>" + inclusion + "<br>"
            })
        }
        trip_details += "<br><b>Trip Excludes:-</b><br>"
        if (Array.isArray(response.exclusion)) {
            response.inclusion.forEach(exclusion => {
                trip_details += "<b>•</b>" + exclusion + "<br>"
            })
        }
        return [trip_details + `<br><a href="javascript:void(0);" onClick="window.open('https://staging.cultureholidays.com/holidays/HolidaysDetails?SearchId=${response.searchId}');return true;">Click here</a> to visit the details page and complete your booking process! 🎉.`];
    } catch (error) {
        console.log(error.response.data)
        return "Please select different package";
    }
}

async function getAllQueries(agentId = 'rahul@cultureholidays.com') {
    try {
        const { data } = await getRequest(`${process.env.api}/Message/GetAgentMessage?Emailid=${agentId}`);
        if (Array.isArray(data)) {
            let menuButtons = ``;
            data.forEach(query => {
                menuButtons += `<button data-button-info="query detail ${query.msG_ID} ${query.fullName}" class="menu-btn">${query.country} - ${query.msG_TYPE}</button>`
            })
            return ['Select any query for which you want to get update.', `<span class="menu">
                        <div class="menu-options" onclick="menuButtonClicked(event)">
                            ${menuButtons}
                        </div>
                    </span>`]
        } else {
            return ['No Current Queries.']
        }
    } catch (error) {
        console.log("Get Queries", error);

    }
}

module.exports = {
    getCountries,
    getSearchIdByCountryCodeAndPkgId,
    getAllQueries,
    verifyPackageId,
    verifyTravelerId
}