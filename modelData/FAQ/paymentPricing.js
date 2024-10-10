const axios = require('axios');
const path = require('path');
const fs = require('fs');

async function payment_pricing_model(manager) {

    // 1. How to edit paid amount in existing booking?
    manager.addDocument('en', 'How to edit paid amount in existing booking?', 'payment.edit_amount');
    manager.addDocument('en', 'Can I modify the amount I paid for my booking?', 'payment.edit_amount');
    manager.addDocument('en', 'I need to change the paid amount in my booking', 'payment.edit_amount');
    manager.addDocument('en', 'How can I update the payment amount for my reservation?', 'payment.edit_amount');

    // 2. Mistakes to avoid while making payment
    manager.addDocument('en', 'Mistakes to avoid while making payment', 'payment.mistakes_to_avoid');
    manager.addDocument('en', 'What errors should I avoid during payment?', 'payment.mistakes_to_avoid');
    manager.addDocument('en', 'What are the common mistakes made while paying?', 'payment.mistakes_to_avoid');
    manager.addDocument('en', 'What should I not do when making a payment?', 'payment.mistakes_to_avoid');

    // 3. How to share a payment link with guests?
    manager.addDocument('en', 'How to share a payment link with guests?', 'payment.share_link');
    manager.addDocument('en', 'How can I send a payment link to my guests?', 'payment.share_link');
    manager.addDocument('en', 'I need to provide my guests with a payment link, how can I do that?', 'payment.share_link');
    manager.addDocument('en', 'How do I give a payment link to guests?', 'payment.share_link');

    // 4. How to make payment through Quick Pay for new guests in the existing booking?
    manager.addDocument('en', 'How to make payment through Quick Pay for new guests?', 'payment.quickpay_new_guest');
    manager.addDocument('en', 'How can I use Quick Pay for new guests in an existing booking?', 'payment.quickpay_new_guest');
    manager.addDocument('en', 'Can I pay with Quick Pay for a new guest in my current booking?', 'payment.quickpay_new_guest');
    manager.addDocument('en', 'How do I complete payment with Quick Pay for new guests?', 'payment.quickpay_new_guest');

    // 5. How to make payment through Quick Pay for existing guests?
    manager.addDocument('en', 'How to make payment through Quick Pay for existing guests?', 'payment.quickpay_existing_guest');
    manager.addDocument('en', 'I want to pay with Quick Pay for an existing guest, how do I do that?', 'payment.quickpay_existing_guest');
    manager.addDocument('en', 'How can I use Quick Pay for a returning guest in the booking?', 'payment.quickpay_existing_guest');
    manager.addDocument('en', 'What steps should I follow to pay with Quick Pay for existing guests?', 'payment.quickpay_existing_guest');

    // 6. How to download the payment receipt?
    manager.addDocument('en', 'How to download the payment receipt?', 'payment.download_receipt');
    manager.addDocument('en', 'How can I get a copy of the payment receipt?', 'payment.download_receipt');
    manager.addDocument('en', 'Where can I download my payment receipt?', 'payment.download_receipt');
    manager.addDocument('en', 'I need to download the receipt for my payment, how do I do it?', 'payment.download_receipt');

    // 7. How to make payment for guests in an existing booking?
    manager.addDocument('en', 'How to make payment for guests in an existing booking?', 'payment.make_payment_existing_booking');
    manager.addDocument('en', 'How do I make a payment for the guests in my current booking?', 'payment.make_payment_existing_booking');
    manager.addDocument('en', 'Can I pay for guests in the booking I already have?', 'payment.make_payment_existing_booking');
    manager.addDocument('en', 'How can I complete payment for guests in the existing reservation?', 'payment.make_payment_existing_booking');

    // 8. How can your guest make payment with a shared link?
    manager.addDocument('en', 'How your guest can make payment with a shared link?', 'payment.guest_shared_link');
    manager.addDocument('en', 'How do my guests pay using the shared payment link?', 'payment.guest_shared_link');
    manager.addDocument('en', 'What steps should my guests follow to use the shared payment link?', 'payment.guest_shared_link');
    manager.addDocument('en', 'How can guests make a payment through the link I shared?', 'payment.guest_shared_link');

    // 9. How to check if payment has been received for a booking?
    manager.addDocument('en', 'How to check if payment has been received?', 'payment.check_received');
    manager.addDocument('en', 'How do I verify if the payment was successfully received?', 'payment.check_received');
    manager.addDocument('en', 'Can I check if my payment was completed?', 'payment.check_received');
    manager.addDocument('en', 'How can I confirm that the payment for my booking has gone through?', 'payment.check_received');

    // 10. What should I do if my payment fails?
    manager.addDocument('en', 'What should I do if my payment fails?', 'payment.failure_handling');
    manager.addDocument('en', 'How to fix a failed payment?', 'payment.failure_handling');
    manager.addDocument('en', 'What should I do if my payment does not go through?', 'payment.failure_handling');
    manager.addDocument('en', 'Can I retry the payment after it failed?', 'payment.failure_handling');

    // 11. How to refund a guest for a payment made?
    manager.addDocument('en', 'How to refund a guest for a payment made?', 'payment.refund');
    manager.addDocument('en', 'What steps should I follow to refund a guest?', 'payment.refund');
    manager.addDocument('en', 'How do I issue a refund for a guest who made a payment?', 'payment.refund');
    manager.addDocument('en', 'Can I refund a guest after they have paid?', 'payment.refund');

    // <<-- Answers

    // 1. How to edit paid amount in existing booking?
    manager.addAnswer('en', 'payment.edit_amount', 'Video https://youtu.be/rlr_oEJw87I')



    // 3. How to share a payment link with guests?
    manager.addAnswer('en', 'payment.share_link', 'Video https://youtu.be/8xVEivYrmpk');

    // 4. How to make payment through Quick Pay for new guests in the existing booking?
    manager.addAnswer('en', 'payment.quickpay_new_guest', 'Video https://youtu.be/moVXvjcOSTA');

    // 5. How to make payment through Quick Pay for existing guests?
    manager.addAnswer('en', 'payment.quickpay_existing_guest', 'Video https://youtu.be/moVXvjcOSTA');


    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'paymentModel.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);

}

module.exports = payment_pricing_model;