let socket = io("http://localhost:3000/", {
    extraHeaders: {
        "agentid": localStorage.getItem('agentid')
    }
});

const base_url = "http://127.0.0.1:3000/views";

const chatToggle = document.getElementById('chat-toggle');
const chatContainer = document.getElementById('chat-container');
const loadingContainer = document.getElementById('loading-container');
const chatBody = document.querySelector('.chat-body');
const closeButton = document.querySelector('.close-btn');
const sendButton = document.querySelector('.send-btn');
const userInput = document.getElementById('input-box');
const speechButton = document.querySelector('.speech-btn');
const dropdownToggle = document.querySelector('.dropdown-toggle');
const menuOptions = document.querySelector('.menu-options');
const menuContainer = document.querySelector('.menu-container');
const mainMenuContainer = document.querySelector('.main-menu-container');
const menuToggle = document.querySelector('.menu-toggle');
const menuButtons = document.querySelectorAll('.main-menu-btn');

// Disable website scroll when interacting with the chat widget
function disablePageScroll() {
    document.body.style.overflow = 'hidden';
}

// Enable website scroll when not interacting with the chat widget
function enablePageScroll() {
    document.body.style.overflow = '';
}

// Add event listeners for scrolling behavior
chatContainer.addEventListener('mouseenter', function () {
    disablePageScroll();
});

chatContainer.addEventListener('mouseleave', function () {
    enablePageScroll();
});

socket.on('disconnect', () => {
    console.log('Socket disconnected');
});

socket.on('autocomplete', (result) => {
    console.log(result);
});

socket.on('getLastData', async (history) => {
    console.log(history);
    loadingContainer.classList.toggle('hide');
    chatContainer.classList.toggle('hide');
    if (history.length == 0) {
        startMessage();
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
                const value = Object.values(entry)[0];
                console.log(key, value)
                // const [key, value] = [...Object.entries(msg)];
                chatBody.insertAdjacentHTML('beforeend', `<div class="message user">
                        <span class="text">${key}</span>
                    </div>`);
                if (Array.isArray(value)) {
                    for (let index = 0; index < value.length; index++) {
                        if (index == 0) {
                            chatBody.insertAdjacentHTML('beforeend', `<div class="message bot">
                            <img src="${base_url}/bot.png" alt="">
                    <span class="text">${value[index]}</span>
                </div>`);
                        } else {
                            if (value[index].startsWith('<div')) {
                                chatBody.insertAdjacentHTML('beforeend', `<div class="message bot">
                    <span style="margin-left:40px;">${value[index]}</span>
                </div>`);
                            } else {
                                chatBody.insertAdjacentHTML('beforeend', `<div class="message bot">
                    <span class="text" style="margin-left:40px;">${value[index]}</span>
                </div>`);
                            }
                        }
                    }
                } else {
                    chatBody.insertAdjacentHTML('beforeend', `<div class="message bot">
                            <img src="${base_url}/bot.png" alt="">
                    <span class="text">${value}</span>
                </div>`)
                }
            }
        }
        setTimeout(() => {
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 0);
    }
});

socket.on('chat message', async (msg) => {
    stopTyping();
    await appendMessage('bot', msg);
});

chatToggle.addEventListener('click', () => {
    loadingContainer.classList.toggle('hide');
    socket.emit('getLastData')
});
closeButton.addEventListener('click', () => {
    loadingContainer.classList.add('hide');
    chatContainer.classList.toggle('hide');
});

sendButton.addEventListener('click', sendMessage);

// function toggleChatbot(e) {
//     e.preventDefault();
//     socket.emit('getLastData', 'needdata');
//     if (chatContainer.classList.contains('show')) {
//         chatContainer.classList.replace('show', 'hide');
//         chatToggle.classList.replace('hide', 'show');
//     } else {
//         chatContainer.classList.replace('hide', 'show');
//         chatToggle.classList.replace('show', 'hide');
//     }
//     if (localStorage.getItem('agentid')) {
//         userInput.readOnly = false;
//         if (chatBody.lastElementChild == null) {
//             startMessage();
//         }
//     }
//     if (!localStorage.getItem('agentid')) {
//         userInput.readOnly = true;
//         appendMessage('bot', ["Please login to continue"]);
//     }
//     setTimeout(() => {
//         chatBody.scrollTop = chatBody.scrollHeight;
//     }, 0);
// }

userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage(e);
    }
});

function sendMessage(event) {
    const userValue = event.target.value || userInput.value;
    if (userValue !== '') {
        appendMessage('user', [userValue]);
        sendMsgToServer('chat message', userValue);
        userInput.value = '';
    }
}

async function appendMessage(sender, message) {
    if (!Array.isArray(message)) {
        message = [message];
    }
    for await (const msg of message) {
        if (sender == 'bot') {
            // Parse and handle the message with both text and HTML elements
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
        setTimeout(() => {
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 0);
    }
}

// Function to stop typing indicator

function stopTyping() {
    const typingIndicator = document.querySelector('.typing');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Function to parse and handle the message
async function parseMessageWithHTML(message) {
    // Check if there is a last message in the chat body before appending the new message
    const lastMessage = document.querySelector('.chat-body').lastElementChild;

    // Check if the last message is from the bot and handle accordingly
    if (lastMessage && lastMessage.classList.contains('bot')) {
        if (message.startsWith('<div')) {
            chatBody.insertAdjacentHTML('beforeend', `
                            <div class="message bot">
                                <span style="margin-left:40px">${message}</span>
                            </div>`);
        } else {
            chatBody.insertAdjacentHTML('beforeend', `
                            <div class="message bot">
                                <span class="typewriter-text" style="margin-left:40px"></span>
                            </div>`);
            const typewriterElement = chatBody.querySelectorAll('.typewriter-text');
            const lastTypewriterElement = typewriterElement[typewriterElement.length - 1];
            // Apply the typewriter effect to the last inserted .typewriter-text
            await typeWriter(lastTypewriterElement, message.trim(), 20);
        }
    } else {
        if (message.startsWith('<div')) {

            chatBody.insertAdjacentHTML('beforeend', `
                            <div class="message bot">
                                <img src="${base_url}/bot.png" alt="">
                                <span>${message}</span>
                            </div>`);
        } else {
            chatBody.insertAdjacentHTML('beforeend', `
                            <div class="message bot">
                                <img src="${base_url}/bot.png" alt="">
                                <span class="typewriter-text"></span>
                            </div>`);
            const typewriterElement = chatBody.querySelectorAll('.typewriter-text');
            const lastTypewriterElement = typewriterElement[typewriterElement.length - 1];
            // Apply the typewriter effect to the last inserted .typewriter-text
            await typeWriter(lastTypewriterElement, message.trim(), 20);
        }
    }
}

function showTyping() {
    chatBody.insertAdjacentHTML('beforeend', `
        <div class="message bot typing">
            <span></span><span></span><span></span>
        </div>
    `);
}

function typeWriter(element, text, speed = 20) {
    return new Promise((resolve) => {
        let i = 0;

        function type() {
            userInput.disabled = true;
            if (i < text.length) {
                // Check if the current character is the start of an HTML tag
                if (text.charAt(i) === '<') {
                    // Find the end of the tag
                    const tagEnd = text.indexOf('>', i);

                    if (tagEnd !== -1) {
                        // Extract the full HTML tag
                        const htmlTag = text.slice(i, tagEnd + 1);

                        // Add the HTML tag directly to the element
                        element.innerHTML += htmlTag;

                        // Move the index to the end of the tag
                        i = tagEnd + 1;
                    }
                } else {
                    // If it's not an HTML tag, type it character by character
                    element.innerHTML += text.charAt(i);
                    i++;
                }

                // Adjust scrolling and continue typing
                setTimeout(type, speed);
                chatBody.scrollTop = chatBody.scrollHeight;
            } else {
                // Once typing is done, remove the cursor and resolve the promise
                element.style.borderRight = 'none';
                userInput.disabled = false;
                resolve();
            }
        }
        // Start the typing effect
        type();
    });
}

const SELECTORS = {
    'country-select': true,
    'package-select': true,
    'date-select': true,
    'itinerary-options': true
}
// Listen for changes to the dropdown
document.addEventListener('change', function (event) {
    if (SELECTORS[event.target.id]) {
        appendMessage('user', `${event.target.options[event.target.selectedIndex].textContent}`);
        sendMsgToServer('chat message', event.target.value, event.target.options[event.target.selectedIndex].textContent);
    }
});

menuToggle.addEventListener('click', (event) => {
    event.preventDefault();
    if (localStorage.getItem('agentid')) {
        mainMenuContainer.classList.toggle('hide');
    }
})

menuButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        mainMenuContainer.classList.toggle('hide');
        socket.emit('chat message', event.target.getAttribute('data-button-info'));
        appendMessage('user', event.target.textContent);
    });
});

