const axios = require('axios');
module.exports = async (manager) => {
    // Queries about what is a flyer
    manager.addDocument('en', 'What is a flyer?', 'flyer.what');
    manager.addDocument('en', 'Can you explain what a flyer is?', 'flyer.what');
    manager.addDocument('en', 'What do you mean by a flyer?', 'flyer.what');
    manager.addDocument('en', 'Tell me about flyers', 'flyer.what');
    manager.addDocument('en', 'What is the purpose of a flyer?', 'flyer.what');

    // Responses for what a flyer is
    manager.addAnswer('en', 'flyer.what', `
    A flyer is a single-page promotional material used to share information quickly and effectively. 
    It often contains eye-catching visuals and concise text to highlight key offers or services. 
    Flyers are perfect for showcasing special travel deals or packages from Culture Holidays.
`);

    // Queries about how flyers can help agents
    manager.addDocument('en', 'How can a flyer help me as a travel agent?', 'flyer.help');
    manager.addDocument('en', 'Why should I use flyers?', 'flyer.help');
    manager.addDocument('en', 'How can flyers help my business?', 'flyer.help');
    manager.addDocument('en', 'What benefits do flyers offer to travel agents?', 'flyer.help');
    manager.addDocument('en', 'Why are flyers useful for promoting tours?', 'flyer.help');

    // Responses for how flyers help travel agents
    manager.addAnswer('en', 'flyer.help', `
    Flyers are a great tool for travel agents to attract clients. They help showcase special offers, tour packages, or promotions in a visually appealing way.
    Flyers allow you to quickly communicate key details about trips or discounts, which can drive more sales and client interest in your services at Culture Holidays.
`);

    manager.addAnswer('en', 'flyer.help', `
    Flyers can help you promote exclusive travel deals and unique packages from Culture Holidays. 
    By distributing them physically or digitally, you can reach potential clients who may not be aware of your offers, increasing your visibility and sales.
`);

    manager.addAnswer('en', 'flyer.help', `
    As a travel agent, flyers can act as an effective promotional tool to advertise upcoming trips or seasonal offers. 
    They provide a simple yet impactful way to generate interest and increase bookings, helping you grow your business with Culture Holidays.
`);


    // Query to start the flyer creation process
    manager.addDocument('en', 'want create flyer', 'flyer.create');
    manager.addDocument('en', 'Help me create flyer', 'flyer.create');
    manager.addDocument('en', 'Design flyer', 'flyer.create');
    manager.addDocument('en', 'Generate flyer', 'flyer.create');
    manager.addDocument('en', 'Make flyer', 'flyer.create');
    manager.addDocument('en', 'Build flyer', 'flyer.create');
    manager.addDocument('en', 'Produce flyer', 'flyer.create');
    manager.addDocument('en', 'Prepare flyer', 'flyer.create');
    manager.addDocument('en', 'Customize flyer', 'flyer.create');
    manager.addDocument('en', 'Craft flyer', 'flyer.create');
    manager.addDocument('en', 'Set up flyer', 'flyer.create');
    manager.addDocument('en', 'Develop flyer', 'flyer.create');
    manager.addDocument('en', 'Create custom flyer', 'flyer.create');
    manager.addDocument('en', 'Design my flyer', 'flyer.create');
    manager.addDocument('en', 'Start flyer creation', 'flyer.create');
    manager.addDocument('en', 'Flyer creation process', 'flyer.create');
    manager.addDocument('en', 'Build custom flyer', 'flyer.create');
    manager.addDocument('en', 'Generate marketing flyer', 'flyer.create');
    manager.addDocument('en', 'Flyer builder', 'flyer.create');
    manager.addDocument('en', 'Flyer generator', 'flyer.create');
    manager.addDocument('en', 'Make custom flyer', 'flyer.create');
    manager.addDocument('en', 'Create promotional flyer', 'flyer.create');
    manager.addDocument('en', 'Design new flyer', 'flyer.create');
    manager.addDocument('en', 'Create my flyer now', 'flyer.create');
    manager.addDocument('en', 'Create your flyer', 'flyer.create');
    manager.addDocument('en', 'Start making flyer', 'flyer.create');
    manager.addDocument('en', 'Start flyer generator', 'flyer.create');
    manager.addDocument('en', 'Produce marketing flyer', 'flyer.create');
    manager.addDocument('en', 'Generate custom flyer', 'flyer.create');
    manager.addDocument('en', 'Start designing flyer', 'flyer.create');
    manager.addDocument('en', 'Generate flyer template', 'flyer.create');
    manager.addDocument('en', 'Create flyer template', 'flyer.create');

    // Initial response asking if they want to create a flyer
    manager.addAnswer('en', 'flyer.create', async () => {
        const countries = await axios.get('https://apidev.cultureholidays.com/api/Holidays/Countrylist');
        // Generate the select options
        let options = `<option value="" disabled selected>Select a country</option>`;
        countries.data.forEach(country => {
            options += `<option value="${country.countryCode}">${country.countryName}</option>`;
        });
        return ["Great! you like to start creating your flyer now", "Please select a country for your flyer."
            , `<div class="select">
                    <select id="country-select">
                        ${options}
                    </select>
                </div>`];
    });
    manager.addDocument('en', 'DU', 'flyer.package');
    manager.addDocument('en', 'IO', 'flyer.package');
    manager.addDocument('en', 'EG', 'flyer.package');
    manager.addDocument('en', 'IND', 'flyer.package');
    manager.addDocument('en', 'GR', 'flyer.package');
    manager.addDocument('en', 'KE', 'flyer.package');
    manager.addDocument('en', 'SO', 'flyer.package');
    manager.addDocument('en', 'MA', 'flyer.package');
    manager.addDocument('en', 'ML', 'flyer.package');
    manager.addDocument('en', 'IS', 'flyer.package');
    manager.addDocument('en', 'MO', 'flyer.package');
    manager.addDocument('en', 'SI', 'flyer.package');
    manager.addDocument('en', 'SP', 'flyer.package');
    manager.addDocument('en', 'SR', 'flyer.package');
    manager.addDocument('en', 'TH', 'flyer.package');
    manager.addDocument('en', 'TU', 'flyer.package');
    manager.addDocument('en', 'VI', 'flyer.package');
    manager.addDocument('en', 'JP', 'flyer.package');
    manager.addDocument('en', 'IT', 'flyer.package');
    manager.addDocument('en', 'FR', 'flyer.package');
    manager.addDocument('en', 'POT', 'flyer.package');
    manager.addDocument('en', 'JO', 'flyer.package');
    manager.addDocument('en', 'GHA', 'flyer.package');
    manager.addDocument('en', 'NEP', 'flyer.package');
    manager.addDocument('en', 'PHL', 'flyer.package');
    manager.addDocument('en', 'IO', 'flyer.package');
    manager.addDocument('en', 'AST', 'flyer.package');
    manager.addDocument('en', 'Croatia', 'flyer.package');
    manager.addDocument('en', 'AUS', 'flyer.package');
    manager.addDocument('en', 'NZD', 'flyer.package');
    manager.addDocument('en', 'ENG', 'flyer.package');
    manager.addDocument('en', 'MR', 'flyer.package');
    manager.addDocument('en', 'FP', 'flyer.package');
    manager.addDocument('en', 'TZ', 'flyer.package');
    manager.addDocument('en', 'ICE', 'flyer.package');
    manager.addDocument('en', 'ZWE', 'flyer.package');
    manager.addDocument('en', 'IR', 'flyer.package');
    manager.addDocument('en', 'SWZ', 'flyer.package');
    manager.addDocument('en', 'Sene', 'flyer.package');
    manager.addDocument('en', 'Togo', 'flyer.package');
    manager.addDocument('en', 'Ben', 'flyer.package');
    manager.addAnswer('en', 'flyer.package', async (countryCode) => {
        const packages = await axios.get(`https://apidev.cultureholidays.com/api/Account/PackageDetailsbyCountryCode?CountryCode=${countryCode}&AgentID=chagt0001000012263 `);
        // Generate the select options
        let options = `<option value="" disabled selected>Select a package</option>`;
        packages.data.forEach((package) => {
            options += `<option value="availabledates flyer ${package.pkG_ID} ${countryCode}">${package.packageName}</option>`; // Adjust property names as needed
        });
        return ["Please select a package for your flyer.", `<div class="select">
                <select id="package-select">
                    ${options}
                </select>
            </div>`];
    })
    manager.addDocument('en', 'availabledates flyer', 'flyer.packageDates');
    manager.addAnswer('en', 'flyer.packageDates', async (pkg) => {
        const [, pkgId, code] = pkg.split(' ');
        console.log('package', pkgId);
        const availableDates = await axios.get(`https://apidev.cultureholidays.com/api/Account/GetPackageRoomAvlDate?PKGID=${pkgId}`);
        // Generate the select options
        let options = `<option value="" disabled selected>Select a package</option>`;
        if (availableDates.data.length == 0) {
            return 'No dates available';
        }
        availableDates.data.forEach(date => {
            options += `<option value="flyerpackagedate ${pkgId} ${date.ratE_AVIAL_DATE} ${code}">${date.ratE_AVIAL_DATE}</option>`;
        });
        console.log(availableDates);
        return `
            Please select a date for your flyer.<br><br>
            <div class="select">
                <select id="date-select">
                    ${options}
                </select>
            </div>
        `;
    })
    manager.addDocument('en', 'flyerpackagedate', 'flyer.detail');
    manager.addAnswer('en', 'flyer.detail', async (pkg) => {
        const [, pkgId, date, countryCode] = pkg.split(' ');
        return `
        Great! Your flyer details are as follows:<br><br>
        Click below to finalize your template: <a href="https://cultureholidays.com/createyourflyer?countrycode=${countryCode}&pkgid=${pkgId}#!" target="_blank">Finalize flyer</a>`
    })
    // Queries for selecting a country
    manager.addDocument('en', 'Select country', 'flyer.select.country');
    manager.addDocument('en', 'I want to choose a country', 'flyer.select.country');
    manager.addDocument('en', 'What country should I choose?', 'flyer.select.country');

    // Response for selecting a country
    manager.addAnswer('en', 'flyer.select.country', `
    Please select a country for your flyer:
    1. India
    2. Thailand
    3. France
    4. USA
    5. Australia
    (You can type the number or the name of the country.)
`);

    // Placeholder for package selection (you can extend this further)
    manager.addDocument('en', 'I want to select a package', 'flyer.select.package');
    manager.addDocument('en', 'What packages are available?', 'flyer.select.package');

    // Response for selecting a package
    manager.addAnswer('en', 'flyer.select.package', `
    Please select a package for your flyer:
    1. Family Tour
    2. Adventure Tour
    3. Romantic Getaway
    4. Cultural Experience
    (You can type the number or the name of the package.)
`);

    // Queries for selecting an image
    manager.addDocument('en', 'Select an image', 'flyer.select.image');
    manager.addDocument('en', 'I want to choose an image', 'flyer.select.image');

    // Response for selecting an image
    manager.addAnswer('en', 'flyer.select.image', `
    Please select an image for your flyer. 
    You can upload an image or choose from our gallery.
`);

    // Queries for entering details
    manager.addDocument('en', 'Enter my details', 'flyer.enter.details');
    manager.addDocument('en', 'What details do I need to enter?', 'flyer.enter.details');

    // Response for entering details
    manager.addAnswer('en', 'flyer.enter.details', `
    Please enter your details:
    - Date
    - Name
    - Mobile Number
    If you want a QR code for quick booking, click the checkbox option for QR code.
`);

    // Queries for choosing a template
    manager.addDocument('en', 'Choose a template', 'flyer.choose.template');
    manager.addDocument('en', 'What template should I select?', 'flyer.choose.template');

    // Response for choosing a template
    manager.addAnswer('en', 'flyer.choose.template', `
    Choose a template that suits your flyer. 
    Once you've selected, click on 'Customize your template' and download your new generated flyer! 👌
`);

}