const path = require('path');
const fs = require('fs');
const { getExistingBookings } = require('../../services/services');

module.exports = async function (manager) {
    manager.addDocument('en', 'existing bookings', 'current.bookings');
    manager.addDocument('en', 'current bookings', 'current.bookings');
    manager.addDocument('en', 'upcoming bookings', 'current.bookings');
    manager.addDocument('en', 'upcoming tours', 'current.bookings');
    manager.addDocument('en', 'my booking', 'current.bookings');
    manager.addDocument('en', 'my trips', 'current.bookings');

    manager.addAnswer('en', 'current.bookings', async (agentId, context, query, entities, io, socketId) => {
        const existingBookings = await getExistingBookings(agentId);
        
    })

    manager.addDocument('en', 'edit booking %pkgid% %tourdate%', 'edit.booking');
    manager.addAnswer('en', 'edit.booking', async function (agentId, context, query, entities, io) {

    });


    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'existingBookingModel.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);
}