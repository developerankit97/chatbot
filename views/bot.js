let socket = io("http://127.0.0.1:3000/", { autoConnect: false });

const base_url = "http://127.0.0.1:3000/";
const parentUrl = "https://staging.cultureholidays.com/";
const parentDummyUrl = "http://127.0.0.1:5500/"

window.parent.postMessage("id", parentDummyUrl);
window.addEventListener('message', (event) => {
    localStorage.setItem('token', event.data);
    socket.io.opts.extraHeaders = {
        "agentid": localStorage.getItem('token')
    };
    socket.connect();
})

let typing = false;
let freeQuoteSubmitClicked = false;
let addTravelerSubmitClicked = false;
const loadingContainer = document.getElementById('loading-container');
const chatContainer = document.getElementById('chat-container');

const chatBody = document.querySelector('.chat-body');

const footerMenuToggle = document.getElementById('footer_menu-toggle');
const footerMenuContainer = document.querySelector('.footer_menu-container');
const footerMenuButtons = document.querySelectorAll('.footer_menu-options');
const footerMenuImage = document.querySelector('.footer_menu-image');

let userChatInput = document.getElementById('chat-input');

let autoCompleteContainer = document.getElementById('autocomplete-container');
let autoCompleteList = document.querySelector('.autocomplete-container_list');

socket.on('disconnect', () => {
    loadingContainer.classList.remove('hide');
});

socket.on('autocomplete', (result) => {
    if (result.length == 0) {
        autoCompleteList.innerHTML = '';
        autoCompleteContainer.classList.add('hide');
    } else {
        if (result.length < 7) {

            result = result.slice(0, result.length);
        } else {
            result = result.slice(0, 7);
        }
        autoCompleteContainer.classList.remove('hide');
        autoCompleteList.innerHTML = '';
        result.forEach(value => {
            autoCompleteList.innerHTML += `<li data-id="${value}" class="autocomplete-container_list-item">${value}</li>`;
        })
    }
});

socket.on('getLastData', async (history) => {
    window.parent.postMessage("size", parentDummyUrl);
    loadingContainer.classList.add('hide');
    chatContainer.classList.remove('hide');
    if (history.length == 0) {
        const existingMessages = chatBody.querySelectorAll('.message.bot');
        !existingMessages[0]?.innerHTML.length > 0 && startMessage();
    } else {
        const existingMessages = chatBody.querySelectorAll('.message.user .text');
        let messageExists = false;

        existingMessages.forEach((msg) => {
            if (msg.innerText.length > 0) {
                messageExists = true;
            }
        });
        if (!messageExists) {
            for await (const entry of history) {
                const key = Object.keys(entry)[0];
                const value = entry[key];
                chatBody.insertAdjacentHTML('beforeend', `<div class="message user">
                        <span class="text">${key}</span>
                    </div>`);
                if (Array.isArray(value)) {
                    for (let index = 0; index < value.length; index++) {
                        const newValue = typeof value[index] !== 'object' ? value[index].replace("\\", "") : "";
                        if (!newValue.startsWith(`<span`)) {
                            chatBody.insertAdjacentHTML('beforeend', `<div class="message bot">
                                                            <span class="text">${newValue}</span>
                                                        </div>`);
                        } else {
                            chatBody.insertAdjacentHTML('beforeend', `<div class="message bot">
                                                ${newValue}
                                            </div>`);
                        }
                    }
                }
            }
            scrollHeightToBottom();
        }
    }
});

socket.on('chat message', async (msg) => {
    stopTyping();
    await appendMessage('bot', msg);
});

function refreshChatHandler() {
    if (typing == false) {
        typing = true;
        chatBody.innerHTML = '';
        startMessage();
    }
}

function chatTextInputHandler(chatTextInput) {
    if (chatTextInput.inputType !== 'insertLineBreak') {
        sendMsgToServer('autocomplete', chatTextInput.value);
    }
    chatTextInput.style.height = 'auto'; // Reset height to calculate new height
    chatTextInput.style.height = chatTextInput.scrollHeight + 'px'; // Adjust height to fit content

    // Restrict the height to 2 rows (you can change the line-height to match your styling)
    const maxHeight = parseFloat(getComputedStyle(chatTextInput).lineHeight) * 2;
    if (chatTextInput.scrollHeight > maxHeight) {
        chatTextInput.style.height = maxHeight + 'px';
        chatTextInput.style.overflowY = 'auto'; // Show scrollbar if content exceeds two rows
    } else {
        chatTextInput.style.overflowY = 'hidden'; // Hide scrollbar for one or two rows
    }
}

