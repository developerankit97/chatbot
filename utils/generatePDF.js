const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');

async function generatePdf() {

  const templatePath = path.join(__dirname, '..','views', 'home.ejs')
  const html = await ejs.renderFile(templatePath);

  // Launch a headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set content to the HTML file
  await page.setContent(html, { waitUntil: 'load' });

  // Generate PDF from the HTML content
  await page.pdf({
    path: 'output.pdf', // Path to save the generated PDF      // Page format
    printBackground: true, // Include background graphics
    preferCSSPageSize: true,
    headerTemplate: '<span style="font-size:10px;">Generated on: {{date}}</span>',
    footerTemplate: '<span style="font-size:10px;">Page {{pageNumber}} of {{totalPages}}</span>',
  });

  await browser.close();
  console.log('PDF generated successfully.');
}

module.exports = { generatePdf }