const axios = require('axios');
const { COUNTRIES, getRequest, postRequest } = require('./helpers');

async function getCountries(id) {
    const countries = await getRequest('https://apidev.cultureholidays.com/api/Holidays/Countrylist');
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
