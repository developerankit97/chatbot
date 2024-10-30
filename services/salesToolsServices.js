const axios = require('axios');
const { COUNTRIES, getRequest, postRequest, sendResponseToClient, SOCKET_EVENTS } = require('./../utils/helpers');
const puppeteer = require('puppeteer')
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

async function generateWithPuppeteer(agentid, date, pkgid) {
    try {
        const data = {
            agentIds: agentid,
            sess: date,
            packg_name: '',
            agentEmail: '',
            contact: '',
            pkgID: pkgid,
            pdf_filename: 'abcd.pdf',
            agentEmail: '',
            agentCompanyName: '',
            mainurl: `${process.env.api}/Holidays/`,
            mainurl2: `${process.env.api}/Account/`
        }
        const newHTML = await new Promise((res, rej) => {
            ejs.renderFile(path.resolve('itinerary.ejs'), data, (err, data) => {
                if (err) {
                    console.error('Error rendering template:', err);
                    rej()
                } else {
                    console.log('Rendered HTML with dynamic JavaScript:\n');
                    res(data)
                }
            })
        })

        return await generatePdf(newHTML, agentid);

    } catch (error) {
        console.log(error);
    }
}

async function generatePdf(htmlContent, agentid) {
    try {
        const filename = `${agentid}.pdf`;
        // Launch a headless browser
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(60000);
        page.setDefaultTimeout(60000);
        // Set content to the HTML file
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Generate PDF from the HTML content
        console.log(path.join(__dirname, filename), "PATH FOR FILE");

        await page.pdf({
            path: `${path.join(__dirname, filename)}`,
            printBackground: true, //Include graphics
            preferCSSPageSize: true,
            headerTemplate: '<span style="font-size:10px;">Generated on: {{date}}</span>',
            footerTemplate: '<span style="font-size:10px;">Page {{pageNumber}} of {{totalPages}}</span>',
        });
        await browser.close();
        console.log('PDF generated successfully.');
        return filename;

    } catch (error) {
        console.log(error);
    }
}

async function sendAndDeleteFile(req, res) {
    try {
        const filePath = path.join(__dirname, req.query.filename); // Path to the file
        if (req.query.filename == 'undefined') return res.status(404).json('File not exist');
        res.download(filePath, 'itinerary.pdf', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Error downloading file');
            }
            else {
                setTimeout(() => {
                    unlinkFile(filePath, 1)
                }, 3 * 60 * 1000);
            }
        });

    } catch (error) {
        console.log(error);
    }
}

async function unlinkFile(filePath, no) {
    try {
        if (no > 3) return;
        fs.unlink(filePath, (err) => {
            if (err) {
                unlinkFile(filePath, no + 1);
            }
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    generateWithPuppeteer,
    generatePdf,
    sendAndDeleteFile,
    unlinkFile
}