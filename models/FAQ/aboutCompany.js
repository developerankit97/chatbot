module.exports = async (manager) => {
    // About the company queries
    manager.addDocument('en', 'Who are you?', 'company.about');
    manager.addDocument('en', 'Tell me about Culture Holidays', 'company.about');
    manager.addDocument('en', 'What is Culture Holidays?', 'company.about');
    manager.addDocument('en', 'Can you tell me about your company?', 'company.about');
    manager.addDocument('en', 'Who is Culture Holidays?', 'company.about');

    await manager.train();
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
    
    await manager.train();

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

    await manager.train();

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

    await manager.train();

    manager.addAnswer('en', 'company.vision', `
    Our vision is to be the first name that comes to mind when clients plan dream excursions. 
    We aim to provide efficient, affordable, and customized travel solutions that exceed expectations.
`);

    // Mission queries
    manager.addDocument('en', 'What is the mission of your company?', 'company.mission');
    manager.addDocument('en', 'What’s your mission?', 'company.mission');
    manager.addDocument('en', 'Tell me about your mission', 'company.mission');
    manager.addDocument('en', 'What’s the mission of Culture Holidays?', 'company.mission');

    await manager.train();

    manager.addAnswer('en', 'company.mission', `
    At Culture Holidays, our mission is to create a chain of happy customers by providing premium travel solutions. 
    We want to make traveling anywhere in the world rewarding with the best tour operating experiences.
`);

    // General purpose/goal queries
    manager.addDocument('en', 'What is the purpose of Culture Holidays?', 'company.purpose');
    manager.addDocument('en', 'What is your company goal?', 'company.purpose');
    manager.addDocument('en', 'What’s the main goal of your company?', 'company.purpose');
    manager.addDocument('en', 'What’s the purpose of your company?', 'company.purpose');

    await manager.train();

    manager.addAnswer('en', 'company.purpose', `
    Our purpose is to provide tailored travel solutions to help agents offer transformative travel experiences to their customers. 
    We are dedicated to making every journey a joyful and enriching experience.
`);
    manager.save();
}