const axios = require('axios');
const { removeStopwords } = require('stopword');
const { getFileData, saveFileData } = require('../database/db');

const postRequest = async (data, headers, url) => {
    return await axios({
        method: "POST",
        url,
        headers,
        data
    });
}

const getRequest = async (api) => {
    return await axios({
        method: "GET",
        url: api,
        headers: {
            'Content-Type': 'application/json',
        },
    });
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

const stopwordList = [
    'about',
    'after',
    'all',
    'also',
    'am',
    'an',
    'and',
    'another',
    'any',
    'are',
    'as',
    'at',
    'be',
    'because',
    'been',
    'before',
    'being',
    'between',
    'both',
    'but',
    'by',
    'came',
    'can',
    'come',
    'could',
    'did',
    'do',
    'each',
    'for',
    'from',
    'get',
    'got',
    'has',
    'had',
    'he',
    'have',
    'her',
    'here',
    'him',
    'himself',
    'his',
    'how',
    'if',
    'in',
    'into',
    'is',
    'it',
    'like',
    'many',
    'me',
    'might',
    'more',
    'most',
    'much',
    'must',
    'my',
    'never',
    'now',
    'of',
    'on',
    'only',
    'or',
    'other',
    'our',
    'out',
    'over',
    'said',
    'same',
    'should',
    'since',
    'some',
    'still',
    'such',
    'take',
    'than',
    'that',
    'the',
    'their',
    'them',
    'then',
    'there',
    'these',
    'they',
    'this',
    'those',
    'through',
    'to',
    'too',
    'under',
    'up',
    'very',
    'was',
    'way',
    'we',
    'well',
    'were',
    'what',
    'where',
    'which',
    'while',
    'who',
    'with',
    'would',
    'you',
    'your',
    'a',
    'i'
]

const SOCKET_EVENTS = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    CHAT: 'chat message',
    AUTO_COMPLETE: 'autocomplete',
    LAST_DATA: 'getLastData',
    FORM_SUBMIT: 'form_submit'
}

const undefinedText = "I'm sorry, I didn't understand that. Would you like to talk about it with our expert?";
const profanityText = `We aim for positive and helpful interactions.<br>
            Could you kindly ask something else related to your travel inquiries? 
            <br>I’m here to help with any travel-related questions you may have!`;

function sendResponseToClient(io, socketId, eventName, response) {
    io.to(socketId).emit(eventName, response);
}

function isValidArrayOrString(input) {
    return (Array.isArray(input) && input.length > 0) ||
        (typeof input === 'string' && input.trim().length > 0);
}

function isUndefinedNullOrFalsy(value) {
    return value === undefined || value === null || !value;
}

async function filterQueryForChat(io, socketId, query) {
    // Replace all '?' with a space
    query = query.replace(/\?/g, ' ');
    // Remove stopwords
    let filterMessage = removeStopwords(query.split(' '), stopwordList).join(' ');
    // Check for profanity, if profanity detected, proceed with normal flow
    const { Filter } = await import('bad-words');
    const filter = new Filter();
    if (filter.isProfane(filterMessage)) {
        filterMessage = false;
        sendResponseToClient(io, socketId, SOCKET_EVENTS.CHAT, profanityText);
    }
    return filterMessage;
}

async function updateContextWithEntities(agentId, entities) {
    const fileData = await getFileData(agentId);
    entities.forEach(entity => {
        // Update context with country or countrycode
        if (entity.entity === 'country') {
            fileData.context['country'] = entity.sourceText;
        }
        if (entity.entity === 'countrycode') {
            console.log(entity.sourceText, 'sourcetext');
            fileData.context['countrycode'] = entity.sourceText;
        }
    });
    await saveFileData(agentId, fileData);
    return fileData.context;
}

const socketMap = new Map();

const addSocketId = (userId, socketId) => {
    socketMap.set(userId, socketId);
};

const getSocketId = (userId) => {
    return socketMap.get(userId);
};

const removeSocketId = (userId) => {
    socketMap.delete(userId);
};

module.exports = {
    COUNTRIES,
    postRequest,
    getRequest,
    stopwordList,
    addSocketId,
    getSocketId,
    removeSocketId,
    sendResponseToClient,
    isValidArrayOrString,
    isUndefinedNullOrFalsy,
    filterQueryForChat,
    updateContextWithEntities,
    SOCKET_EVENTS,
    undefinedText,
    profanityText
};