(function () {
    const base_url = "http://127.0.0.1:3000"
    // Create the chat button
    var chatButton = document.createElement('div');
    chatButton.id = 'chatbot-button';
    chatButton.style.position = 'fixed';
    chatButton.style.bottom = '10px';
    chatButton.style.right = '20px';
    chatButton.style.width = '70px';
    chatButton.style.height = '70px';
    chatButton.style.borderRadius = '50%';
    chatButton.style.cursor = 'pointer';
    chatButton.style.zIndex = '9999';
    chatButton.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.6)';
    chatButton.innerHTML = `<img src="${base_url}/bot-logo.png" style="width:100%; height:100%" />`;
    // Append button to the body
    document.body.appendChild(chatButton);
    // Create the chatbot window (hidden initially)
    var chatbotWindow = document.createElement('div');
    chatbotWindow.id = 'chatbot-window';
    chatbotWindow.style.position = 'fixed';
    chatbotWindow.style.bottom = '80px';
    chatbotWindow.style.right = '20px';
    chatbotWindow.style.width = '0px';
    chatbotWindow.style.height = '0px';
    chatbotWindow.style.display = 'none';
    chatbotWindow.style.zIndex = '9999';
    chatbotWindow.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
    chatbotWindow.style.borderRadius = '15px';

    // Append chatbot window to the body
    document.body.appendChild(chatbotWindow);
    // Toggle the chatbot visibility when clicking the button
    chatButton.onclick = function () {
        if (chatbotWindow.style.display == 'none') {
            // Insert the chatbot iframe
            chatbotWindow.innerHTML = `<iframe id="iframe-chatbot" src="${base_url}/bot.html" style="width:100%; height:100%; border:none; border-radius:15px"></iframe>`;
            chatbotWindow.style.display = 'block';
            chatButton.style.backgroundColor = '#ee1551';
            chatbotWindow.style.bottom = '60px';
            chatButton.style.width = '50px';
            chatButton.style.height = '50px';
            chatButton.style.cursor = 'pointer';
            chatButton.innerHTML = `<img src="${base_url}/cancel.png" style="width:100%; height:100%" />`
        } else {
            chatbotWindow.style.display = 'none';
            chatButton.style.width = '70px';
            chatButton.style.height = '70px';
            chatButton.innerHTML = `<img src="${base_url}/bot-logo.png" style="width:100%; height:100%" />`
        }
    };
    window.addEventListener('message', (event) => {
        if (event.data == "size") {
            chatbotWindow.style.width = '330px';
            chatbotWindow.style.height = '480px';
        }
    })
    function disablePageScroll() {
        document.body.style.overflow = 'hidden';
    }

    // Enable website scroll when not interacting with the chat widget
    function enablePageScroll() {
        document.body.style.overflow = '';
    }

    // Add event listeners for scrolling behavior
    chatbotWindow.addEventListener('mouseenter', function () {
        disablePageScroll();
    });

    chatbotWindow.addEventListener('mouseleave', function () {
        enablePageScroll();
    });
})();



