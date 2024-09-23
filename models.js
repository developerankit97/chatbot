const axios = require('axios');

async function trainModel(manager) {
    // Add training data for greetings
    manager.addDocument('en', 'Hello', 'greeting.hello');
    manager.addDocument('en', 'Hi', 'greeting.hi');
    manager.addDocument('en', 'Hey', 'greeting.hey');
    manager.addDocument('en', 'Good morning', 'greeting.good.morning');
    manager.addDocument('en', 'Good afternoon', 'greeting.good.afternoon');
    manager.addDocument('en', 'Good evening', 'greeting.good.evening');
    manager.addDocument('en', 'How are you?', 'greeting.how.are.you');
    manager.addDocument('en', 'What’s up?', 'greeting.whats.up');
    manager.addDocument('en', 'Howdy', 'greeting.howdy');
    manager.addDocument('en', 'Greetings', 'greeting.greetings');
    manager.addDocument('en', 'Hey there', 'greeting.hey.there');
    manager.addDocument('en', 'Hi there', 'greeting.hi.there');
    manager.addDocument('en', 'Hello there', 'greeting.hello.there');
    manager.addDocument('en', 'Hiya', 'greeting.hiya');
    manager.addDocument('en', 'Hey buddy', 'greeting.hey.buddy');
    manager.addDocument('en', 'What’s happening?', 'greeting.whats.happening');
    manager.addDocument('en', 'How’s it going?', 'greeting.hows.it.going');
    manager.addDocument('en', 'Hello, how can I help you?', 'greeting.hello.how.can.i.help');
    manager.addDocument('en', 'Hi, what can I do for you today?', 'greeting.hi.what.can.i.do');
    manager.addDocument('en', 'Hey, how’s your day?', 'greeting.hey.hows.your.day');



    // Add responses with "Culture Holidays"
    manager.addAnswer('en', 'greeting.hello', 'Hello! Welcome to Culture Holidays. How can I assist you today?');
    manager.addAnswer('en', 'greeting.hi', 'Hi there! Welcome to Culture Holidays. What can I do for you?');
    manager.addAnswer('en', 'greeting.hey', 'Hey! You’re speaking with Culture Holidays. How can I help?');
    manager.addAnswer('en', 'greeting.good.morning', 'Good morning! Welcome to Culture Holidays. How can I assist you today?');
    manager.addAnswer('en', 'greeting.good.afternoon', 'Good afternoon! You’ve reached Culture Holidays. How can I help you?');
    manager.addAnswer('en', 'greeting.good.evening', 'Good evening! Culture Holidays is here to assist you. How can I help?');
    manager.addAnswer('en', 'greeting.how.are.you', 'I’m doing great, thanks for asking! How can Culture Holidays assist you?');
    manager.addAnswer('en', 'greeting.whats.up', 'Not much, just here at Culture Holidays! What can I do for you?');
    manager.addAnswer('en', 'greeting.howdy', 'Howdy! Welcome to Culture Holidays. How can I be of service today?');
    manager.addAnswer('en', 'greeting.greetings', 'Greetings! You’ve reached Culture Holidays. What can we assist you with?');
    manager.addAnswer('en', 'greeting.hey.there', 'Hey there! Culture Holidays is here to help. How can I assist you?');
    manager.addAnswer('en', 'greeting.hi.there', 'Hi there! Welcome to Culture Holidays. What’s up?');
    manager.addAnswer('en', 'greeting.hello.there', 'Hello there! Culture Holidays is here to assist you. How can I help?');
    manager.addAnswer('en', 'greeting.hiya', 'Hiya! Welcome to Culture Holidays. How can I help you today?');
    manager.addAnswer('en', 'greeting.hey.buddy', 'Hey buddy! Culture Holidays is ready to assist. What do you need?');
    manager.addAnswer('en', 'greeting.whats.happening', 'Not much, just helping out at Culture Holidays! How can I assist you?');
    manager.addAnswer('en', 'greeting.hows.it.going', 'It’s going great, thanks! How can Culture Holidays assist you today?');
    manager.addAnswer('en', 'greeting.hello.how.can.i.help', 'Hello! You’re speaking with Culture Holidays. How can I help you today?');
    manager.addAnswer('en', 'greeting.hi.what.can.i.do', 'Hi! Welcome to Culture Holidays. What can I do for you today?');
    manager.addAnswer('en', 'greeting.hey.hows.your.day', 'Hey! Culture Holidays is doing great, thanks for asking. How can I assist you?');

    // Step 1: General queries related to registration
    manager.addDocument('en', 'How do I register?', 'registration.general');
    manager.addDocument('en', 'I want to register as an agent', 'registration.general');
    manager.addDocument('en', 'Can I sign up?', 'registration.general');
    manager.addDocument('en', 'How to become a travel agent?', 'registration.general');
    manager.addDocument('en', 'Where can I register?', 'registration.general');
    manager.addDocument('en', 'Sign up process', 'registration.general');

    // Responses for general queries
    manager.addAnswer('en', 'registration.general', 'To register as a travel agent, visit Culture Holidays at https://cultureholidays.com/. Click on "Travel Agent Registration" at the top of the homepage.');

    // Step 2: Verifying email during registration
    manager.addDocument('en', 'How to verify my email?', 'registration.email.verify');
    manager.addDocument('en', 'I did not get a verification email', 'registration.email.verify');
    manager.addDocument('en', 'How do I verify my account?', 'registration.email.verify');
    manager.addDocument('en', 'How do I proceed after email verification?', 'registration.email.verify');

    // Responses for email verification
    manager.addAnswer('en', 'registration.email.verify', 'After entering your email ID, click the "Verify Now" button. Check your email for a link and click "Click to Verify Email" to complete the verification.');

    // Step 3: Filling out the registration form
    manager.addDocument('en', 'What information do I need to fill in the form?', 'registration.form');
    manager.addDocument('en', 'What details do I need to provide to register?', 'registration.form');
    manager.addDocument('en', 'What is required in the registration form?', 'registration.form');

    // Responses for filling out the form
    manager.addAnswer('en', 'registration.form', 'In the registration form, you need to provide your title, full name, email ID, mobile number, address, city, country, and date of birth. After filling in the details, proceed to the next step.');

    // Step 4: About Your Business
    manager.addDocument('en', 'What should I include in the About Your Business section?', 'registration.about.business');
    manager.addDocument('en', 'What business details are needed for registration?', 'registration.about.business');
    manager.addDocument('en', 'What company information do I need?', 'registration.about.business');

    // Responses for About Your Business section
    manager.addAnswer('en', 'registration.about.business', 'In the "About Your Business" section, you will provide your company name, User ID (your email), create a password, and provide your business contact. Optionally, upload your company logo and profile photo.');

    // Step 5: Business Promotion Details
    manager.addDocument('en', 'What details are required for promoting my site?', 'registration.promotion');
    manager.addDocument('en', 'How do I answer promotion questions?', 'registration.promotion');
    manager.addDocument('en', 'What should I provide for the promotion step?', 'registration.promotion');

    // Responses for business promotion
    manager.addAnswer('en', 'registration.promotion', 'You will need to provide details on how you will promote your site, and the number of trips you plan to organize in the year. Make sure to answer all the relevant questions.');

    // Step 6: Certification Upload
    manager.addDocument('en', 'How do I provide certification?', 'registration.certification');
    manager.addDocument('en', 'What certificates do I need to upload?', 'registration.certification');
    manager.addDocument('en', 'How do I upload my business certificates?', 'registration.certification');

    // Responses for certification upload
    manager.addAnswer('en', 'registration.certification', 'You will need to upload relevant certification or links to verify your travel business. You can also upload a membership certificate if available. Make sure to select the appropriate certification options.');

    // Step 7: Picture Verification
    manager.addDocument('en', 'How do I complete picture verification?', 'registration.picture.verification');
    manager.addDocument('en', 'How do I take a selfie?', 'registration.picture.verification');
    manager.addDocument('en', 'What is the selfie step?', 'registration.picture.verification');

    // Responses for picture verification
    manager.addAnswer('en', 'registration.picture.verification', 'To complete the picture verification, click on the "Click Here" button to take a selfie. After that, tick the box below and click "Submit."');

    // Step 8: Final Step - Login Information
    manager.addDocument('en', 'How do I complete the registration?', 'registration.final');
    manager.addDocument('en', 'What’s the final step to register?', 'registration.final');
    manager.addDocument('en', 'What do I do after submitting my form?', 'registration.final');

    // Responses for final registration step
    manager.addAnswer('en', 'registration.final', 'Once you submit your form, check your registered email for your login details. Your account will be ready to use.');

    // General registration process queries
    manager.addDocument('en', 'How do I register?', 'registration.process');
    manager.addDocument('en', 'What is the registration process?', 'registration.process');
    manager.addDocument('en', 'Can you guide me through the registration steps?', 'registration.process');
    manager.addDocument('en', 'Tell me the steps to register as a travel agent', 'registration.process');

    // Responses for the full registration process
    manager.addAnswer('en', 'registration.process', `
    The registration process is simple:<br><br>
    1. Visit Culture Holidays at <a href="https://www.cultureholidays.com" target="_blank">Cultureholidays.com</a> and click "Travel Agent Registration."<br><br>
    2. Enter your email ID and click "Verify Now."<br><br>
    3. Check your email and click "Click to Verify Email" to complete verificationn<br><br>
    4. Fill out the registration form with your details.<br><br>
    5. Provide business details, upload optional logo, and create your password.<br><br>
    6. Upload certification and complete picture verification.<br><br>
    7. Finally, check your email for login details.<br><br>
    For a detailed guide, visit: <a href="https://cultureholidays.com/HelpCentre/FaqAnsDetails?FAQ_S_ID=1" target="_blank">Click Here</a><br><br>
`);

    // Step-by-step detailed registration steps
    manager.addDocument('en', 'What are the detailed steps to complete registration?', 'registration.detailed.process');
    manager.addDocument('en', 'Tell me all the steps for registration on Culture Holidays', 'registration.detailed.process');
    manager.addDocument('en', 'Can you explain the registration process in detail?', 'registration.detailed.process');

    // Detailed registration steps response
    manager.addAnswer('en', 'registration.detailed.process', `
    Step 1: Visit <a href="https://www.cultureholidays.com" target="_blank">Cultureholidays.com</a>.<br><br>
    Step 2: Go to 'Travel Agent Registration' on the homepage.<br><br>
    Step 3: Verify your email by entering your email ID and clicking 'Verify Now.'<br><br>
    Step 4: Check your email for the verification link.<br><br>
    Step 5: Fill out the registration form with your name, email, mobile, and address.<br><br>
    Step 6: Enter your company name, User ID (your email), password, and business contact.<br><br>
    Step 7: Optionally upload your logo and answer business-related questions.<br><br>
    Step 8: Provide certifications or relevant links.<br><br>
    Step 9: Complete picture verification by taking a selfie.<br><br>
    Step 10: Submit the registration and check your email for login details.<br><br>
`);

    // Completing registration queries
    manager.addDocument('en', 'How do I complete my registration?', 'registration.complete');
    manager.addDocument('en', 'What is the final step to complete registration?', 'registration.complete');
    manager.addDocument('en', 'How do I finish registering?', 'registration.complete');

    // Response for completing registration
    manager.addAnswer('en', 'registration.complete', `
    To complete the registration, make sure you've submitted all necessary information, including certification and picture verification.<br><br>
    After submission, check your email for your login details.
`);

    // Other missing queries
    // Verifying email
    manager.addDocument('en', 'How do I verify my email?', 'registration.email.verify');
    manager.addAnswer('en', 'registration.email.verify', 'After entering your email ID, click the "Verify Now" button. Then check your email and click the "Click to Verify Email" link to complete the verification.');

    // Filling the form
    manager.addDocument('en', 'What do I need to fill in the registration form?', 'registration.form');
    manager.addAnswer('en', 'registration.form', 'You need to provide your full name, email ID, mobile number, address, city, and country. Once done, move to the next step of the registration.');

    // Business Details
    manager.addDocument('en', 'What details are required about my business?', 'registration.about.business');
    manager.addAnswer('en', 'registration.about.business', 'Enter your company name, User ID (your email), create a password, and provide your business contact details.');

    // Upload Certification
    manager.addDocument('en', 'What certification do I need to upload?', 'registration.certification');
    manager.addAnswer('en', 'registration.certification', 'Upload certification or relevant links to verify your travel business. This could include membership certificates if available.');

    // Final response for the registration completion
    manager.addDocument('en', 'What happens after I submit my registration?', 'registration.submit');
    manager.addAnswer('en', 'registration.submit', 'Once your registration is submitted, check your email for your login credentials to access your account.');

    // About the company queries
    manager.addDocument('en', 'Who are you?', 'company.about');
    manager.addDocument('en', 'Tell me about Culture Holidays', 'company.about');
    manager.addDocument('en', 'What is Culture Holidays?', 'company.about');
    manager.addDocument('en', 'Can you tell me about your company?', 'company.about');
    manager.addDocument('en', 'Who is Culture Holidays?', 'company.about');

    manager.addAnswer('en', 'company.about', `
    Culture Holidays is the leading B2B tour operator offering a wide range of travel solutions. 
    We help travel agents grow their sales by offering customized tour packages that meet their clients' unique travel needs.
    Visit us at https://cultureholidays.com for more information.
`);

    // What the company does queries
    manager.addDocument('en', 'What does your company do?', 'company.what');
    manager.addDocument('en', 'What do you do at Culture Holidays?', 'company.what');
    manager.addDocument('en', 'What services does Culture Holidays offer?', 'company.what');
    manager.addDocument('en', 'What kind of packages do you provide?', 'company.what');

    manager.addAnswer('en', 'company.what', `
    Culture Holidays customizes tour packages based on your customers' preferences. 
    We offer a variety of experiences, including FAM trips, group tours, luxury trips, and more. 
    Since 2000, we’ve been helping agents provide unforgettable travel experiences. 
    Check our services at https://cultureholidays.com.
`);

    // Why the company does it
    manager.addDocument('en', 'Why does Culture Holidays do this?', 'company.why');
    manager.addDocument('en', 'What is the reason behind your company?', 'company.why');
    manager.addDocument('en', 'Why do you offer these services?', 'company.why');
    manager.addDocument('en', 'What motivates Culture Holidays?', 'company.why');

    manager.addAnswer('en', 'company.why', `
    At Culture Holidays, we believe travel transforms people by rejuvenating their souls. 
    Our goal is to help people discover new aspects of themselves through customized journeys. 
    We want to make every journey joyful, offering transformative experiences to our clients.
`);

    // Vision queries
    manager.addDocument('en', 'What is your company vision?', 'company.vision');
    manager.addDocument('en', 'Tell me the vision of Culture Holidays', 'company.vision');
    manager.addDocument('en', 'What is the vision of Culture Holidays?', 'company.vision');
    manager.addDocument('en', 'What’s your vision?', 'company.vision');

    manager.addAnswer('en', 'company.vision', `
    Our vision is to be the first name that comes to mind when clients plan dream excursions. 
    We aim to provide efficient, affordable, and customized travel solutions that exceed expectations.
`);

    // Mission queries
    manager.addDocument('en', 'What is the mission of your company?', 'company.mission');
    manager.addDocument('en', 'What’s your mission?', 'company.mission');
    manager.addDocument('en', 'Tell me about your mission', 'company.mission');
    manager.addDocument('en', 'What’s the mission of Culture Holidays?', 'company.mission');

    manager.addAnswer('en', 'company.mission', `
    At Culture Holidays, our mission is to create a chain of happy customers by providing premium travel solutions. 
    We want to make traveling anywhere in the world rewarding with the best tour operating experiences.
`);

    // General purpose/goal queries
    manager.addDocument('en', 'What is the purpose of Culture Holidays?', 'company.purpose');
    manager.addDocument('en', 'What is your company goal?', 'company.purpose');
    manager.addDocument('en', 'What’s the main goal of your company?', 'company.purpose');
    manager.addDocument('en', 'What’s the purpose of your company?', 'company.purpose');

    manager.addAnswer('en', 'company.purpose', `
    Our purpose is to provide tailored travel solutions to help agents offer transformative travel experiences to their customers. 
    We are dedicated to making every journey a joyful and enriching experience.
`);

    // Adding some common vulgar words (examples only, expand as needed)
    manager.addDocument('en', 'You are an idiot', 'vulgar.language');
    manager.addDocument('en', 'This is bullshit', 'vulgar.language');
    manager.addDocument('en', 'Shut up', 'vulgar.language');
    manager.addDocument('en', 'Damn you', 'vulgar.language');
    manager.addDocument('en', 'Fuck off', 'vulgar.language');
    manager.addDocument('en', 'You are a piece of crap', 'vulgar.language');
    manager.addDocument('en', 'What a shit service', 'vulgar.language');
    manager.addDocument('en', 'You suck', 'vulgar.language');
    manager.addDocument('en', 'Go to hell', 'vulgar.language');
    manager.addDocument('en', 'motherfucker', 'vulgar.language');
    manager.addDocument('en', 'penis loda gandu jhantu', 'vulgar.language');
    manager.addDocument('en', 'bitch', 'vulgar.language');

    // Add as many variations of vulgar words as necessary to improve detection

    // Response for vulgar language: polite redirection
    manager.addAnswer('en', 'vulgar.language', `
    Let's keep the conversation respectful. 
    How about we focus on your travel needs or questions about Culture Holidays? 😊
`);

    // Another response option to vary the chatbot's replies
    manager.addAnswer('en', 'vulgar.language', `
    We aim for positive and helpful interactions. 
    Could you kindly ask something else related to your travel inquiries? 
    I’m here to help with any travel-related questions you may have!
`);

    // Additional polite response
    manager.addAnswer('en', 'vulgar.language', `
    I understand you might be upset, but let's keep the conversation positive.
    Please feel free to ask me anything related to Culture Holidays, and I'll do my best to assist you!
`);

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
    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    // Query to start the flyer creation process
    manager.addDocument('en', 'I want to create a flyer', 'flyer.create');
    manager.addDocument('en', 'Can I create a flyer now?', 'flyer.create');
    manager.addDocument('en', 'Help me create a flyer', 'flyer.create');
    manager.addDocument('en', 'Design a flyer', 'flyer.create');
    manager.addDocument('en', 'Generate a flyer', 'flyer.create');
    manager.addDocument('en', 'Make a flyer', 'flyer.create');
    manager.addDocument('en', 'Build a flyer', 'flyer.create');
    manager.addDocument('en', 'Produce a flyer', 'flyer.create');
    manager.addDocument('en', 'Prepare a flyer', 'flyer.create');
    manager.addDocument('en', 'Customize a flyer', 'flyer.create');
    manager.addDocument('en', 'Craft a flyer', 'flyer.create');
    manager.addDocument('en', 'Set up a flyer', 'flyer.create');
    manager.addDocument('en', 'Develop a flyer', 'flyer.create');
    manager.addDocument('en', 'Create custom flyer', 'flyer.create');
    manager.addDocument('en', 'Design my flyer', 'flyer.create');
    manager.addDocument('en', 'Start flyer creation', 'flyer.create');
    manager.addDocument('en', 'Flyer creation process', 'flyer.create');
    manager.addDocument('en', 'Build a custom flyer', 'flyer.create');
    manager.addDocument('en', 'Generate marketing flyer', 'flyer.create');
    manager.addDocument('en', 'Flyer builder', 'flyer.create');
    manager.addDocument('en', 'Flyer generator', 'flyer.create');
    manager.addDocument('en', 'Make a custom flyer', 'flyer.create');
    manager.addDocument('en', 'Create promotional flyer', 'flyer.create');
    manager.addDocument('en', 'Design a new flyer', 'flyer.create');
    manager.addDocument('en', 'Create my flyer now', 'flyer.create');
    manager.addDocument('en', 'Create your flyer', 'flyer.create');
    manager.addDocument('en', 'Start making a flyer', 'flyer.create');
    manager.addDocument('en', 'Start flyer generator', 'flyer.create');
    manager.addDocument('en', 'Produce marketing flyer', 'flyer.create');
    manager.addDocument('en', 'Generate custom flyer', 'flyer.create');
    manager.addDocument('en', 'Start designing a flyer', 'flyer.create');
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
        return `
            Great! you like to start creating your flyer now 
            Please select a country for your flyer.<br><br>
            <div class="select">
                <select id="country-select">
                    ${options}
                </select>
            </div>
        `;
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
        console.log(packages, 'Package details by country code');
        // Generate the select options
        let options = `<option value="" disabled selected>Select a package</option>`;
        packages.data.forEach((package) => {
            options += `<option value="availabledates ${package.pkG_ID} ${countryCode}">${package.packageName}</option>`; // Adjust property names as needed
        });
        return `
            Please select a package for your flyer.<br><br>
            <div class="select">
                <select id="package-select">
                    ${options}
                </select>
            </div>
        `;
    })
    manager.addDocument('en', 'availabledates', 'flyer.packageDates');
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

    //     // Final link to create the flyer
    //     manager.addAnswer('en', 'flyer.create', `
    //     For a complete process to create your flyer, click here: 
    //     [Create Your Flyer](https://cultureholidays.com/createyourflyer)
    // `);
    await manager.train();
    manager.save();
    console.log('Greeting model with Culture Holidays trained and saved.');
}

module.exports = { trainModel }