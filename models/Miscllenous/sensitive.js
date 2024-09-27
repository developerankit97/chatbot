module.exports = async (manager) => {
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
    manager.addDocument('en', 'adult sites', 'vulgar.language');
    manager.addDocument('en', 'play for me', 'vulgar.language');

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
}