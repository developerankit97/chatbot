const axios = require('axios');
const { COUNTRIES, getRequest, postRequest } = require('./../utils/helpers');
const puppeteer = require('puppeteer')
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

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
        return `<span class="select">
                    <div class="select-textbox">
                        <input type="text" placeholder="Type here" id="select-input" autocomplete="off">
                    </div>
                    <ul class="select-list hide">
                        ${options}
                    </ul>
                </span>`;
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
        `<span class="select">
                <div class="select-textbox">
                    <input type="text" placeholder="Type here" id="select-input" autocomplete="off">
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
            cards += `<div class="card" data-card-info="newbooking packageselect ${pkg.pkG_ID} ${countrycode}">
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

    return cardsCount == 0 ? ['No Tours Available'] : [`<span class="carousel">
    <div class="carousel-container">
        ${cards}
    </div>
    ${cardsCount == 1 ? '' : '<button class="carousel-prev">❮</button>'}
    ${cardsCount == 1 ? '' : '<button class="carousel-next">❯</button>'}
</span>`];
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
        return [trip_details + `<br><a href="#" onClick="window.open('https://staging.cultureholidays.com/holidays/HolidaysDetails?SearchId=${response.searchId}');return true;">Click here</a> to visit the details page and complete your booking process! 🎉.`];
    } catch (error) {
        console.log(error.response.data)
        return "Please select different package";
    }
}

async function getExistingBookings(agentId = process.env.dummy_agentId) {
    try {
        const { data: existingBookings } = await postRequest({}, { "accept": "*/*" }, `${process.env.api}/Holidays/GetPackageBooking?AgencyID=${agentId}`);
        if (Array.isArray(existingBookings) && existingBookings.length > 0) {
            let cards = ``;
            let cardsCount = 0;
            existingBookings.forEach(booking => {
                if (booking.tourindays > 0) {
                    cardsCount++; // Store the number od packages which matches the same nights required
                    cards += `<div class="card" data-card-info="edit booking ${booking.packgID} ${booking.tourdate}">
                    <div class="card-image" style="background-image: url('https://cms.tripoculture.com/../Content/packagegalleryImage/${booking.packgID}.jpg')">
                        <div class="card-shadow">
                            <span class="duration">Tour in ${booking.tourindays} days</span>
                            <span class="offer">Guest ${booking.travellerCount}</span>
                            <div class="card-content">
                                <h3 class="card-title">${booking.tourName}</h3>
                                <p class="card-text">Tour Date:</p>
                                <p class="card-price">${booking.tourdate}</p>
                            </div>
                        </div>
                    </div>
                </div>`;
                }
            });

            return [`<span class="carousel">
            <div class="carousel-container">
                ${cards}
            </div>
            ${cardsCount == 1 ? '' : '<button class="carousel-prev">❮</button>'}
            ${cardsCount == 1 ? '' : '<button class="carousel-next">❯</button>'}
        </span>`]
        }
        else return ['No Tours Available'];
    } catch (error) {
        console.log(error);
    }
}

async function getAgentDetails(agentId = process.env.dummy_agentId) {
    const response = await getRequest(`https://apidev.cultureholidays.com/api/Account/GetAgencyProfileDetails?AgentID=${agentId}`)
    return response.data;
}

async function updateAgentDetails(agentId = process.env.dummy_agentId) {
    const response = await postRequest(data, `https://apidev.cultureholidays.com/api/Account/UpdateAgencyProfileDetails`);
    return response.data;
}

async function changeAgentPassword(data) {
    const response = await postRequest(data, `https://apidev.cultureholidays.com/api/Account/AgencyChangePassword`);
    return response.data;
}

async function generateWithPuppeteer(agentid, date, pkgid) {
    try {
        const data = {
            agentIds: agentid,
            sess: date,
            packg_name: '',
            agentEmail: '',
            contact: '',
            pkgID: pkgid,
            pdf_filename: 'abcd.pdf',
            agentEmail: '',
            agentCompanyName: '',
            mainurl: `${process.env.api}/Holidays/`,
            mainurl2: `${process.env.api}/Account/`
        }
        const newHTML = await new Promise((res, rej) => {
            ejs.renderFile(path.resolve('itinerary.ejs'), data, (err, data) => {
                if (err) {
                    console.error('Error rendering template:', err);
                    rej()
                } else {
                    console.log('Rendered HTML with dynamic JavaScript:\n');
                    res(data)
                }
            })
        })

        return await generatePdf(newHTML, agentid);

    } catch (error) {
        console.log(error);
    }
}

async function generatePdf(htmlContent, agentid) {
    try {
        const filename = `${agentid}.pdf`;
        // Launch a headless browser
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(60000);
        page.setDefaultTimeout(60000);
        // Set content to the HTML file
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Generate PDF from the HTML content
        console.log(path.join(__dirname, filename), "PATH FOR FILE");

        await page.pdf({
            path: `${path.join(__dirname, filename)}`,
            printBackground: true, //Include graphics
            preferCSSPageSize: true,
            headerTemplate: '<span style="font-size:10px;">Generated on: {{date}}</span>',
            footerTemplate: '<span style="font-size:10px;">Page {{pageNumber}} of {{totalPages}}</span>',
        });
        await browser.close();
        console.log('PDF generated successfully.');
        return filename;

    } catch (error) {
        console.log(error);
    }
}

async function sendAndDeleteFile(req, res) {
    try {
        const filePath = path.join(__dirname, req.query.filename); // Path to the file
        if (req.query.filename == 'undefined') return res.status(404).json('File not exist');
        res.download(filePath, 'itinerary.pdf', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Error downloading file');
            }
            else {
                setTimeout(() => {
                    unlinkFile(filePath, 1)
                }, 3 * 60 * 1000);
            }
        });

    } catch (error) {
        console.log(error);
    }
}
async function unlinkFile(filePath, no) {
    try {
        if (no > 3) return;
        fs.unlink(filePath, (err) => {
            if (err) {
                unlinkFile(filePath, no + 1);
            }
        })
    } catch (error) {
        console.log(error);
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
                        <div class="menu-options">
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
    getPackages,
    getExistingBookings,
    getPackageNightsByCountryCode,
    getPackagesbyNightAndCountryCode,
    getSearchIdByCountryCodeAndPkgId,
    generateWithPuppeteer,
    sendAndDeleteFile,
    generatePdf,
    unlinkFile,
    getTopSellingTours,
    getAllQueries
}