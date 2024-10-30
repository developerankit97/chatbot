const axios = require('axios');
const { COUNTRIES, getRequest, postRequest } = require('../utils/helpers');
const puppeteer = require('puppeteer')
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

async function getPackages(id, countryName, agentId) {
    const packages = await axios.get(`${process.env.api}/Account/PackageDetailsbyCountryCode?CountryCode=${COUNTRIES[countryName]}&AgentID=${agentId}`);
    console.log(packages, 'Package details by country code');

    // Generate the select options
    let options = ``;
    packages.data.forEach((package) => {
        options += `<li class="select-list-item" data-info="${id} ${package.pkG_ID} ${COUNTRIES[countryName]}">${package.packageName}</li>`
    });
    return `<span class="select" onclick="selectListClicked(event)">
                <div class="select-textbox">
                    <input type="text" placeholder="Select Package" id="select-input" autocomplete="off">
                </div>
                <ul class="select-list hide">
                    ${options}
                </ul>
            </span>`
}

async function getTopSellingTours(agentID = process.env.dummy_agentId) {
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

async function getPackagesByCountryCode(agentId = process.env.dummy_agentId, countryCode) {
    try {
        const token = await generateToken();
        const response = await postRequest({ 'Region': '', 'CountryCode': countryCode, 'AgentId': agentId, 'FetchType': 'Country' }, { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }, 'https://searchapi.cultureholidays.com/api/get-package-list');
        console.log(response.data)
        return response.data.response;
    } catch (error) {
        console.log(error.response.data);
    }
}

async function getPackageNightsByCountryCode(agentId, countrycode) {
    const packageList = await getPackagesByCountryCode(agentId, countrycode);
    console.log(packageList);
    // Generate the select options
    let options = ``;
    const uniqueNights = new Set();
    packageList.forEach((pkg) => {
        uniqueNights.add(pkg.pkgNight); // Add only unique values to the Set
    });
    console.log(countrycode, 'countrycode');
    // Loop through the unique nights and create options
    uniqueNights.forEach((night) => {
        options += `<li class="select-list-item" data-info="booking nights ${night} ${countrycode}">${night} nights</li>`;
    });
    return ["Great choice! Now, let's pick the perfect package for your trip",
        `<span class="select" onclick="selectListClicked(event)">
                <div class="select-textbox">
                    <input type="text" placeholder="Select No of Nights" id="select-input" autocomplete="off">
                </div>
                <ul class="select-list hide">
                    ${options}
                </ul>
            </span>`];
}

async function getPackagesbyNightAndCountryCode(agentId, nights, countrycode) {
    if (!countrycode) {
        return ["You are trying to book but country is not specified. please select a country"];
    }

    const packageList = await getPackagesByCountryCode(agentId, countrycode);
    let cards = ``;
    let cardsCount = 0;
    packageList.forEach(pkg => {
        if (pkg.pkgNight == nights) {
            cardsCount++;
            cards += `<div class="card" data-card-info="newbooking packageselect ${pkg.pkG_ID} ${countrycode}" onclick="handleCardClick(this)">
            <div class="card-image" style="background-image: url('https://cms.tripoculture.com/../Content/packagegalleryImage/${pkg.pkG_ID}.jpg')">
                <div class="card-shadow">
                    <span class="duration">${pkg.pkgNight} Nights | ${pkg.pkgDay} Days</span>
                    <span class="offer">${pkg.packageOfferDiscount}%</span>
                    <div class="card-content">
                        <h3 class="card-title">${pkg.pkG_TITLE}</h3>
                        <p class="card-text">Price Starting from</p>
                        <p class="card-price">$${pkg.pkG_FARE}</p>
                    </div>
                </div>
            </div>
        </div>`;
        }
    });
    cardsCount++;
    cards += `<div class="card" data-card-info="customize new trip" onclick="handleCardClick(this)">
                    <div class="card-image" style="background-image: url('customize.png');">
                        <div class="card-shadow">
                            <div class="card-content customize">
                                <button>+</button>
                                <h3>Customize Your Trip</h3>
                            </div>
                        </div>
                    </div>
                </div>`

    return cardsCount == 0 ? ['No Tours Available'] : [`<span class="carousel">
    <div class="carousel-container">
        ${cards}
    </div>
    ${cardsCount == 1 ? '' : '<button class="carousel-prev" onclick="moveCarousel(event)">❮</button>'}
    ${cardsCount == 1 ? '' : '<button class="carousel-next" onclick="moveCarousel(event)">❯</button>'}
</span>`];
}

module.exports = {
    getPackages,
    getTopSellingTours,
    getPackagesByCountryCode,
    getPackageNightsByCountryCode,
    getPackagesbyNightAndCountryCode
}