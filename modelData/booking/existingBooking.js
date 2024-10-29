const path = require('path');
const fs = require('fs');
const { getExistingBookings, sendAddGuestForm, sharePaymentLink, getAllTravellers, sendPaymentForm, getAllTravellersWithAmount } = require('../../services/services');
const { postRequest } = require('../../utils/helpers');

module.exports = async function (manager) {
    manager.addDocument('en', 'existing bookings', 'current.bookings');
    manager.addDocument('en', 'current bookings', 'current.bookings');
    manager.addDocument('en', 'upcoming bookings', 'current.bookings');
    manager.addDocument('en', 'upcoming tours', 'current.bookings');
    manager.addDocument('en', 'my booking', 'current.bookings');
    manager.addDocument('en', 'my trips', 'current.bookings');

    manager.addAnswer('en', 'current.bookings', existingBookingProcess)

    manager.addDocument('en', 'view tour details %pkgid% %number%%date%%number%/%number%', 'booking.details');

    manager.addAnswer('en', 'booking.details', existingBookingProcess);

    manager.addDocument('en', 'add new guest %pkgid% %number%%date%%number%/%number%', 'add.guest');
    manager.addAnswer('en', 'add.guest', existingBookingProcess);

    manager.addDocument('en', 'share payment link %pkgid% %number%%date%%number%/%number%', 'share.link');
    manager.addAnswer('en', 'share.link', existingBookingProcess);

    manager.addDocument('en', 'traveller payment details %pkgid% %travid% %number%%date%%number%/%number%', 'payment.details');
    manager.addAnswer('en', 'payment.details', existingBookingProcess)

    manager.addDocument('en', 'paynow link %pkgid% %travid% %number%%date%%number%/%number%', 'pay.now');
    manager.addAnswer('en', 'pay.now', existingBookingProcess)

    manager.addDocument('en', 'traveller paynow %number%', 'paynow.link');
    manager.addAnswer('en', 'paynow.link', existingBookingProcess)

    manager.addDocument('en', 'due payment %pkgid% %travid% %number%%date%%number%/%number%', 'due.payment');
    manager.addAnswer('en', 'due.payment', existingBookingProcess)

    manager.addDocument('en', 'traveler due payment %pkgid% %travid% %number%%date%%number%/%number%', 'due.payment.details');
    manager.addAnswer('en', 'due.payment.details', existingBookingProcess)

    manager.addDocument('en', 'change guest room %pkgid% %travid% %number%%date%%number%/%number%', 'room.change');
    manager.addAnswer('en', 'room.change', existingBookingProcess)

    manager.addDocument('en', 'roomno Change details %number% %number%', 'room.change.details');
    manager.addAnswer('en', 'room.change', existingBookingProcess)

    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'existingBookingModel.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);
}

async function existingBookingProcess(agentId, context, query, response, io, socketId) {
    if (response.intent == "current.bookings") {
        return await getExistingBookings(agentId);
    }
    if (response.intent == "booking.details") {
        return ['Select any option below to perfor further action.',
            `<span class="menu">
                <div class="menu-options" onclick="menuButtonClicked(event)">
                    <button data-button-info="add new guest ${query.split(' ')[3]} ${query.split(' ')[4]}" class="menu-btn">Add Guest</button>
                    <button data-button-info="change guest room ${query.split(' ')[3]} ${query.split(' ')[4]}" class="menu-btn">Change guest room</button>
                    <button data-button-info="due payment ${query.split(' ')[3]} ${query.split(' ')[4]}" class="menu-btn">Due Payment</button>
                    <button data-button-info="paynow link ${query.split(' ')[3]} ${query.split(' ')[4]}" class="menu-btn">Pay Now</button>
                    <button data-button-info="share payment link ${query.split(' ')[3]} ${query.split(' ')[4]}" class="menu-btn">Share Payment Link</button>
                </div>
            </span>`]
    }// <button data-button-info="view all guest ${query.split(' ')[3]} ${query.split(' ')[4]}" class="menu-btn">View All Guests</button>
    if (response.intent == "add.guest") {
        return await sendAddGuestForm(agentId, query.split(' ')[3], query.split(' ')[4]);
    }
    if (response.intent == "share.link") {
        return await getAllTravellers(agentId, query.split(' ')[3], query.split(' ')[4], 'share-link');
    }
    if (response.intent == "payment.details") {
        return await sendPaymentForm(agentId, query.split(' ')[3], query.split(' ')[4], query.split(' ')[5]);
    }
    if (response.intent == "pay.now") {
        return await getAllTravellersWithAmount(agentId, query.split(' ')[2], query.split(' ')[3], 'paynow');
    }
    if (response.intent == "paynow.link") {
        let formattedNumber = query.split(' ')[2].replace(/(\d{6})(?=\d)/g, "$1,");
        return ["Please click below to pay",
            `<a href="javascript:void(0);" onclick="window.open('${process.env.payment_link}?travid=${formattedNumber}#t1')">Payment Link</a>`
        ]
    }
    if (response.intent == "due.payment") {
        return await getAllTravellers(agentId, query.split(' ')[2], query.split(' ')[3], 'due-payment');
    }
    if (response.intent == "due.payment.details") {
        return await sendPaymentForm(agentId, query.split(' ')[3], query.split(' ')[4], query.split(' ')[5]);
    }
    if (response.intent == "room.change") {
        console.log(query);
        // return [`<span class="form">
        //                 <form class="send-payment-form" method="post" onsubmit="roomChangeHandler(event)" data-info="${query.split(' ')[2]}">
        //                     <h3>Enter Room No</h3>
        //                     <input type="number" name="roomno" placeholder="room no" max="99"
        //                         oninput="if(this.value.length > 2) this.value = this.value.slice(0, 2);" required />
        //                     <button type="submit">Click to Save</button>
        //                 </form>
        //             </span>`]
    }
    if (response.intent == "room.change.details") {
        console.log(query);
        // const response = await postRequest(`https://apidev.cultureholidays.com/api/Holidays/UpdateTravlerRoomNo?Travid=${query.split(' ')[3]}&RoomNo=${query.split(' ')[4]}`)
        // console.log(response);
        // if (response.response.length > 0) {
        //     console.log(response);
        // }
        return;
    }
}