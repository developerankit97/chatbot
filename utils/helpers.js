const services = require("./services");

const context = {}

const INTENTS = {
    'flyer.selected.country': 'flyer.selected.country',
    'flyer.select.country': services.getCountries
}

const ENTITIES = {
    'destination': services.getPackages,
    'package': true,
    'flyer_size': true,
    'flyer_color': true,
    'flyer_type': true,
    'flyer_text_color': true,
}

const COUNTRIES = {
    dubai: 'DU',
    bali: 'IO',
    egypt: 'EG',
    india: 'IND',
    greece: 'GR',
    kenya: 'KE',
    'south africa': 'SO',
    malaysia: 'MA',
    maldives: 'ML',
    israel: 'IS',
    morocco: 'MO',
    singapore: 'SI',
    spain: 'SP',
    'sri lanka': 'SR',
    thailand: 'TH',
    turkey: 'TU',
    vietnam: 'VI',
    japan: 'JP',
    italy: 'IT',
    france: 'FR',
    portugal: 'POT',
    jordan: 'JO',
    ghana: 'GHA',
    nepal: 'NEP',
    philippines: 'PHL',
    indonesia: 'IO',
    austria: 'AST',
    croatia: 'Croatia',
    australia: 'AUS',
    'new zealand': 'NZD',
    england: 'ENG',
    mauritius: 'MR',
    'french polynesia': 'FP',
    tanzania: 'TZ',
    iceland: 'ICE',
    zimbabwe: 'ZWE',
    ireland: 'IR',
    switzerland: 'SWZ',
    senegal: 'Sene',
    togo: 'Togo',
    benin: 'Ben'
}

module.exports = { INTENTS, ENTITIES, COUNTRIES, context };