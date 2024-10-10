// 'bookings_reservations': {
//     text: "Manage your bookings effortlessly! Select an option below to create, check, or update your bookings",
//         data: [
//             ["How to Book Tour Packages?", "how_book"],
//             ["How to Add Your Markup?", "how_add_markup"],
//             ["How to Update Your Markup?", "how_update_markup"],
//             ["How to Add Add- Ons Markup?", "how_addons_markup"],
//             ["How To Add Add- Ons ?", "how_addons"],
//             ["How To Change or Choose Bed Preferences?", "how_bed_preference"],
//             ["How To Add a New Guest to An Existing Booking?", "how_add_guest"],
//             ["How To Hold Spaces?", "how_hold_spaces"],
//             ["How To Edit Guest Details in Existing Booking ?", "how_edit_guest_details"],
//         ]
// },
// 'tours': {
//     text: "Discover our exciting tours! Check out our latest arrivals, best sellers, and exclusive offers below.",
//         data: [['Latest & Greatest', 'latest_greatest'], ['New Arrivals', 'new_arrivals'], ['Top Selling Tours', 'top_selling']]
// },
// 'rewards_benefits': {
//     text: "Elevate your travel packages with ease! Create stunning flyers and detailed itineraries that captivate your clients and ensure every trip is perfectly planned. Ready to craft something amazing?",
//         data: [
//             ["How To Claim Your Commission?", "create_itinerary"],
//             ["How To Create Your Own Flyer?", "create_flyer"]
//             ["How To Create Your Own Website?", "create_flyer"]
//             ["How to Create Your Own Flyer for a New Tour?", "create_flyer"]
//         ]
// },
// 'payment_options': {
//     text: "Choose a convenient payment method to complete your transaction. Select from the options below to proceed",
//         data: [["Quick pay", "quick_pay"], ["Taza Pay", "taza_pay"], ["Direct Transfer", "direct_transfer"]]
// },
// 'issues': {
//     text: "Facing a problem? Let us help! Choose the type of issue you're dealing with to get started",
//         data: [["Boooking Related issue -", "booking_issue"], ["Payment issue -", "payment_issue"]]
// },
// 'Feedback': {
//     text: "We value your feedback! Share your thoughts or report an issue, and help us improve your experience",
//         data: []
// },
// 'others': {
//     text: "Explore more options! Choose from the following to learn about commissions, website creation, markup, and more",
//         data: [['How to check comission?', 'check_comission'], ['How to create website?', 'create_website'], ['How to hold space?', 'hold_space'], ['How to add Markup?', 'add_markup'], ['See more', 'see_more']]
// },


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5

// const axios = require('axios');
// const path = require('path');
// const fs = require('fs');

// async function bookingModel(manager) {
//     // 1. How to Book Tour Packages?
//     manager.addDocument('en', 'How to book tour packages?', 'booking.book_package');
//     manager.addDocument('en', 'How do I book a tour package?', 'booking.book_package');
//     manager.addDocument('en', 'Can you guide me on booking a tour package?', 'booking.book_package');
//     manager.addDocument('en', 'How do I reserve a tour package?', 'booking.book_package');
//     manager.addDocument('en', 'What steps should I follow to book a tour?', 'booking.book_package');

//     // 2. How to Add Your Markup?
//     manager.addDocument('en', 'How to add your markup?', 'booking.add_markup');
//     manager.addDocument('en', 'How do I add my markup to the booking?', 'booking.add_markup');
//     manager.addDocument('en', 'What steps to include a markup on my booking?', 'booking.add_markup');
//     manager.addDocument('en', 'How can I apply a markup to my booking?', 'booking.add_markup');
//     manager.addDocument('en', 'Can you guide me on how to add a markup?', 'booking.add_markup');

//     // 3. How to Update Your Markup?
//     manager.addDocument('en', 'How to update your markup?', 'booking.update_markup');
//     manager.addDocument('en', 'How can I update my markup for a booking?', 'booking.update_markup');
//     manager.addDocument('en', 'What steps do I take to change the markup?', 'booking.update_markup');
//     manager.addDocument('en', 'How do I modify the markup I added?', 'booking.update_markup');
//     manager.addDocument('en', 'Can you guide me on updating my markup?', 'booking.update_markup');