function chatEnterHandler(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        userChatInput.style.height = 'auto';
        sendMessage(event);
    }
}

function sendChatHandler(event) {
    sendMessage(event);
}

function sendMessage(event) {
    autoCompleteContainer.classList.add('hide');
    const userValue = event.target.value || userChatInput.value;
    if (userValue !== '') {
        appendMessage('user', [userValue]);
        sendMsgToServer('chat message', userValue);
        userChatInput.value = '';
    }
}

document.addEventListener('click', function (event) {
    if (!footerMenuToggle.contains(event.target) && !footerMenuContainer.classList.contains('hide')) {
        footerMenuContainer.classList.add('hide');
        footerMenuImage.src = 'menu.png';

    }
    const selectContainers = document.querySelectorAll('.select');
    const isClickInsideSelect = Array.from(selectContainers).some(container => container.contains(event.target));

    if (!isClickInsideSelect) {
        document.querySelectorAll('.select-list').forEach(list => {
            list.classList.add('hide');
        });
    }

    if (event.target.classList.contains("free-quote-submit")) {
        document.querySelector('.free-quote-submit').addEventListener('click', function () {
            freeQuoteSubmitClicked = true;
        });
    }

    if (event.target.classList.contains("traveler-form-submitBtn")) {
        document.querySelector('.traveler-form-submitBtn').addEventListener('click', function () {
            addTravelerSubmitClicked = true;
        });
    }
})

function feedbackFormHandler(event) {
    event.preventDefault();
    console.log('working', event);
    const name = document.getElementById('feedback-name');
    const email = document.getElementById('feedback-email');
    const message = document.getElementById('feedback-textarea');

    if (name.value && email.value && message.value) {
        const submitButton = event.submitter;
        // Send data to the server
        sendMsgToServer('form_submit', { name: name, email: email, messageInput: message });
        // Clear the form fields
        name.value = "";
        email.value = "";
        message.value = "";
        name.disabled = true;
        email.disabled = true;
        message.disabled = true;
        // Update button text and disable it
        submitButton.textContent = 'Submitted ✅';
        submitButton.disabled = true;
        // Display confirmation message
        appendMessage('bot', "Thank you for your feedback! We appreciate your input and strive to improve our services.");

    }
}

function autoCompleteHandler(event) {
    if (event.target.classList.contains('autocomplete-container_list-item')) {
        userChatInput.value = '';
        autoCompleteContainer.classList.add('hide');
        sendMsgToServer('chat message', event.target.textContent);
        appendMessage('user', event.target.textContent);
    }
}

function menuButtonClicked(event) {
    if (event.target.classList.contains('menu-btn')) {
        sendMsgToServer('chat message', event.target.getAttribute('data-button-info'), event.target.textContent);
        appendMessage('user', event.target.textContent);
    }
}

footerMenuToggle.addEventListener('click', (event) => {
    event.preventDefault();
    if (localStorage.getItem('token')) {
        footerMenuContainer.classList.toggle('hide');
        footerMenuImage.src = footerMenuContainer.classList.contains('hide') ? 'menu.png' : 'close.png';
    }
})

footerMenuButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        footerMenuContainer.classList.toggle('hide');
        footerMenuImage.src = 'menu.png';
        sendMsgToServer('chat message', event.target.getAttribute('data-button-info'), event.target.textContent)
        appendMessage('user', event.target.textContent);
    });
});

function handleCardClick(card) {
    if (card) {
        const cardInfo = card.getAttribute('data-card-info');
        const cardTitle = card.querySelector('h3').textContent;
        if (cardInfo) {
            appendMessage('user', [cardTitle]);
            sendMsgToServer('chat message', cardInfo, cardTitle)
        }
    }
}

