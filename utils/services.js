const axios = require('axios');
const { COUNTRIES } = require('./helpers');

async function getCountries() {
    const countries = await axios.get('https://apidev.cultureholidays.com/api/Holidays/Countrylist');

    // Generate the select options
    let options = `<option value="" disabled selected>Select a country</option>`;
    countries.data.forEach(country => {
        options += `<option value="${country.countryCode}">${country.countryName}</option>`;
    });
    return `
            Great! you like to start creating your flyer now 
            Please select a country for your flyer.<br><br>
            <div class="select">
                <select id="country-select">
                    ${options}
                </select>
            </div>
        `;
}

async function getPackages(countryName) {
    console.log(countryName, 'getPackages');
    const packages = await axios.get(`https://apidev.cultureholidays.com/api/Account/PackageDetailsbyCountryCode?CountryCode=${COUNTRIES[countryName]}&AgentID=chagt0001000012263`);
    console.log(packages, 'Package details by country code');

    // Generate the select options
    let options = `<option value="" disabled selected>Select a package</option>`;
    packages.data.forEach((package) => {
        options += `<option value="availabledates ${package.pkG_ID} ${COUNTRIES[countryName]}">${package.packageName}</option>`; // Adjust property names as needed
    });
    return `
                Please select a package for your flyer.<br><br>
                <div class="select">
                    <select id="package-select">
                        ${options}
                    </select>
                </div>
            `;
}

module.exports = { getCountries, getPackages }