//     // 4. How to Add Add-Ons Markup?
//     manager.addDocument('en', 'How to add add-ons markup?', 'booking.add_addon_markup');
//     manager.addDocument('en', 'How do I add a markup for the add-ons?', 'booking.add_addon_markup');
//     manager.addDocument('en', 'What steps should I follow to include a markup for add-ons?', 'booking.add_addon_markup');
//     manager.addDocument('en', 'How do I apply a markup on add-ons in my booking?', 'booking.add_addon_markup');
//     manager.addDocument('en', 'Can you guide me on how to add markup for add-ons?', 'booking.add_addon_markup');

//     // 5. How to Add Add-Ons?
//     manager.addDocument('en', 'How to add add-ons?', 'booking.add_addons');
//     manager.addDocument('en', 'How can I add add-ons to my booking?', 'booking.add_addons');
//     manager.addDocument('en', 'What steps should I follow to include add-ons?', 'booking.add_addons');
//     manager.addDocument('en', 'How do I add extra options as add-ons to a tour?', 'booking.add_addons');
//     manager.addDocument('en', 'Can you guide me on adding add-ons to a booking?', 'booking.add_addons');

//     // 6. How to Change or Choose Bed Preferences?
//     manager.addDocument('en', 'How to change or choose bed preferences?', 'booking.bed_preferences');
//     manager.addDocument('en', 'How can I update bed preferences in my booking?', 'booking.bed_preferences');
//     manager.addDocument('en', 'What steps should I follow to select bed preferences?', 'booking.bed_preferences');
//     manager.addDocument('en', 'How do I change the bed type for my booking?', 'booking.bed_preferences');
//     manager.addDocument('en', 'Can you guide me on choosing bed preferences?', 'booking.bed_preferences');

//     // 7. How to Add a New Guest to An Existing Booking?
//     manager.addDocument('en', 'How to add a new guest to an existing booking?', 'booking.add_guest');
//     manager.addDocument('en', 'How do I add a new guest to my booking?', 'booking.add_guest');
//     manager.addDocument('en', 'What steps should I follow to include a new guest?', 'booking.add_guest');
//     manager.addDocument('en', 'How do I add a traveler to my current booking?', 'booking.add_guest');
//     manager.addDocument('en', 'Can you guide me on adding a new guest to my reservation?', 'booking.add_guest');

//     // 8. How to Hold Spaces?
//     manager.addDocument('en', 'How to hold spaces?', 'booking.hold_spaces');
//     manager.addDocument('en', 'How can I hold spaces for a tour?', 'booking.hold_spaces');
//     manager.addDocument('en', 'What steps should I follow to hold spots in a booking?', 'booking.hold_spaces');
//     manager.addDocument('en', 'How do I reserve spaces temporarily?', 'booking.hold_spaces');
//     manager.addDocument('en', 'Can you guide me on how to hold spaces without booking?', 'booking.hold_spaces');

//     // 9. How to Edit Guest Details in Existing Booking?
//     manager.addDocument('en', 'How to edit guest details in an existing booking?', 'booking.edit_guest');
//     manager.addDocument('en', 'How do I modify guest details in my current booking?', 'booking.edit_guest');
//     manager.addDocument('en', 'What steps should I follow to edit guest information?', 'booking.edit_guest');
//     manager.addDocument('en', 'How can I update the guest details in my reservation?', 'booking.edit_guest');
//     manager.addDocument('en', 'Can you guide me on changing guest information in my booking?', 'booking.edit_guest');

//     await manager.train();
//     // Define the model path
//     const modelPath = path.join(__dirname, '..', '..', 'models', 'bookingReservationModel.nlp');

//     // Ensure the directory exists
//     fs.mkdirSync(path.dirname(modelPath), { recursive: true });

//     // Save the model
//     await manager.save(modelPath);
// }
// module.exports = bookingModel;









