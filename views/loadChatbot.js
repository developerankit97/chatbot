
function loadChatbot() {
    const chatbotContainer = document.createElement('div');
    document.body.appendChild(chatbotContainer);

    const socketIoScript = document.createElement('script');
    socketIoScript.src = 'https://cdn.socket.io/4.0.0/socket.io.min.js';
    socketIoScript.onload = function () {
        const socket = io('http://yourserver:port'); // Replace with your server URL

        fetch('https://yourserver.com/chatbot.html')
            .then(response => response.text())
            .then(html => {
                chatbotContainer.innerHTML = html;

                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://yourserver.com/chatbot.css'; // URL to your CSS file
                document.head.appendChild(link);

                const script = document.createElement('script');
                script.src = 'https://yourserver.com/chatbot.js'; // URL to your JS file
                document.body.appendChild(script);
            });
    };
    document.head.appendChild(socketIoScript);
}

