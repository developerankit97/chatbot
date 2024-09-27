const axios = require('axios');
const { context } = require('../../utils/helpers');
const { generatePdf } = require('../../utils/generatePDF');

module.exports = async (manager) => {

    // Basic phrases to ask for itineraries
    manager.addDocument('en', 'I need an itinerary', 'itinerary.request');
    manager.addDocument('en', 'Can you create an itinerary for me?', 'itinerary.request');
    manager.addDocument('en', 'I want an itinerary', 'itinerary.request');
    manager.addDocument('en', 'Help me create an itinerary', 'itinerary.request');
    manager.addDocument('en', 'Create itinerary for my trip', 'itinerary.request');
    manager.addDocument('en', 'Show me an itinerary', 'itinerary.request');
    manager.addDocument('en', 'Plan an itinerary for me', 'itinerary.request');
    manager.addDocument('en', 'Make a travel itinerary', 'itinerary.request');
    manager.addDocument('en', 'Can I get an itinerary?', 'itinerary.request');
    manager.addDocument('en', 'How can I make an itinerary?', 'itinerary.request');
    // More variations to capture general itinerary requests
    manager.addDocument('en', 'I need an itinerary for my trip', 'itinerary.request');
    manager.addDocument('en', 'Create a trip itinerary', 'itinerary.request');
    manager.addDocument('en', 'What’s the process to make an itinerary?', 'itinerary.request');
    manager.addDocument('en', 'Help me with an itinerary', 'itinerary.request');
    manager.addDocument('en', 'Could you create a travel itinerary for me?', 'itinerary.request');

    // Response for the general itinerary request
    manager.addAnswer('en', 'itinerary.request', async () => {
        context.query = 'itinerary';
        const countries = await axios.get('https://apidev.cultureholidays.com/api/Holidays/Countrylist');
        // Generate the select options
        let options = `<option value="" disabled selected>Select a country</option>`;
        countries.data.forEach(country => {
            options += `<option value="${country.countryCode}">${country.countryName}</option>`;
        });
        return ["I'd be happy to help you create an itinerary!", "What City are you looking for?", `<div class="select">
            <select id="itinerary-options">
                ${options}
            </select>
        </div>`];
    });

    manager.addDocument('en', 'DU', 'itinerary.request.package');
    manager.addDocument('en', 'IO', 'itinerary.request.package');
    manager.addDocument('en', 'EG', 'itinerary.request.package');
    manager.addDocument('en', 'IND', 'itinerary.request.package');
    manager.addDocument('en', 'GR', 'itinerary.request.package');
    manager.addDocument('en', 'KE', 'itinerary.request.package');
    manager.addDocument('en', 'SO', 'itinerary.request.package');
    manager.addDocument('en', 'MA', 'itinerary.request.package');
    manager.addDocument('en', 'ML', 'itinerary.request.package');
    manager.addDocument('en', 'IS', 'itinerary.request.package');
    manager.addDocument('en', 'MO', 'itinerary.request.package');
    manager.addDocument('en', 'SI', 'itinerary.request.package');
    manager.addDocument('en', 'SP', 'itinerary.request.package');
    manager.addDocument('en', 'SR', 'itinerary.request.package');
    manager.addDocument('en', 'TH', 'itinerary.request.package');
    manager.addDocument('en', 'TU', 'itinerary.request.package');
    manager.addDocument('en', 'VI', 'itinerary.request.package');
    manager.addDocument('en', 'JP', 'itinerary.request.package');
    manager.addDocument('en', 'IT', 'itinerary.request.package');
    manager.addDocument('en', 'FR', 'itinerary.request.package');
    manager.addDocument('en', 'POT', 'itinerary.request.package');
    manager.addDocument('en', 'JO', 'itinerary.request.package');
    manager.addDocument('en', 'GHA', 'itinerary.request.package');
    manager.addDocument('en', 'NEP', 'itinerary.request.package');
    manager.addDocument('en', 'PHL', 'itinerary.request.package');
    manager.addDocument('en', 'IO', 'itinerary.request.package');
    manager.addDocument('en', 'AST', 'itinerary.request.package');
    manager.addDocument('en', 'Croatia', 'itinerary.request.package');
    manager.addDocument('en', 'AUS', 'itinerary.request.package');
    manager.addDocument('en', 'NZD', 'itinerary.request.package');
    manager.addDocument('en', 'ENG', 'itinerary.request.package');
    manager.addDocument('en', 'MR', 'itinerary.request.package');
    manager.addDocument('en', 'FP', 'itinerary.request.package');
    manager.addDocument('en', 'TZ', 'itinerary.request.package');
    manager.addDocument('en', 'ICE', 'itinerary.request.package');
    manager.addDocument('en', 'ZWE', 'itinerary.request.package');
    manager.addDocument('en', 'IR', 'itinerary.request.package');
    manager.addDocument('en', 'SWZ', 'itinerary.request.package');
    manager.addDocument('en', 'Sene', 'itinerary.request.package');
    manager.addDocument('en', 'Togo', 'itinerary.request.package');
    manager.addDocument('en', 'Ben', 'itinerary.request.package');
    manager.addAnswer('en', 'itinerary.request.package', async (countryCode) => {
        context.itinerary = { country: countryCode };
        const packages = await axios.get(`https://apidev.cultureholidays.com/api/Account/PackageDetailsbyCountryCode?CountryCode=${countryCode}&AgentID=chagt0001000012263 `);
        // Generate the select options
        let options = `<option value="" disabled selected>Select a package</option>`;
        packages.data.forEach((package) => {
            options += `<option value="availabledates itinerary ${package.pkG_ID} ${countryCode}">${package.packageName}</option>`; // Adjust property names as needed
        });
        console.log(options);
        return ["Please select a package for your flyer.", `<div class= "select">
            <select id="package-select">
                ${options}
            </select>
            </div >
        `];
    })

    manager.addDocument('en', 'availabledates itinerary', 'itinerary.request.dates');
    manager.addAnswer('en', 'itinerary.request.dates', async (pkg) => {
        console.log(pkg);
        const [, , pkgId, code] = pkg.split(' ');
        const availableDates = await axios.get(`https://apidev.cultureholidays.com/api/Account/GetPackageRoomAvlDate?PKGID=${pkgId}`);
        // Generate the select options
        let options = `<option value="" disabled selected>Select a package</option>`;
        if (availableDates.data.length == 0) {
            return 'No dates available';
        }
        availableDates.data.forEach(date => {
            options += `<option value="itinerary packagedate ${pkgId} ${date.ratE_AVIAL_DATE} ${code}">${date.ratE_AVIAL_DATE}</option>`;
        });
        return `
            Please select a date for your Itinerary.<br><br>
            <div class="select">
                <select id="date-select">
                    ${options}
                </select>
            </div>
        `;
    })

    manager.addDocument('en', 'itinerary packagedate ', 'itinerary.request.details');
    manager.addAnswer('en', 'itinerary.request.details', async (pkg) => {
        const [, , pkgId, code] = pkg.split(' ');
        const packageInfos = await axios(`https://apidev.cultureholidays.com/api/Holidays/PacKageInfo?PKG_ID=${pkgId}`)
        await generatePdf();
        return `
            These are the Highlights for your selected tour.<br><br>
            ${packageInfos.data[0].inF_DESCRIPTION}<br><br>
            <a href="http://localhost:3000/output.pdf" target="_blank">Download Itinerary</a>
        `;
    })



    // Dynamic itinerary for a city or package
    manager.addDocument('en', 'create itinerary for %city%', 'itinerary.create');
    manager.addDocument('en', 'I want to create an itinerary for %package%', 'itinerary.create');
    manager.addDocument('en', 'make an itinerary for %city% from %start_date% to %end_date%', 'itinerary.create');
    manager.addDocument('en', 'build an itinerary for the %package% package', 'itinerary.create');
    manager.addDocument('en', 'how do I create itinerary for %city%?', 'itinerary.create');
    manager.addDocument('en', 'can you make itinerary for %package% package?', 'itinerary.create');
    manager.addAnswer('en', 'itinerary.create', async (context) => {
        console.log(context, 'context');
        const city = context.entities;
        const package = context.entities.package;
        const startDate = context.entities.start_date;
        const endDate = context.entities.end_date;

        // If user specifies a city
        if (city) {
            return `Sure! I'll create an itinerary for ${city}.
        Would you like to select packages or provide dates for your trip?`;
        }

        // If user specifies a package
        if (package) {
            return `Great! Let's build an itinerary for the ${package} package.
        Do you want to provide dates or would you like a suggested itinerary?`;
        }

        // If user provides both city and dates
        if (city && startDate && endDate) {
            return `Here is your custom itinerary for ${city} from ${startDate} to ${endDate}.
        Would you like to see options for accommodations or activities?`;
        }

        // Fallback for missing details
        return `Please provide more details to build your itinerary. You can specify a city, package, or trip dates.`;
    });

    manager.addDocument('en', 'create a detailed itinerary for %city%', 'itinerary.detailed');
    manager.addDocument('en', 'itinerary for %city% starting on %start_date%', 'itinerary.detailed');
    manager.addDocument('en', 'I want an itinerary for %package% starting from %start_date%', 'itinerary.detailed');
    manager.addDocument('en', 'what itinerary do you have for %package% package?', 'itinerary.detailed');

    manager.addAnswer('en', 'itinerary.detailed', async (context) => {
        const city = context.entities.city;
        const package = context.entities.package;
        const startDate = context.entities.start_date;

        if (city && startDate) {
            return `Here is your detailed itinerary for ${city}, starting from ${startDate}.
        Would you like to add activities or accommodations to your itinerary?`;
        }

        if (package && startDate) {
            return `Let's build an itinerary for the ${package} package, starting from ${startDate}.
        What other details would you like to add?`;
        }

        return `Please provide more details such as the city, package, or start date for your itinerary.`;
    });
    manager.addDocument('en', 'plan an itinerary for %city% without dates', 'itinerary.missingDates');
    manager.addAnswer('en', 'itinerary.missingDates', async (context) => {
        const city = context.entities.city;

        if (city) {
            return `Let's create an itinerary for ${city}. When do you plan to start your trip?`;
        }

        return `Please provide a city or package for the itinerary.`;
    });
    await manager.train();
    manager.save();
}