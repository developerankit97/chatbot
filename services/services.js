const axios = require('axios');
const { COUNTRIES, getRequest, postRequest, sendResponseToClient, SOCKET_EVENTS } = require('./../utils/helpers');
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

async function getExistingBookings(agentId = process.env.dummy_agentId) {
    try {
        const { data: existingBookings } = await postRequest({}, { "accept": "*/*" }, `${process.env.api}/Holidays/GetPackageBooking?AgencyID=${agentId}`);
        if (Array.isArray(existingBookings) && existingBookings.length > 0) {
            let cards = ``;
            let cardsCount = 0;
            existingBookings.forEach(booking => {
                if (booking.tourindays > 0) {
                    cardsCount++; // Store the number od packages which matches the same nights required
                    cards += `<div class="card" data-card-info="view tour details ${booking.packgID} ${booking.tourdate}" onclick="handleCardClick(this)">
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
            ${cardsCount == 1 ? '' : '<button class="carousel-prev" onclick="moveCarousel(event)">❮</button>'}
            ${cardsCount == 1 ? '' : '<button class="carousel-next" onclick="moveCarousel(event)">❯</button>'}
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

async function getAllTravellers(agentID, pkgID, tourDate, requireText) {
    try {
        const { data } = await postRequest({ agentID, pkgID, tourDate }, {}, `${process.env.api}/Holidays/BookingDetails`);
        if (Array.isArray(data?.passenger)) {
            let options = ``;
            if (requireText == 'share-link') {
                data.passenger.forEach(psngr => {
                    options += `<li class="select-list-item" data-info="traveller payment details ${pkgID} ${psngr.traV_ID} ${tourDate}">${psngr.t_FNAME} ${psngr.t_LNAME}</li>`
                });
            }
            return [`<span class="select" onclick="selectListClicked(event)">
                    <div class="select-textbox">
                        <input type="text" placeholder="Type here" id="select-input" autocomplete="off">
                    </div>
                    <ul class="select-list hide">
                        ${options}
                    </ul>
                </span>`]
        }

    } catch (error) {
        console.log(error);
    }
}

async function getAllTravellersWithAmount(agentID, pkgID, tourDate, requireText) {
    try {
        const { data } = await postRequest({ agentID, pkgID, tourDate }, {}, `${process.env.api}/Holidays/BookingDetails`);
        if (Array.isArray(data?.passenger)) {
            let options = ``;
            if (requireText == 'paynow') {
                data.passenger.forEach(psngr => {
                    options += `<li class="multi-select-list-item"
                                    data-info="traveller payment details ${pkgID} ${psngr.traV_ID} ${tourDate}">
                                    <span class="multi-select-list-item-left">
                                        <span class="multi-select-guest-name">${psngr.t_FNAME} ${psngr.t_LNAME}</span>
                                        <span class="multi-select-guest-payment">
                                            Due Payment: <b>$${parseInt(psngr.paxBalanceAmount)}</b>
                                        </span>
                                    </span>
                                    <span class="multi-select-list-item-right">
                                        <input type="checkbox" name="guest-checkbox" class="select-checkbox" />
                                    </span>
                                </li>`;
                });
            }
            return [`<span class="multi-select-form">
                        <span class="multi-select" onclick="multiSelectListClicked(event)">
                            <div class="multi-select_selections">
                                <p></p>
                            </div>
                            <ul class="multi-select-list">
                                ${options}
                            </ul>
                            <button class="multiselect-submit">Continue</button>
                        </span>
                    </span>`]
        }

    } catch (error) {
        console.log(error);
    }
}

async function sendPaymentForm(agentID, pkgID, travId, tourDate) {
    try {
        const traveller = await getTravellerById(agentID, pkgID, travId, tourDate);
        if (traveller) {
            return [`Here's the contact and payment details of the Traveller you want to share link with.`,
                `<span class="form">
                    <form class="send-payment-form" onSubmit="sharePaymentLink(event,{type:'share_link', traV_ID:'${travId}', pkgID:'${pkgID}',tourDate:'${tourDate}'})">
                        <p><b>Name:</b> ${traveller.t_FNAME} ${traveller.t_LNAME}</p>
                        <p><b>Payment Due:</b> $${traveller.paxBalanceAmount}</p>
                        <input value="${traveller.t_EMAIL}" type="email" name="email-input" placeholder="Enter email" required />
                        <button type="submit">Send Link</button>
                    </form>
                </span>`
            ]
        }
        else return ['No Traveller Found for this Name']
    } catch (error) {

    }
}

async function getTravellerById(agentID, pkgID, travId, tourDate) {
    try {
        const { data } = await postRequest({ agentID, pkgID, tourDate }, {}, `${process.env.api}/Holidays/BookingDetails`);
        if (Array.isArray(data?.passenger)) {
            return data.passenger.filter(psngr => psngr.traV_ID == travId)[0]
        }
        else return null;
    } catch (error) {
        console.log(error.response.data);
    }
}

async function sendPaymentLink(io, socketId, agentId, formData) {
    try {
        const travellerDetails = await getTravellerById(agentId, formData.pkgID, formData.traV_ID, formData.tourDate);
        const travellerData = {
            queryID: travellerDetails.pkG_QUERY_ID,
            txn_id: travellerDetails.txn_id,
            tourName: travellerDetails.packageName,
            trav_id: travellerDetails.traV_ID,
            name: `${travellerDetails.t_FNAME} ${travellerDetails.t_LNAME}`,
            usd: `${travellerDetails.paxBalanceAmount}`,
            agentId,
            remarks: "Whatsapp",
            email: formData.email,
            querytype: 'old'
        };
        await postRequest(travellerData, {}, `${process.env.api}/Account/SharePaymentLink`);
        sendResponseToClient(io, socketId, SOCKET_EVENTS.CHAT, '✅Your link is shared.');
    } catch (error) {
        console.log(error);
        sendResponseToClient(io, socketId, SOCKET_EVENTS.CHAT, '❌Your link was not shared unfortunately.');
    }
}

async function handleFormSubmit(io, socketId, agentId, formData) {
    try {
        if (formData.type == 'share_link') {
            await sendPaymentLink(io, socketId, agentId, formData)
        }
        if (formData.type == 'add_traveller') {
            await handleAddTravellerForm(io, socketId, agentId, formData)
        }
        if (formData.type == 'free_quote') {
            await freeQuoteFormSubmit(io, socketId, agentId, formData);
        }
    } catch (error) {
        console.log(error);
    }
}

async function sendFreeQuoteForm() {
    let options = ``;
    Object.keys(COUNTRIES).forEach(countryName => {
        options += `<option value="${countryName.toUpperCase()}">${countryName.toUpperCase()}</option>`;
    });
    const todayDate = new Date().toISOString().split("T")[0];
    return [`<span class="free-quote">
                        <form class="free-quote-container" method="post" onsubmit="freeQuoteFormHandler(event)">
                            <section class="free-quote-section">
                                <h2>Choose your travel Style</h2>
                                <div class="radio-group free-quote-radiobtns">
                                    <label>
                                        <input type="radio" name="travelstyle" value="private" required> Private
                                    </label>
                                    <label>
                                        <input type="radio" name="travelstyle" value="group" required> Group
                                    </label>
                                </div>
                            </section>
                            <section class="free-quote-section">
                                <h2>Choose your travel Destination</h2>
                                <select name="destination" required>
                                    ${options}
                                </select>
                            </section>
                            <section class="free-quote-section">
                                <h2>Add Your Travelers</h2>
                                <div class="free-quote_traveler-adults traveler-update-container">
                                    <div class="traveler-update-container-left">
                                        <h3>Adults</h3>
                                        <p>Adults 18 years old and above</p>
                                    </div>
                                    <div class="free-quote_traveler-update" onclick="travelerUpdateHandler(event)">
                                        <button class="free-quote_traveler-remove">-</button>
                                        <span class="free-quote_traveler-number adult">1</span>
                                        <button class="free-quote_traveler-add">+</button>
                                    </div>
                                </div>
                                <div class="free-quote_traveler-children">
                                    <div class="traveler-update-container-left">
                                        <h3>Children</h3>
                                        <p>Children under 18 years old</p>
                                    </div>
                                    <div class="free-quote_traveler-update" onclick="travelerUpdateHandler(event)">
                                        <button class="free-quote_traveler-remove">-</button>
                                        <span class="free-quote_traveler-number children">0</span>
                                        <button class="free-quote_traveler-add">+</button>
                                    </div>
                                </div>
                                <div class="free-quote_traveler-total">
                                    <h3>Adults: <span class="free-quote_traveler-total-adults">1</span></h3>
                                    <h3>Children: <span class="free-quote_traveler-total-children">0</span></h3>
                                </div>
                            </section>
                            <section class="free-quote-section">
                                <h2>Choose your travel Date</h2>
                                <div class="free-quote-date">
                                    <input type="date" name="tourdate" required autocomplete="off" min=${todayDate} />
                                    <input type="text" name="tourdays" placeholder="For how many days?" required
                                        autocomplete="off" />
                                </div>
                            </section>
                            <section class="free-quote-section free-quote-budget">
                                <h2>Choose your travel Budget</h2>
                                <input type="number" name="budget" placeholder="Enter you travel budget" required
                                    autocomplete="off" />
                                <p>*Excluding flight rates</p>
                            </section>
                            <section class="free-quote-section free-quote-details">
                                <h2>Enter your details</h2>
                                <input type="text" name="freequotename" placeholder="Enter Your Name" required
                                    autocomplete="off" />
                                <input type="number" name="freequotenumber" placeholder="Enter Contact No." required
                                    autocomplete="off" />
                                <input type="email" name="freequoteemail" placeholder="Enter Email Id" required
                                    autocomplete="off" />
                                <textarea name="freequoteremarks" placeholder="Remarks" rows="3" required
                                    autocomplete="off"></textarea>
                            </section>
                            <section class="free-quote-section free-quote-save">
                                <button type="submit" class="free-quote-submit">Submit</button>
                            </section>
                        </form>
                    </span>`]
}

async function freeQuoteFormSubmit(io, socketId, agentId, formData) {
    try {
        let startDate = new Date(formData.tourDate);
        startDate.setDate(startDate.getDate() + Number(formData.noofDay));
        const year = startDate.getFullYear();
        const month = String(startDate.getMonth() + 1).padStart(2, '0');
        const day = String(startDate.getDate()).padStart(2, '0');
        const toDate = `${year}-${month}-${day}`;
        const customTripData = {
            ...formData,
            agenT_ID: agentId,
            pkG_ID: '0',
            nationality: 'usa',
            queryID: '0',
            ipAddress: '0.0.0.0',
            toDate,
            msG_TYPE: 'Customize Trip',
            messageID: '0',
            compnayName: ""
        }
        // console.log({...formData, agenT_ID:agentId, pkG_ID:'0', nationality:'usa', queryID:'0', ipAddress:'0.0.0.0',toDate,msG_TYPE:'Customize Trip',messageID:'0',compnayName:""});
        await postRequest(customTripData, {}, `${process.env.api}/Account/CustomizeYourTrip`);
        sendResponseToClient(io, socketId, SOCKET_EVENTS.CHAT, "Your request has been submitted ✅");
    } catch (error) {
        console.log(error);
    }
}

async function sendAddGuestForm(agentID, pkgID, tourDate) {
    try {
        const { data } = await postRequest({ agentID, pkgID, tourDate }, {}, `${process.env.api}/Holidays/BookingDetails`);

        if (Array.isArray(data.passenger)) {

            const occupiedRooms = new Map();

            data.passenger.forEach((element, index) => {

                occupiedRooms.set(`${element.roomNo}`,
                    !occupiedRooms.get(`${element.roomNo}`) ? 1 : occupiedRooms.get(`${element.roomNo}`) + 1)
            });

            let totalRoomsOptions = ``;

            let newRoomNo = 0; // create new room

            occupiedRooms.forEach((value, key) => {
                newRoomNo = key > newRoomNo ? key : newRoomNo //check the last room and pass one greater value later
                totalRoomsOptions += `<option value="${key}" ${value >= 3 && 'disabled'}>Room: ${key} | ${value} Person | ${value < 3 ? 'Available' : 'Full'}</option>`
            });

            totalRoomsOptions += `<option value="${Number(newRoomNo) + 1}">New Room | 0 Person | Available</option>`
            return [`<span class="existing-booking-traveler" >
                            <div class="traveler-form">
                            <form onSubmit="addTravellerFormSubmit(event,{pkgID:'${pkgID}', tourDate:'${tourDate}',pkG_QUERY_ID:'${data.passenger[0].pkG_QUERY_ID}'})">
                                <h3>Add Traveler Details</h3>
                                <input type="text" placeholder="Enter first name" name="firstname" autocomplete="off" required />
                                <input type="text" placeholder="Enter last name" name="lastname" autocomplete="off" required />
                                <div class="radio-group">
                                    <label>
                                        <input type="radio" name="travelertype" value="Guest"
                                            onclick="getTravelerPrice(event, {single: ${data.passenger[0].singdclienT_PRICE},double: ${data.passenger[0].dbldclienT_PRICE}})" required> Guest
                                    </label>
                                    <label>
                                        <input type="radio" name="travelertype" value="Agent"
                                            onclick="getTravelerPrice(event, {single: ${data.passenger[0].singagenT_PRICE},double: ${data.passenger[0].dblagenT_PRICE}})" required> Agent
                                    </label>
                                </div>
                                <input type="text" placeholder="Enter traveler's Email" name="email"
                                    autocomplete="off" />
                                <hr />
                                <h3>Add guest to room</h3>
                                <p>Select a room for the guest</p>
                                <select name="roomnum" class="room-num" required>
                                ${totalRoomsOptions}
                                </select>
                                <hr />
                                <h3>Select your occupancy preference</h3>
                                <select name="roomtype" class="occupancy-type guest" onchange="addMarkup_Commission(event,{single:${data.passenger[0].singleMarkupAmount},double:${data.passenger[0].daubleMarkupAmount}},{agent:{single:${data.passenger[0].singleAgentCommission},double:${data.passenger[0].daubleAgentCommission}},guest:{single:${data.passenger[0].singleCommission},double:${data.passenger[0].daubleCommission}}})" required >
                                </select>
                                <div class="radio-group">
                                    <label>
                                        <input type="radio" name="bedtype" value="Single" required /> Single Bed
                                    </label>
                                    <label>
                                        <input type="radio" name="bedtype" value="Double" required /> Twin Bed
                                    </label>
                                </div>
                                <h3>Add Markup</h3>
                                <input type="number" name="markup" value="" placeholder="Markup" autocomplete="off" required />
                                <h3>Commission</h3>
                                <input type="number" name="comission" placeholder="Comission" autocomplete="off" readonly />
                                <p class="add-traveler-total-amount">Total Amount: $0</p>
                                <button type="submit" class="traveler-form-submitBtn">Continue</button>
                                </form>
                            </div>
                    </span>`];
        }
    } catch (error) {
        console.log(error);
    }
}

async function handleAddTravellerForm(io, socketId, agentId, formData) {
    try {
        sendResponseToClient(io, socketId, SOCKET_EVENTS.CHAT, 'Alright your details for adding new traveller are saved successfully wait for few second to get update');
        const paxAmount = Number(formData.travellerData.makrup || 0) + Number(formData.travellerData.commision || 0) + Number(formData.travellerData.pkgoriginalcost || 0);
        const guestDetails = {
            ...formData.travellerData,
            "pkG_QUERY_ID": formData.pkG_QUERY_ID,
            "title": 'Mrs',
            "ipaddress": "0.0.0.0",
            "groupTrav_id": 0,
            "createD_BY": agentId,
            "enteredAgentID": agentId,
            "paxTotalAmount": paxAmount,
            "remarks": 'abcd'
        };
        const { data: addGuest } = await postRequest(guestDetails, {}, `${process.env.api}/Account/AddGuestDetails`);
    } catch (error) {
        console.log(error.response);
    }
}
module.exports = {
    getCountries,
    getPackages,
    getExistingBookings,
    sendAddGuestForm,
    getAllTravellers,
    getTravellerById,
    sendPaymentForm,
    sendPaymentLink,
    getPackageNightsByCountryCode,
    getPackagesbyNightAndCountryCode,
    getSearchIdByCountryCodeAndPkgId,
    generateWithPuppeteer,
    sendAndDeleteFile,
    generatePdf,
    unlinkFile,
    getTopSellingTours,
    getAllQueries,
    handleFormSubmit,
    handleAddTravellerForm,
    sendFreeQuoteForm,
    freeQuoteFormSubmit,
    getAllTravellersWithAmount
}