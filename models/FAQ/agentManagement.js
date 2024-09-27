function dashboardModel(manager) {

    // 1. How to Use an Agent Portal?
    manager.addDocument('en', 'How to use an agent portal?', 'portal.use');
    manager.addDocument('en', 'How do I navigate the agent portal?', 'portal.use');
    manager.addDocument('en', 'Can you guide me on using the agent portal?', 'portal.use');
    manager.addDocument('en', 'How do I access the agent portal features?', 'portal.use');
    manager.addDocument('en', 'What is the process for using the agent portal?', 'portal.use');

    // 2. How to Update or Edit Your Profile Details?
    manager.addDocument('en', 'How to update or edit your profile details?', 'profile.update');
    manager.addDocument('en', 'How do I change my profile details?', 'profile.update');
    manager.addDocument('en', 'What steps do I take to modify my profile information?', 'profile.update');
    manager.addDocument('en', 'How can I update my agent profile?', 'profile.update');
    manager.addDocument('en', 'Can you guide me on editing my profile details?', 'profile.update');

    // 3. How to Edit Guest Name & Email ID?
    manager.addDocument('en', 'How to edit guest name and email ID?', 'guest.edit_name_email');
    manager.addDocument('en', 'How do I update guest name and email?', 'guest.edit_name_email');
    manager.addDocument('en', 'What steps should I follow to change guest details?', 'guest.edit_name_email');
    manager.addDocument('en', 'How can I modify guest name and email for a booking?', 'guest.edit_name_email');
    manager.addDocument('en', 'Can you guide me on editing guest name and email?', 'guest.edit_name_email');

    // 4. How to Download the Guest Details?
    manager.addDocument('en', 'How to download guest details?', 'guest.download');
    manager.addDocument('en', 'How do I download guest information from the booking?', 'guest.download');
    manager.addDocument('en', 'What steps should I take to download guest details?', 'guest.download');
    manager.addDocument('en', 'How can I export guest information from my reservation?', 'guest.download');
    manager.addDocument('en', 'Can you guide me on downloading guest details?', 'guest.download');

    // 5. How to Edit or Remove Commission?
    manager.addDocument('en', 'How to edit or remove commission?', 'commission.edit_remove');
    manager.addDocument('en', 'How do I adjust or delete commission in a booking?', 'commission.edit_remove');
    manager.addDocument('en', 'What steps should I follow to remove or change the commission?', 'commission.edit_remove');
    manager.addDocument('en', 'How can I modify or remove commission from my reservation?', 'commission.edit_remove');
    manager.addDocument('en', 'Can you guide me on editing or removing the commission in a booking?', 'commission.edit_remove');


    console.log('FAQ dashboard RAN');

}
module.exports = dashboardModel;