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

async function getPackagesbyNightAndCountryCode(agentId, nights, countrycode) {
    if (!countrycode) {
        return ["You are trying to book but country is not specified. please select a country"];
    }

    const packageList = await getPackagesByCountryCode(agentId, countrycode);

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
        cards += `<div class="card" data-card-title="${package.pkG_TITLE}" data-card-info="newbooking packageselect ${package.pkG_ID} ${countrycode}">
                    <img data-card-title="${package.pkG_TITLE}" data-card-info="newbooking packageselect ${package.pkG_ID} ${countrycode}" src="https://cms.tripoculture.com/../Content/packagegalleryImage/${package.pkG_ID}.jpg" alt="Card">
                    <h3 data-card-title="${package.pkG_TITLE}" data-card-info="newbooking packageselect ${package.pkG_ID} ${countrycode}">${package.pkG_TITLE}</h3>
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

async function getSearchIdByCountryCodeAndPkgId(agentId = process.env.dummy_agentId, pkgId, countrycode) {
    try {
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
        return `<div>✨ <a href="#" onClick="window.open('https://staging.cultureholidays.com/holidays/HolidaysDetails?SearchId=${searchId}');return true;">Click here</a> to visit the details page and complete your booking process! 🎉</div>`;
    } catch (error) {
        console.log(error.response.data)
        return "Please select different package";
    }
}

async function getExistingBookings(agentId = process.env.dummy_agentId) {
    try {
        const { data } = await getRequest(`https://apidev.cultureholidays.com/api/Holidays/BookingDetails?AgencyID=${agentId}`);
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
    unlinkFile
}