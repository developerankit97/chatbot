const axios = require('axios');
const path = require('path');
const fs = require('fs');

module.exports = async (manager) => {
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
    manager.addDocument('en', 'registration process', 'registration.process');
    manager.addDocument('en', 'registration', 'registration.process');
    
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

    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'registrationModel.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);
}