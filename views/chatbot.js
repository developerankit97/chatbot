(function () {
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
    chatButton.innerHTML = '<img src="https://chatbot-i5sm.onrender.com/views/bot-logo.png" style="width:100%; height:100%" />';

    // Append button to the body
    document.body.appendChild(chatButton);

    // Create the chatbot window (hidden initially)
    var chatbotWindow = document.createElement('div');
    chatbotWindow.id = 'chatbot-window';
    chatbotWindow.style.position = 'fixed';
    chatbotWindow.style.bottom = '80px';
    chatbotWindow.style.right = '20px';
    chatbotWindow.style.width = '380px';
    chatbotWindow.style.height = '500px';
    chatbotWindow.style.display = 'none';
    chatbotWindow.style.zIndex = '9999';
    chatbotWindow.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
    chatbotWindow.style.borderRadius = '15px';

    // Append chatbot window to the body
    document.body.appendChild(chatbotWindow);

    // Toggle the chatbot visibility when clicking the button
    chatButton.onclick = function () {
        if (chatbotWindow.style.display === 'none') {
            // Insert the chatbot iframe
            chatbotWindow.innerHTML = `<iframe src="https://chatbot-i5sm.onrender.com/views/bot.html" style="width:100%; height:100%; border:none; border-radius:15px"></iframe>`;
            chatbotWindow.style.display = 'block';
        } else {
            chatbotWindow.style.display = 'none';
        }
    };
})();