function moveCarousel(event) {
    if (event.target.classList.contains("carousel-prev")) {
        const container = event.target.closest('.carousel').querySelector('.carousel-container');
        const scrollAmount = 170;
        // Check if there is more content to scroll to the left
        if (container.scrollLeft > 0) {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    }
    if (event.target.classList.contains("carousel-next")) {
        const container = event.target.closest('.carousel').querySelector('.carousel-container');
        const scrollAmount = 170;
        // Check if there is more content to scroll to the right
        if (container.scrollLeft < container.scrollWidth - container.clientWidth) {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }
}

function selectListClicked(event) {
    if (event.target.classList.contains("select-textbox") || event.target.id === "select-input") {
        const selectList = event.target.closest('.select').querySelector('.select-list');
        ishideAddedInCurrentSelect = selectList.classList.contains('hide');
        document.querySelectorAll('.select-list').forEach(list => {
            list.classList.add('hide');
        });
        if (ishideAddedInCurrentSelect) {
            selectList.classList.remove('hide');
        } else {
            selectList.classList.add('hide');
        }
        scrollHeightToBottom();
    }
    if (event.target.classList.contains('select-list-item')) {
        event.target.closest('.select-list').classList.add('hide');
        appendMessage('user', event.target.textContent);
        sendMsgToServer('chat message', event.target.getAttribute('data-info'), event.target.textContent);
    }
}

function multiSelectListClicked(event) {
    if (event.target.closest('.multi-select-list-item')) {
        const listItem = event.target.closest('.multi-select-list-item');
        let selections = listItem.closest('.multi-select').querySelector('.multi-select_selections p');
        if (listItem) {
            const checkbox = listItem.querySelector('.select-checkbox');
            const guestName = listItem.querySelector('.multi-select-guest-name').textContent;
            if (event.target !== checkbox && checkbox) {
                if (checkbox.checked) {
                    checkbox.checked = false;
                    const spanToRemove = selections.querySelector(`span[data-id="${guestName}"]`);
                    if (spanToRemove) {
                        spanToRemove.remove();
                    }
                } else {
                    checkbox.checked = true;
                    selections.innerHTML += `<span data-id="${guestName}">${guestName}</span>`;
                }
            }
            if (event.target == checkbox) {
                if (!checkbox.checked) {
                    const spanToRemove = selections.querySelector(`span[data-id="${guestName}"]`);
                    if (spanToRemove) {
                        spanToRemove.remove();
                    }
                } else {
                    selections.innerHTML += `<span data-id="${guestName}">${guestName}</span>`;
                }
            }
        }
    }
    if (event.target.classList.contains('multiselect-submit')) {
        const checkedItems = [];
        const checkedItemNames = [];
        const listItems = document.querySelectorAll('.multi-select-list-item');

        listItems.forEach(item => {
            const checkbox = item.querySelector('.select-checkbox');
            if (checkbox && checkbox.checked) {
                checkedItems.push(item.getAttribute('data-info').split(' ')[4]);
                checkedItemNames.push(item.querySelector('.multi-select-guest-name').textContent);
            }
        });
        event.target.closest('.multi-select').querySelector('.multi-select-list').classList.add('hide');
        event.target.disabled = true;
        event.target.style.backgroundColor = '#eee';
        event.target.style.cursor = 'not-allowed';
        let clientText = '';
        let serverText = 'traveller paynow ';
        let text = '';
        checkedItemNames.forEach(itemName => {
            clientText += `${itemName}<br>`;
        })
        checkedItems.forEach(item => {
            text += item
        })
        serverText += text;
        appendMessage('user', clientText);
        sendMsgToServer('chat message', serverText, clientText);
    }
}

function startMessage() {
    setTimeout(async () => {
        const htmlData = `<span class="menu">
                        <div class="menu-options" onclick="menuButtonClicked(event)">
                            <button data-button-info="create booking" class="menu-btn">🌟 Make Booking</button>
                            <button data-button-info="existing booking" class="menu-btn">📅 My Bookings</button>
                            <button data-button-info="sales tools" class="menu-btn">🎉 Sales Tools</button>
                            <button data-button-info="customer service" class="menu-btn">💬 Customer Service</button>
                            <button data-button-info="feedback" class="menu-btn">📝 Share Feedback</button>
                        </div>
                    </span>`;
        await appendMessage('bot', [
            "👋 Welcome to <strong>Culture Holidays!</strong> <br><strong>I'm Vivi 😊</strong>, your friendly travel assistant. ✈️🌍",
        ]);
        // "I'm here to help with all your travel needs. ✈️🌍",
        await appendMessage('bot', [htmlData])
        await appendMessage('bot', ["Please choose from the options to continue"]);
        typing = false;
    }, 100);
}

function sendMsgToServer(event, value, rawValue) {
    socket.emit(event, value, localStorage.getItem('token'), rawValue);
}

async function appendMessage(sender, message) {
    if (!Array.isArray(message)) {
        message = [message];
    }
    for await (const msg of message) {
        if (sender == 'bot') {
            await parseMessageWithHTML(msg);
        }
        if (sender == 'user') {
            chatBody.insertAdjacentHTML('beforeend', `
                    <div class="message user">
                        <span class="text">${msg}</span>
                    </div>`);
            stopTyping();
            showTyping();
        }
        scrollHeightToBottom();
    }
}

// Function to parse and handle the message
async function parseMessageWithHTML(message) {
    if (message.startsWith('<span')) {
        chatBody.insertAdjacentHTML('beforeend', `
                            <div class="message bot">
                                ${message}
                            </div>`);
    } else {
        chatBody.insertAdjacentHTML('beforeend', `
                            <div class="message bot">
                                <span class="text"></span>
                            </div>`);
        const typewriterElement = chatBody.querySelectorAll('.text');
        const lastTypewriterElement = typewriterElement[typewriterElement.length - 1];
        // Apply the typewriter effect to the last inserted .typewriter-text
        await typeWriter(lastTypewriterElement, message.trim(), 20);

        scrollHeightToBottom();
    }
}

function typeWriter(element, text, speed = 20) {
    return new Promise((resolve) => {
        let i = 0;
        let contentBuffer = ''; // Store the content here first
        function type() {
            userChatInput.disabled = true;
            if (i < text.length) {
                // Check if the current character is the start of an HTML tag
                if (text[i] === '<') {
                    // Find the end of the tag
                    const tagEnd = text.indexOf('>', i);
                    if (tagEnd !== -1) {
                        // Append the full tag to the buffer
                        contentBuffer += text.slice(i, tagEnd + 1);
                        i = tagEnd + 1;
                    }
                } else {
                    // If it's not an HTML tag, append the character to the buffer
                    contentBuffer += text.charAt(i);
                    i++;
                }

                // Update the element's content with the buffer
                element.innerHTML = contentBuffer;
                scrollHeightToBottom();
                // Continue typing
                setTimeout(type, speed);
            } else {
                // Once typing is done, remove the cursor and resolve the promise
                element.style.borderRight = 'none';
                userChatInput.disabled = false;
                resolve();
            }
        }
        // Start the typing effect
        type();
    });
}

function setSessionStorageWithExpiry(key, value) {
    const now = new Date();

    // Create an object with the value and expiry timestamp
    const item = {
        value: value,
        expiry: now.getTime() + 24 * 60 * 60 * 1000 // 1 day in milliseconds
    };

    // Store it in sessionStorage as a string
    sessionStorage.setItem(key, JSON.stringify(item));
}

function getSessionStorageWithExpiry(key) {
    const itemStr = sessionStorage.getItem(key);

    // If the item doesn't exist, return null
    if (!itemStr) {
        return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    // Compare the expiry time with the current time
    if (now.getTime() > item.expiry) {
        // If the item is expired, remove it from sessionStorage and return null
        sessionStorage.removeItem(key);
        return null;
    }

    return item.value;  // Return the value if not expired
}

// Function to start typing indicator
function showTyping() {
    chatBody.insertAdjacentHTML('beforeend', `
        <div class="message bot typing">
            <span></span><span></span><span></span>
        </div>
    `);
    scrollHeightToBottom();
}

// Function to stop typing indicator
function stopTyping() {
    const typingIndicator = document.querySelector('.typing');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function scrollHeightToBottom() {
    setTimeout(() => {
        if (chatBody.scrollHeight - chatBody.clientHeight > 10) {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
        // const isScrolledToBottom = chatBody.scrollHeight - chatBody.clientHeight <= chatBody.scrollTop + 1;

        // // If scrolled to bottom, scroll to the bottom after adding the message
        // if (isScrolledToBottom) {
        //     chatBody.scrollTop = chatBody.scrollHeight;
        // }
    }, 0);
}

function travelerUpdateHandler(event) {
    let adultTotal;
    if (event.target.classList.contains("free-quote_traveler-add")) {
        const addType = event.target.closest(".free-quote_traveler-update");
        const numberElement = addType.querySelector('.free-quote_traveler-number');
        adultTotal = event.target.closest('.free-quote-section');
        numberElement.textContent = parseInt(numberElement.textContent) + 1;
        if (numberElement.classList.contains('adult')) {
            adultTotal.querySelector('.free-quote_traveler-total-adults').textContent = numberElement.textContent;
        }
        if (numberElement.classList.contains('children')) {
            adultTotal.querySelector('.free-quote_traveler-total-children').textContent = numberElement.textContent;
        }
    }
    if (event.target.classList.contains("free-quote_traveler-remove")) {
        const removeType = event.target.closest(".free-quote_traveler-update");
        const numberElement = removeType.querySelector('.free-quote_traveler-number');
        adultTotal = event.target.closest('.free-quote-section');
        if (numberElement.classList.contains('adult') && parseInt(numberElement.textContent) != 1) {
            numberElement.textContent = parseInt(numberElement.textContent) - 1;
            adultTotal.querySelector('.free-quote_traveler-total-adults').textContent = numberElement.textContent;
        }
        if (numberElement.classList.contains('children') && parseInt(numberElement.textContent) != 0) {
            numberElement.textContent = parseInt(numberElement.textContent) - 1;
            adultTotal.querySelector('.free-quote_traveler-total-children').textContent = numberElement.textContent;
        }
    }
}

async function sharePaymentLink(event, details) {
    try {
        event.preventDefault();
        const form = event.target;
        const email = form.querySelector('input').value;
        event.target.querySelector("button[type=submit]").disabled = true;
        sendMsgToServer('form_submit', { ...details, email });
        showTyping()
    } catch (error) {
        console.log(error);
    }
}

async function freeQuoteFormHandler(event) {
    event.preventDefault();
    if (freeQuoteSubmitClicked) {
        const formData = {
            type: 'free_quote',
            triptype: event.target.travelstyle.value,
            country: event.target.destination.value,
            adult: event.target.querySelector('.free-quote_traveler-total-adults').textContent,
            child: event.target.querySelector('.free-quote_traveler-total-children').textContent,
            tourDate: event.target.tourdate.value,
            fromDate: event.target.tourdate.value,
            noofDay: event.target.tourdays.value,
            approxPrice: event.target.budget.value,
            fullName: event.target.freequotename.value,
            emaiL_ID: event.target.freequoteemail.value,
            mobile: event.target.freequotenumber.value,
            msG_DETAILS: event.target.freequoteremarks.value
        };
        sendMsgToServer('form_submit', formData);
        freeQuoteSubmitClicked = false;
    }
}

function getTravelerPrice(event, price) {
    try {
        const formElement = event.target.closest('form');
        formElement.roomtype.dispatchEvent(new Event("change"));
        const roomTypeOptions = formElement.querySelector('.occupancy-type');
        roomTypeOptions.innerHTML = `<option value="Single_${price.single}">Single Occupancy: $${parseInt(price.single)}</option>
        <option value="Double_${price.double}">Double Occupancy: $${parseInt(price.double)}</option>
        <option value="Triple_${price.double}">Triple Occupancy: $${parseInt(price.double)}</option>`;
    } catch (error) {
        console.log(error);
    }
}

function addMarkup_Commission(event, markup, commission) {
    try {
        const formElement = event.target.closest('form');
        if (formElement.travelertype.value == 'Guest') {
            if (event.target.value.startsWith('Single')) {
                formElement.markup.value = markup.single;
                formElement.comission.value = commission.guest.single;
            }
            else {
                formElement.markup.value = markup.double;
                formElement.comission.value = commission.guest.double;
            }
        } else {
            formElement.markup.value = 0;
            if (event.target.value.startsWith('Single')) formElement.comission.value = commission.agent.single;
            else formElement.comission.value = commission.agent.double;
        }
        formElement.querySelector('.add-traveler-total-amount').textContent = `Total Amount : $${Number(formElement.markup.value || 0) + Number(formElement.comission.value || 0) + Number(formElement.roomtype.value.split('_')[1] || 0)}`;
    } catch (error) {
        console.log(error)
    }
}

async function addTravellerFormSubmit(event, details) {
    try {
        event.preventDefault();
        const travellerData = {
            "t_FNAME": event.target.firstname.value,
            "t_LNAME": event.target.lastname.value,
            "room_num": Number(event.target.roomnum.value),
            "roomPref": event.target.bedtype.value,
            "travellerType": event.target.travelertype.value,
            "t_EMAIL": event.target.email.value,
            "roomType": event.target.roomtype.value.split('_')[0],
            "pkgoriginalcost": Number(event.target.roomtype.value.split('_')[1]),
            "pkG_Total_Amount": Number(event.target.roomtype.value.split('_')[1]),
            "commision": Number(event.target.comission.value),
            "makrup": Number(event.target.markup.value),
        };
        sendMsgToServer('form_submit', { type: 'add_traveller', pkgID: `${details.pkgID}`, tourDate: `${details.tourDate}`, pkG_QUERY_ID: `${details.pkG_QUERY_ID}`, travellerData });
        const btn = event.target.querySelector('.traveler-form-submitBtn');
        btn.disabled = true;
        btn.cursor = 'not-allowed';
        btn.style.backgroundColor = '#eee';
    } catch (error) {
        console.log(error);
    }
}

function roomChangeHandler(event) {
    event.preventDefault();
    const roomInput = event.target.querySelector('input[name="roomno"]');
    sendMsgToServer('chat message', `roomno Change details ${event.target.getAttribute('data-info')} ${roomInput.value}`, `Room Number Changed to ${roomInput.value}`);
}