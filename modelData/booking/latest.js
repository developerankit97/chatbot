const path = require('path');
const fs = require('fs');
const { getRequest } = require('../../utils/helpers');

module.exports = async (manager) => {
    // Queries about what is a flyer
    manager.addDocument('en', 'offers', 'latest.greatest');
    manager.addDocument('en', 'latest', 'latest.greatest');
    manager.addDocument('en', 'latest & greatest', 'latest.greatest');

    // Responses for what a flyer is
    manager.addAnswer('en', 'latest.greatest', async (agentId, context, query, entities, io) => {
        try {
            const { data } = await getRequest(`${process.env.api}/Holidays/NewOfferPage?offerName=isoffer`);

            // Check if there are any filtered packages
            if (data.length === 0 || !Array.isArray(data)) {
                return '☹️No any Latest Offer Available';
            }
            let cards = ``;
            let cardsCount = 0;
            data.forEach((pkg) => {
                // car += `<option value="newbooking packageselect ${package.pkG_ID} ${countrycode}">${package.pkG_TITLE}</option>`; // Adjust property names as needed
                cardsCount++;
                cards += `<div class="card" data-card-info="" onclick="handleCardClick(this)">
        <div class="card-image" style="background-image: url('https://cms.tripoculture.com/../Content/packagegalleryImage/${pkg.pkgID}.jpg')">
            <div class="card-shadow">
                <span class="duration">Limited Time Deal</span>
                <span class="offer">${pkg.offerDescription.split(' ')[1]}</span>
                <div class="card-content">
                    <h3 class="card-title">${pkg.offeF_NAME}</h3>
                    <p class="card-text">Price</p>
                    <p class="card-price">$${pkg.pkG_OFFERPRICE.split('.')[0]}</p>
                </div>
            </div>
        </div>
    </div>`;
            });

            return cardsCount == 0 ? ['No Tours Available'] : [`<b style="color:red;">Deal Ends On ${data[0].validto} at 11:59 PM</b>`, `<span class="carousel">
        <div class="carousel-container">
            ${cards}
        </div>
        ${cardsCount == 1 ? '' : '<button class="carousel-prev" onclick="moveCarousel(event)">❮</button>'}
        ${cardsCount == 1 ? '' : '<button class="carousel-next" onclick="moveCarousel(event)">❯</button>'}
    </span>`]
        } catch (error) {
            console.log("Latest and Greatest Error", error);
        }

    })


    await manager.train();
    // Define the model path
    const modelPath = path.join(__dirname, '..', '..', 'models', 'latest.nlp');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(modelPath), { recursive: true });

    // Save the model
    await manager.save(modelPath);
}