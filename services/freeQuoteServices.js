const { COUNTRIES, postRequest, sendResponseToClient, SOCKET_EVENTS } = require('../utils/helpers');

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

module.exports = {
    sendFreeQuoteForm,
    freeQuoteFormSubmit
}