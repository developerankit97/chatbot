const socket = io("http://localhost:3000/");

const chatToggle = document.getElementById('chat-toggle');
const chatContainer = document.getElementById('chat-container');
const chatBody = document.querySelector('.chat-body');
const closeButton = document.querySelector('.close-btn');
const sendButton = document.querySelector('.send-btn');
const userInput = document.getElementById('input-box');
const speechButton = document.querySelector('.speech-btn');
const dropdownToggle = document.querySelector('.dropdown-toggle');
const menuOptions = document.querySelector('.menu-options');
const menuContainer = document.querySelector('.menu-container');
const menuToggle = document.querySelector('.menu-toggle');
const menuButtons = document.querySelectorAll('.main-menu-btn');

chatToggle.addEventListener('click', toggleChatbot);
closeButton.addEventListener('click', toggleChatbot);
sendButton.addEventListener('click', sendMessage);


socket.on('autocomplete', (result) => {
    console.log(result);
});

socket.on('chat message', async (msg) => {
    stopTyping();

    await appendMessage('bot', msg);
});

function toggleChatbot(e) {
    e.preventDefault();
    if (chatContainer.classList.contains('show')) {
        chatContainer.classList.replace('show', 'hide');
        chatToggle.classList.replace('hide', 'show');
    } else {
        chatContainer.classList.replace('hide', 'show');
        chatToggle.classList.replace('show', 'hide');
        if (chatBody.lastElementChild == null) {
            setTimeout(async () => {
                const htmlData = `<div class="menu-container">
                        <div class="menu-options">
                        <button class="menu-btn">Bookings</button>
                        <button class="menu-btn">Tours</button>
                        <button class="menu-btn">Free Tools</button>
                        <button class="menu-btn">Payment Options</button>
                        <button class="menu-btn">Having Issues</button>
                        <button class="menu-btn">Feedback & Complain</button>
                    </div>
                </div>`;
                await appendMessage('bot', ["Hello! It's Vivi a helpful AI chatbot designed to assist you with your travel needs.",
                    "Please select from below options to proceed further or type below"]);
                await appendMessage('bot', [htmlData])
            }, 500);
        }
    }
    setTimeout(() => {
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 0);
}

userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage(e);
    }
});

function sendMessage(event) {
    const userValue = event.target.value || userInput.value;
    if (userValue !== '') {
        appendMessage('user', [userValue]);
        socket.emit('chat message', userValue);
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
        if (message.trim().startsWith('<div')) {
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
        if (message.trim().startsWith('<div')) {
            chatBody.insertAdjacentHTML('beforeend', `
                            <div class="message bot">
                                <img src="bot.png" alt="">
                                <span>${message}</span>
                            </div>`);
        } else {
            chatBody.insertAdjacentHTML('beforeend', `
                            <div class="message bot">
                                <img src="bot.png" alt="">
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


// function typeWriter(element, text, speed = 20) {
//     return new Promise((resolve) => {
//         let i = 0;

//         function type() {
//             if (i < text.length) {
//                 element.innerHTML += text.charAt(i);
//                 i++;
//                 setTimeout(type, speed); // Control the typing speed here
//                 chatBody.scrollTop = chatBody.scrollHeight;
//             } else {
//                 // Remove the cursor once typing is done
//                 element.style.borderRight = 'none';
//                 resolve();
//             }
//         }
//         type();
//     });
// }

const SELECTORS = {
    'country-select': true,
    'package-select': true,
    'date-select': true,
    'itinerary-options': true
}
// Listen for changes to the dropdown
document.addEventListener('change', function (event) {
    console.log('working');
    if (SELECTORS[event.target.id]) {
        appendMessage('user', `${event.target.options[event.target.selectedIndex].textContent}`);
        socket.emit('chat message', event.target.value);
    }
});

menuToggle.addEventListener('click', (event) => {
    event.preventDefault();
    menuContainer.classList.toggle('hide');
})

menuButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        menuContainer.classList.toggle('hide');
        appendMessage('user', event.target.textContent);
    });
});

document.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.target.classList.contains('menu-btn')) {
        appendMessage('user', event.target.textContent);
    }
})