document.addEventListener('click', (event) => {
    event.preventDefault();
    if (!menuToggle.contains(event.target) && !mainMenuContainer.classList.contains('hide')) {
        mainMenuContainer.classList.add('hide');
    }
    // mainMenuContainer.classList.length < 2 && mainMenuContainer.classList.add('hide');
    if (event.target.classList.contains('menu-btn')) {
        socket.emit('chat message', event.target.getAttribute('data-button-info'), localStorage.getItem('agentid'));
        appendMessage('user', event.target.textContent);
    }

    if (event.target.id.startsWith('next')) {
        const container = event.target.closest('.slider-wrapper').querySelector('.card-container');
        const cards = container.querySelectorAll('.card');
        const scrollAmount = 110;

        // Check if there is more content to scroll
        if (container.scrollLeft + container.clientWidth < container.scrollWidth) {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }

    if (event.target.id === 'prev') {
        const container = event.target.closest('.slider-wrapper').querySelector('.card-container');
        const cards = document.querySelectorAll('.card');
        const scrollAmount = 110;
        if (container.scrollLeft > 0) {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    }

    if (event.target.classList.contains('card')) {
        console.log(event.target.getAttribute('data-card-info'));
        socket.emit('chat message', event.target.getAttribute('data-card-info'));
    }

    const card = event.target.closest('.card');
    if (card) {
        const cardInfo = card.getAttribute('data-card-info');
        const cardTitle = card.querySelector('h3').textContent;
        if (cardInfo) {
            console.log(cardInfo);
            appendMessage('user', [cardTitle]);
            socket.emit('chat message', cardInfo);
        }
    }

    if (event.target.id == 'form-submit') {
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
})


function startMessage() {
    setTimeout(async () => {
        const htmlData = `<div class="menu-container">
                                <div class="menu-options">
                                    <button data-button-info="create booking" class="menu-btn">🌟 Make Booking</button>
                                    <button data-button-info="create flyer" class="menu-btn">🎉 Create Your Stunning Flyer Now!</button>
                                    <button data-button-info="create itinerary" class="menu-btn">🗒️ Craft Your Perfect Itinerary!</button>
                                    <button data-button-info="need help" class="menu-btn">🚨 Need Help?</button>
                                    <button data-button-info="feedback" class="menu-btn">📝 Share Your Feedback & Suggestions!</button>
                                </div>
                            </div>`;
        await appendMessage('bot', [
            "👋 Hello there! I'm Vivi, your friendly AI travel assistant. 😊",
            "I'm here to help with all your travel needs. ✈️🌍",
        ]);
        await appendMessage('bot', [htmlData])
        await appendMessage('bot', ["Please choose from the options to continue"])
    }, 100);
}

function sendMsgToServer(event, value, rawValue) {
    socket.emit(event, value, localStorage.getItem('agentid'), rawValue);
}