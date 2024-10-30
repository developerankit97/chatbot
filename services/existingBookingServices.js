const axios = require('axios');
const { COUNTRIES, getRequest, postRequest, sendResponseToClient, SOCKET_EVENTS } = require('./../utils/helpers');
const puppeteer = require('puppeteer')
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

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
            if (requireText == 'due-payment') {
                data.passenger.forEach(psngr => {
                    options += `<li class="select-list-item" data-info="traveler due payment ${pkgID} ${psngr.traV_ID} ${tourDate}"><span class="traveler-name" style="font-size:0.9rem;font-weight:500;">${psngr.t_FNAME} ${psngr.t_LNAME}</span></li>`
                });
            }
            if (requireText == 'room-change') {
                data.passenger.forEach(psngr => {
                    options += `<li class="select-list-item" data-info="roomno Change form ${pkgID} ${psngr.traV_ID} ${tourDate}"><span class="traveler-name" style="font-size:0.9rem;font-weight:500;">${psngr.t_FNAME} ${psngr.t_LNAME}</span></li>`
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
    getExistingBookings,
    getAllTravellers,
    getAllTravellersWithAmount,
    sendPaymentForm,
    getTravellerById,
    sendPaymentLink,
    handleFormSubmit,
    sendAddGuestForm,
    handleAddTravellerForm
}