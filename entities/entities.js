const { createReadStream } = require('fs');
const { join } = require('path');
const { parser } = require('stream-json');
const { streamValues } = require('stream-json/streamers/StreamValues');

async function addEntities(manager) {
    await addCountryEntity(manager);
    await addPackageEntity(manager);
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

    // Add this dynamic regex pattern to the manager
    manager.addRegexEntity('country', ['en'], countryPattern);
}

async function addPackageEntity(manager) {
    const entitiesPath = join(__dirname, '..', 'entities', 'package.json');
    // Create a read stream for the JSON file
    const pipeline = createReadStream(entitiesPath)
        .pipe(parser())
        .pipe(streamValues());
    // Process each entity from the JSON file
    for await (const { value } of pipeline) {
        if (value && value.packages) {
            value.packages.forEach(package => {
                manager.addNamedEntityText('package', package.pkgName.toLowerCase(), 'en', [package.pkgName.toLowerCase()]);
            });
        }
    }
}

module.exports = addEntities