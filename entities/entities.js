const { createReadStream } = require('fs');
const { join } = require('path');
const { parser } = require('stream-json');
const { streamValues } = require('stream-json/streamers/StreamValues');
const { COUNTRIES, stopwordList } = require('../utils/helpers');
const { removeStopwords } = require('stopword');

async function addEntities(manager) {
    await addCountryEntity(manager);
    await addPackageListEntity(manager);
    await addPackageEntity(manager);
    await addFlyerEntity(manager);
    await addItineraryEntity(manager);
    await addBookingEntity(manager);
    await addPackageEntity(manager);
    await addCreateEntity(manager);
    await addToolsEntity(manager);
    await addInfoWords(manager);
}

async function addCountryEntity(manager) {
    const entitiesPath = join(__dirname, '..', 'entities', 'countries.json');

    let countries = [];

    // Create a read stream for the JSON file
    const pipeline = createReadStream(entitiesPath)
        .pipe(parser())
        .pipe(streamValues());

    for await (const { value } of pipeline) {
        if (value && value.countries) {
            countries = value.countries.map(country => country.name);  // Collect all country names
        }
    }

    // Create a regex pattern dynamically from the country names
    const countryPattern = new RegExp(`\\b(${countries.join('|')})\\b`, 'i');

    const countryCodePattern = new RegExp(`\\b(${Object.values(COUNTRIES).join('|')})\\b`, 'i');

    // Add this dynamic regex pattern to the manager
    manager.addRegexEntity('country', ['en'], countryPattern);

    // Add this dynamic regex pattern to the manager
    manager.addRegexEntity('countrycode', ['en'], countryCodePattern);
}

async function addPackageListEntity(manager) {
    const entitiesPath = join(__dirname, '..', 'entities', 'package.json');
    // Create a read stream for the JSON file
    const pipeline = createReadStream(entitiesPath)
        .pipe(parser())
        .pipe(streamValues());
    let packages = [];
    // Process each entity from the JSON file
    for await (const { value } of pipeline) {
        if (value && value.packages) {
            value.packages.forEach(package => {
                packages.push(package.pkgName);
                const filterPackageName = removeStopwords(package.pkgName.split(' '), stopwordList).join(' ');
                manager.addNamedEntityText('packageslist', filterPackageName.toLowerCase(), 'en', [filterPackageName.toLowerCase()]);
            });
        }
    }
}

async function addFlyerEntity(manager) {
    // List of variations for 'flyer'
    const flyerVariations = ['flyer', 'flyers', 'brochure', 'leaflet'];
    // Add named entity for 'flyer' with variations
    manager.addNamedEntityText('flyer', 'flyer', 'en', flyerVariations);
}

async function addItineraryEntity(manager) {
    // Variations for 'itinerary'
    const itineraryVariations = ['itinerary', 'itineraries', 'travel plan', 'schedule'];

    // Add named entity for 'itinerary' with variations
    manager.addNamedEntityText('itinerary', 'itinerary', 'en', itineraryVariations);
}

async function addBookingEntity(manager) {
    // Variations for 'booking'
    const bookingVariations = ['booking', 'bookings', 'reservation', 'confirmed'];
    manager.addNamedEntityText('booking', 'booking', 'en', bookingVariations);
}

async function addPackageEntity(manager) {
    const packageVariations = ['package', 'tour', 'travel', 'holiday', 'deal', 'tour', 'trip'];
    manager.addNamedEntityText('package', 'package', 'en', packageVariations);
}

async function addCreateEntity(manager) {
    // Variations for 'create operations'
    const createVariations = ['new', 'create', 'book', 'reserve', 'need', 'generate', 'start', 'build', 'produce', 'generate', 'design', 'prepare', 'craft', 'make'];
    manager.addNamedEntityText('create', 'create', 'en', createVariations);
}

async function addToolsEntity(manager) {

    // Add greeting entity with variations
    manager.addNamedEntityText('greeting', 'greeting', 'en', [
        'hello',
        'hi',
        'hey',
        'good morning',
        'good afternoon',
        'good evening',
        'what’s up',
        'whatsup',
        'howdy',
        'greetings',
    ]);

    // Farewell greetings
    manager.addNamedEntityText('farewell', 'farewell', 'en', [
        'goodbye',
        'bye',
        'see you',
        'take care',
        'farewell',
    ]);
}

async function addInfoWords(manager) {
    const infoWords = [
        "describe",
        "clarify",
        "about",
        "detail",
        "summarize",
        "explain",
        "illustrate",
        "Define",
        "specify",
    ];

    manager.addNamedEntityText('info', 'info', 'en', infoWords);
}

module.exports = addEntities