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
const menuButtons = document.querySelectorAll('.menu-btn');

chatToggle.addEventListener('click', toggleChatbot);
closeButton.addEventListener('click', toggleChatbot);
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage(e);
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

// // Close the menu if clicking anywhere outside the menu-container
// document.addEventListener('click', (event) => {
//     // Check if the click target is outside the menu-container
//     if (!menuContainer.contains(event.target)) {
//         menuContainer.classList.add('hide');  // Hide the menu if clicked outside
//     }
// });

function toggleChatbot(e) {
    e.preventDefault();
    if (chatContainer.classList.contains('show')) {
        chatContainer.classList.replace('show', 'hide');
        chatToggle.classList.replace('hide', 'show');
    } else {
        chatContainer.classList.replace('hide', 'show');
        chatToggle.classList.replace('show', 'hide');
    }
    setTimeout(() => {
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 0);
}

socket.on('chat message', (msg) => {
    const typingIndicator = document.querySelector('.typing');
    if (typingIndicator) typingIndicator.remove();
    chatBody.insertAdjacentHTML('beforeend', `
                    <div class="message bot">
                        <span class="text typewriter-text"></span>
                    </div>`);
    appendMessage('bot', msg);
});

function sendMessage(event) {
    const userValue = event.target.value || userInput.value;
    if (userValue !== '') {
        appendMessage('user', userValue);
        socket.emit('chat message', userValue);
        // respondToUser(userInput.toLowerCase());
        document.getElementById('input-box').value = '';
    }
}

// function respondToUser(userInput) {
//     const response = responses[userInput] || responses["default"];
//     setTimeout(function () {
//         appendMessage('bot', response);
//     }, 500);
// }

function appendMessage(sender, message) {
    if (sender == 'bot') {
        // Check if the message contains HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(message, 'text/html');
        if (doc.body.firstChild) {
            // If the message has HTML, insert it directly
            chatBody.insertAdjacentHTML('beforeend', `
                <div class="message bot">
                    <span class="text">${message}</span>
                </div>`);
        } else {
            const typewriterElement = chatBody.querySelectorAll('.typewriter-text');
            const lastTypewriterElement = typewriterElement[typewriterElement.length - 1];
            // Apply the typewriter effect to the last inserted .typewriter-text
            typeWriter(lastTypewriterElement, message, 20);
        }
    } else {
        // Append user message
        chatBody.insertAdjacentHTML('beforeend', `
                    <div class="message user">
                        <span class="text">${message}</span>
                    </div>`);
        showTyping();
    }
    setTimeout(() => {
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 0);
}

// function appendButtons(sender, message) {
//     const chatBox = document.getElementById('chat-box');
//     const messageElement = document.createElement('div');
//     messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
//     messageElement.innerHTML = message;
//     chatBox.appendChild(messageElement);
//     chatBox.scrollTop = chatBox.scrollHeight;
//     if (sender === 'bot' && message === responses["default"]) {
//         const buttonYes = document.createElement('button');
//         buttonYes.textContent = '✔ Yes';
//         buttonYes.onclick = function () {
//             appendMessage('bot', responses["expert"]);
//         };
//         const buttonNo = document.createElement('button');
//         buttonNo.textContent = '✖ No';
//         buttonNo.onclick = function () {
//             appendMessage('bot', responses["no"]);
//         };
//         const buttonContainer = document.createElement('div');
//         buttonContainer.classList.add('button-container');
//         buttonContainer.appendChild(buttonYes);
//         buttonContainer.appendChild(buttonNo);
//         chatBox.appendChild(buttonContainer);
//     }
// }

function showTyping() {
    chatBody.insertAdjacentHTML('beforeend', `
        <div class="message bot typing">
            <span></span><span></span><span></span>
        </div>
    `);
}

function typeWriter(element, text, speed = 50) {
    let i = 0;

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed); // Control the typing speed here
        } else {
            // Remove the cursor once typing is done
            element.style.borderRight = 'none';
        }
    }

    type();
}

const SELECTORS = {
    'country-select': true,
    'package-select': true,
    'date-select': true
}
// Listen for changes to the dropdown
document.addEventListener('change', function (event) {
    if (SELECTORS[event.target.id]) {
        appendMessage('user', `${event.target.options[event.target.selectedIndex].textContent}`);
        socket.emit('chat message', event.target.value);
    }
});