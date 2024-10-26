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
const loadingContainer = document.getElementById('loading-container');
const chatContainer = document.getElementById('chat-container');
const refreshChat = document.querySelector('.refresh-icon');
const chatBody = document.querySelector('.chat-body');

const dropdownToggle = document.querySelector('.dropdown-toggle');
const menuOptions = document.querySelector('.menu-options');

const footerMenuToggle = document.getElementById('footer_menu-toggle');
const footerMenuContainer = document.querySelector('.footer_menu-container');
const footerMenuButtons = document.querySelectorAll('.footer_menu-option');
const footerMenuImage = document.querySelector('.footer_menu-image');
let userChatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-chat');

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

refreshChat.addEventListener('click', async (event) => {
    if (typing == false) {
        typing = true;
        chatBody.innerHTML = '';
        startMessage();
    }
})

userChatInput.addEventListener('input', function (event) {
    if (event.inputType !== 'insertLineBreak') {
        socket.emit('autocomplete', userChatInput.value);
    }
    userChatInput.style.height = 'auto'; // Reset height to calculate new height
    userChatInput.style.height = userChatInput.scrollHeight + 'px'; // Adjust height to fit content

    // Restrict the height to 2 rows (you can change the line-height to match your styling)
    const maxHeight = parseFloat(getComputedStyle(userChatInput).lineHeight) * 2;
    if (userChatInput.scrollHeight > maxHeight) {
        userChatInput.style.height = maxHeight + 'px';
        userChatInput.style.overflowY = 'auto'; // Show scrollbar if content exceeds two rows
    } else {
        userChatInput.style.overflowY = 'hidden'; // Hide scrollbar for one or two rows
    }
});

userChatInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        userChatInput.style.height = 'auto';
        sendMessage(event);
    }
});

sendButton.addEventListener('click', sendMessage);

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
    if (event.target.id === "select-input") {
        const selectTextbox = event.target.closest(".select-textbox"); // Get the parent container
        const nextSibling = selectTextbox.nextElementSibling; // Get the next sibling (which is the select list)
        if (nextSibling && nextSibling.classList.contains('hide')) {
            nextSibling.classList.remove('hide');
        }

        const selectListItems = nextSibling.querySelectorAll('.select-list-item');

        event.target.addEventListener('input', () => {
            const filterText = event.target.value.toLowerCase(); // Get the input text

            // Filter the list items based on the input text
            selectListItems.forEach(item => {
                const itemText = item.textContent.toLowerCase();
                item.style.display = itemText.includes(filterText) ? '' : 'none';
            });
            if ((chatBody.scrollHeight - chatBody.scrollTop) > 300) {
                scrollHeightToBottom();
            }
        });
        if ((chatBody.scrollHeight - chatBody.scrollTop - 65) > 300) {
            scrollHeightToBottom();
        }
    }
    if (event.target.classList.contains("select-textbox")) {
        const selectTextbox = event.target;
        const nextSibling = selectTextbox.nextElementSibling;
        nextSibling && nextSibling.classList.remove('hide');
        scrollHeightToBottom();
    }
    if (event.target.classList.contains('select-list-item')) {
        event.target.closest('.select-list').classList.add('hide');
        appendMessage('user', event.target.textContent);
        sendMsgToServer('chat message', event.target.getAttribute('data-info'), event.target.textContent);
    }

    const selectElements = document.querySelectorAll('.select-list');
    selectElements.forEach(select => {
        // If the .select-list is visible (does not contain 'hide')
        if (!select.classList.contains('hide')) {
            // Check if the clicked element is outside the .select-list and its related .select-textbox
            if (!select.contains(event.target) && !event.target.closest('.select-textbox')) {
                // Add 'hide' class to hide the list
                select.classList.add('hide');
            }
        }
    });
    if (!footerMenuToggle.contains(event.target) && !footerMenuContainer.classList.contains('hide')) {
        footerMenuContainer.classList.add('hide');
        footerMenuImage.src = 'menu.png';
    }

    if (event.target.classList.contains('menu-btn')) {
        sendMsgToServer('chat message', event.target.getAttribute('data-button-info'));
        appendMessage('user', event.target.textContent);
    }

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

    const card = event.target.closest('.card');
    if (card) {
        const cardInfo = card.getAttribute('data-card-info');
        const cardTitle = card.querySelector('h3').textContent;
        if (cardInfo) {
            appendMessage('user', [cardTitle]);
            sendMsgToServer('chat message', cardInfo, cardTitle)
        }
    }

    if (event.target.id == 'feedback-submit') {
        const name = event.target.parentElement.elements['feedback-name'].value;
        const email = event.target.parentElement.elements['feedback-email'].value;
        const formText = event.target.parentElement.elements['feedback-textarea'].value;
        event.preventDefault();
        // Check if all inputs are filled
        if (name && email && formText) {
            event.target.textContent = 'Submitted ✅';
            event.target.disabled = true;
            event.target.parentElement.elements['feedback-name'].value = "";
            event.target.parentElement.elements['feedback-email'].value = "";
            event.target.parentElement.elements['feedback-textarea'].value = "";
            sendMsgToServer('form_submit', { name: name, email: email, messageInput: formText });
            appendMessage('bot', "Thank you for your feedback! We appreciate your input and strive to improve our services.")
        } else {
            alert('Please fill out all fields before submitting!');
        }
    }

    if (event.target.id == 'help-submit') {
        const submitButton = document.getElementById('submitButton');
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const messageInput = document.getElementById('form-textarea');
        event.preventDefault(); // Prevent form submission

        // Check if all inputs are filled
        if (nameInput.value && emailInput.value && messageInput.value) {
            submitButton.textContent = 'Submitted ✅'; // Change button text to "Submitted"
            submitButton.disabled = true;
            appendMessage('bot', "Thank you for your feedback! We appreciate your input and strive to improve our services.")
        } else {
            alert('Please fill out all fields before submitting!');
        }
    }

    if (event.target.classList.contains('autocomplete-container_list-item')) {
        userInput.value = '';
        autoCompleteContainer.classList.add('hide');
        sendMsgToServer('chat message', event.target.textContent);
        appendMessage('user', event.target.textContent);
    }
})

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
        sendMsgToServer('chat message', event.target.getAttribute('data-button-info'))
        appendMessage('user', event.target.textContent);
    });
});

function startMessage() {
    setTimeout(async () => {
        const htmlData = `<span class="menu">
                        <div class="menu-options">
                            <button data-button-info="create booking" class="menu-btn">🌟 Make Booking</button>
                            <button data-button-info="create flyer" class="menu-btn">🎉 Create Your Stunning Flyer
                                Now!</button>
                            <button data-button-info="create itinerary" class="menu-btn">🗒️ Craft Your Perfect
                                Itinerary!</button>
                            <button data-button-info="customer service" class="menu-btn">💬 Customer Service</button>
                            <button data-button-info="feedback" class="menu-btn">📝 Share Your Feedback &
                                Suggestions!</button>
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
        const distanceFromBottom = chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight;
        if (distanceFromBottom > 15) {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }, 0);
}