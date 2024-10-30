const axios = require('axios');
const { COUNTRIES, getRequest, postRequest, sendResponseToClient, SOCKET_EVENTS } = require('./../utils/helpers');
const puppeteer = require('puppeteer')
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

async function getAgentDetails(agentId = process.env.dummy_agentId) {
    const response = await getRequest(`https://apidev.cultureholidays.com/api/Account/GetAgencyProfileDetails?AgentID=${agentId}`)
    return response.data;
}

async function updateAgentDetails(agentId = process.env.dummy_agentId) {
    const response = await postRequest(data, `https://apidev.cultureholidays.com/api/Account/UpdateAgencyProfileDetails`);
    return response.data;
}

async function changeAgentPassword(data) {
    const response = await postRequest(data, `https://apidev.cultureholidays.com/api/Account/AgencyChangePassword`);
    return response.data;
}