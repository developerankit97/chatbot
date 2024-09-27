function  bookingModel(manager) {
    // 1. How to Book Tour Packages?
manager.addDocument('en', 'How to book tour packages?', 'booking.book_package');
manager.addDocument('en', 'How do I book a tour package?', 'booking.book_package');
manager.addDocument('en', 'Can you guide me on booking a tour package?', 'booking.book_package');
manager.addDocument('en', 'How do I reserve a tour package?', 'booking.book_package');
manager.addDocument('en', 'What steps should I follow to book a tour?', 'booking.book_package');

// 2. How to Add Your Markup?
manager.addDocument('en', 'How to add your markup?', 'booking.add_markup');
manager.addDocument('en', 'How do I add my markup to the booking?', 'booking.add_markup');
manager.addDocument('en', 'What steps to include a markup on my booking?', 'booking.add_markup');
manager.addDocument('en', 'How can I apply a markup to my booking?', 'booking.add_markup');
manager.addDocument('en', 'Can you guide me on how to add a markup?', 'booking.add_markup');

// 3. How to Update Your Markup?
manager.addDocument('en', 'How to update your markup?', 'booking.update_markup');
manager.addDocument('en', 'How can I update my markup for a booking?', 'booking.update_markup');
manager.addDocument('en', 'What steps do I take to change the markup?', 'booking.update_markup');
manager.addDocument('en', 'How do I modify the markup I added?', 'booking.update_markup');
manager.addDocument('en', 'Can you guide me on updating my markup?', 'booking.update_markup');

// 4. How to Add Add-Ons Markup?
manager.addDocument('en', 'How to add add-ons markup?', 'booking.add_addon_markup');
manager.addDocument('en', 'How do I add a markup for the add-ons?', 'booking.add_addon_markup');
manager.addDocument('en', 'What steps should I follow to include a markup for add-ons?', 'booking.add_addon_markup');
manager.addDocument('en', 'How do I apply a markup on add-ons in my booking?', 'booking.add_addon_markup');
manager.addDocument('en', 'Can you guide me on how to add markup for add-ons?', 'booking.add_addon_markup');

// 5. How to Add Add-Ons?
manager.addDocument('en', 'How to add add-ons?', 'booking.add_addons');
manager.addDocument('en', 'How can I add add-ons to my booking?', 'booking.add_addons');
manager.addDocument('en', 'What steps should I follow to include add-ons?', 'booking.add_addons');
manager.addDocument('en', 'How do I add extra options as add-ons to a tour?', 'booking.add_addons');
manager.addDocument('en', 'Can you guide me on adding add-ons to a booking?', 'booking.add_addons');

// 6. How to Change or Choose Bed Preferences?
manager.addDocument('en', 'How to change or choose bed preferences?', 'booking.bed_preferences');
manager.addDocument('en', 'How can I update bed preferences in my booking?', 'booking.bed_preferences');
manager.addDocument('en', 'What steps should I follow to select bed preferences?', 'booking.bed_preferences');
manager.addDocument('en', 'How do I change the bed type for my booking?', 'booking.bed_preferences');
manager.addDocument('en', 'Can you guide me on choosing bed preferences?', 'booking.bed_preferences');

// 7. How to Add a New Guest to An Existing Booking?
manager.addDocument('en', 'How to add a new guest to an existing booking?', 'booking.add_guest');
manager.addDocument('en', 'How do I add a new guest to my booking?', 'booking.add_guest');
manager.addDocument('en', 'What steps should I follow to include a new guest?', 'booking.add_guest');
manager.addDocument('en', 'How do I add a traveler to my current booking?', 'booking.add_guest');
manager.addDocument('en', 'Can you guide me on adding a new guest to my reservation?', 'booking.add_guest');

// 8. How to Hold Spaces?
manager.addDocument('en', 'How to hold spaces?', 'booking.hold_spaces');
manager.addDocument('en', 'How can I hold spaces for a tour?', 'booking.hold_spaces');
manager.addDocument('en', 'What steps should I follow to hold spots in a booking?', 'booking.hold_spaces');
manager.addDocument('en', 'How do I reserve spaces temporarily?', 'booking.hold_spaces');
manager.addDocument('en', 'Can you guide me on how to hold spaces without booking?', 'booking.hold_spaces');

// 9. How to Edit Guest Details in Existing Booking?
manager.addDocument('en', 'How to edit guest details in an existing booking?', 'booking.edit_guest');
manager.addDocument('en', 'How do I modify guest details in my current booking?', 'booking.edit_guest');
manager.addDocument('en', 'What steps should I follow to edit guest information?', 'booking.edit_guest');
manager.addDocument('en', 'How can I update the guest details in my reservation?', 'booking.edit_guest');
manager.addDocument('en', 'Can you guide me on changing guest information in my booking?', 'booking.edit_guest');

console.log('FAQ booking RAN');


}
module.exports = bookingModel;