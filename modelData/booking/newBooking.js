const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { getCountries, getPackageNightsByCountryCode, getPackagesbyNightAndCountryCode, getSearchIdByCountryCodeAndPkgId } = require('../../services/services');
const { postRequest, getRequest } = require('../../utils/helpers');
const { getFileData } = require('../../database/db');

module.exports = async (manager) => {
    // Add different training phrases that users might use to create a new booking
    manager.addDocument('en', '%create% %package%', 'booking.create');
    manager.addDocument('en', '%create% %booking%', 'booking.create');

    // Add answers for the booking intent
    manager.addAnswer('en', 'booking.create', async (filterMessage, entities, agentId, io) => {
        const countries = await getCountries('bookingcountry');
        return [
            "🌍 Exciting! Let's begin crafting your perfect getaway. 🧳✨ Where's your next adventure?",
            countries
        ];
    });
    manager.addAnswer('en', 'booking.create', async (filterMessage, entities, agentId, io) => {
        const countries = await getCountries('bookingcountry');
        return ["🌍Got it! Starting the booking process.", countries];
    });
    // async function bookingProcess(agentId = process.env.dummy_agentId) {
    //     const agentData = getFileData(agentId);
    //     if (agentData.context['country']) {

    //     }
    // }
    manager.addAnswer('en', 'booking.create', async (filterMessage, entities, agentId, io) => {
        const countries = await getCountries('bookingcountry');
        return ["I can help with that! Let’s get your reservation started.", countries];
    });

    manager.addDocument('en', '%create% %package% %country%', 'booking.create.country');

    // Add answers for the booking intent
    manager.addAnswer('en', 'booking.create.country', async (country) => {
        const countries = await getCountries('bookingcountry');
        return ["Sure! Let’s get your trip to {{country}} booked.", countries]
    });
    manager.addAnswer('en', 'booking.create.country', async () => {
        return ["Booking a trip to {{country}} sounds great! Let’s start."]
    });
    manager.addAnswer('en', 'booking.create.country', async () => {
        return ["Got it! Let’s create your reservation for {{country}}."]
    });


    manager.addDocument('en', 'bookingcountry %countrycode%', 'booking.country.nights');
    
    manager.addAnswer('en', 'booking.country.nights', async (agentId, context, query) => {
        return await getPackageNightsByCountryCode(agentId, context.countrycode);

    })

    manager.addDocument('en', 'booking nights %number% %countrycode%', 'booking.country.package.dates');
    manager.addAnswer('en', 'booking.country.package.dates', async (agentId, context, query, entities, io) => {
        console.log(agentId, context, query);
        return await getPackagesbyNightAndCountryCode(agentId, query.split(' ')[2], context.countrycode.toLowerCase())
    })


    manager.addDocument('en', 'newbooking packageselect %number% %countrycode%', 'booking.process.complete');
    manager.addAnswer('en', 'booking.process.complete', async (agentId, context, query, entities, io) => {
        return await getSearchIdByCountryCodeAndPkgId(agentId, query.split(' ')[2], context.countrycode.toLowerCase());
    })

    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'bookingModel.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);
}