// manager.addDocument('en', 'flyer DU', 'flyer.package');
// manager.addDocument('en', 'flyer IO', 'flyer.package');
// manager.addDocument('en', 'flyer EG', 'flyer.package');
// manager.addDocument('en', 'flyer IND', 'flyer.package');
// manager.addDocument('en', 'flyer GR', 'flyer.package');
// manager.addDocument('en', 'flyer KE', 'flyer.package');
// manager.addDocument('en', 'flyer SO', 'flyer.package');
// manager.addDocument('en', 'flyer MA', 'flyer.package');
// manager.addDocument('en', 'flyer ML', 'flyer.package');
// manager.addDocument('en', 'flyer IS', 'flyer.package');
// manager.addDocument('en', 'flyer MO', 'flyer.package');
// manager.addDocument('en', 'flyer SI', 'flyer.package');
// manager.addDocument('en', 'flyer SP', 'flyer.package');
// manager.addDocument('en', 'flyer SR', 'flyer.package');
// manager.addDocument('en', 'flyer TH', 'flyer.package');
// manager.addDocument('en', 'flyer TU', 'flyer.package');
// manager.addDocument('en', 'flyer VI', 'flyer.package');
// manager.addDocument('en', 'flyer JP', 'flyer.package');
// manager.addDocument('en', 'flyer IT', 'flyer.package');
// manager.addDocument('en', 'flyer FR', 'flyer.package');
// manager.addDocument('en', 'flyer POT', 'flyer.package');
// manager.addDocument('en', 'flyer JO', 'flyer.package');
// manager.addDocument('en', 'flyer GHA', 'flyer.package');
// manager.addDocument('en', 'flyer NEP', 'flyer.package');
// manager.addDocument('en', 'flyer PHL', 'flyer.package');
// manager.addDocument('en', 'flyer IO', 'flyer.package');
// manager.addDocument('en', 'flyer AST', 'flyer.package');
// manager.addDocument('en', 'flyer Croatia', 'flyer.package');
// manager.addDocument('en', 'flyer AUS', 'flyer.package');
// manager.addDocument('en', 'flyer NZD', 'flyer.package');
// manager.addDocument('en', 'flyer ENG', 'flyer.package');
// manager.addDocument('en', 'flyer MR', 'flyer.package');
// manager.addDocument('en', 'flyer FP', 'flyer.package');
// manager.addDocument('en', 'flyer TZ', 'flyer.package');
// manager.addDocument('en', 'flyer ICE', 'flyer.package');
// manager.addDocument('en', 'flyer ZWE', 'flyer.package');
// manager.addDocument('en', 'flyer IR', 'flyer.package');
// manager.addDocument('en', 'SWZ', 'flyer.package');
// manager.addDocument('en', 'flyer Sene', 'flyer.package');
// manager.addDocument('en', 'flyer Togo', 'flyer.package');
// manager.addDocument('en', 'flyer Ben', 'flyer.package');


// manager.addDocument('en', 'Help me create flyer', 'flyer.create');
// manager.addDocument('en', 'Design flyer', 'flyer.create');
// manager.addDocument('en', 'Generate flyer', 'flyer.create');
// manager.addDocument('en', 'Make flyer', 'flyer.create');
// manager.addDocument('en', 'Build flyer', 'flyer.create');
// manager.addDocument('en', 'Produce flyer', 'flyer.create');
// manager.addDocument('en', 'Prepare flyer', 'flyer.create');
// manager.addDocument('en', 'Customize flyer', 'flyer.create');
// manager.addDocument('en', 'Craft flyer', 'flyer.create');
// manager.addDocument('en', 'Set up flyer', 'flyer.create');
// manager.addDocument('en', 'Develop flyer', 'flyer.create');
// manager.addDocument('en', 'Create custom flyer', 'flyer.create');
// manager.addDocument('en', 'Design my flyer', 'flyer.create');
// manager.addDocument('en', 'Start flyer creation', 'flyer.create');
// manager.addDocument('en', 'Flyer creation process', 'flyer.create');
// manager.addDocument('en', 'Build custom flyer', 'flyer.create');
// manager.addDocument('en', 'Generate marketing flyer', 'flyer.create');
// manager.addDocument('en', 'Flyer builder', 'flyer.create');
// manager.addDocument('en', 'Flyer generator', 'flyer.create');
// manager.addDocument('en', 'Make custom flyer', 'flyer.create');
// manager.addDocument('en', 'Create promotional flyer', 'flyer.create');
// manager.addDocument('en', 'Design new flyer', 'flyer.create');
// manager.addDocument('en', 'Create my flyer now', 'flyer.create');
// manager.addDocument('en', 'Create your flyer', 'flyer.create');
// manager.addDocument('en', 'Start making flyer', 'flyer.create');
// manager.addDocument('en', 'Start flyer generator', 'flyer.create');
// manager.addDocument('en', 'Produce marketing flyer', 'flyer.create');
// manager.addDocument('en', 'Generate custom flyer', 'flyer.create');
// manager.addDocument('en', 'Start designing flyer', 'flyer.create');
// manager.addDocument('en', 'Generate flyer template', 'flyer.create');
// manager.addDocument('en', 'Create flyer template', 'flyer.create');
// manager.addDocument('en', 'want flyer', 'flyer.create');
// manager.addDocument('en', 'need flyer', 'flyer.create');