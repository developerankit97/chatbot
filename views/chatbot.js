(function () {
    var userId = ChatBot_API.userId || 'defaultId';
    localStorage.setItem('agentid', userId);
    var chatWidget = document.createElement('div');
    chatWidget.id = 'chatbot-widget';
    chatWidget.style.position = 'fixed';
    chatWidget.style.bottom = '20px';
    chatWidget.style.right = '20px';
    chatWidget.style.width = '400px';
    chatWidget.style.height = '650px';
    chatWidget.style.border = 'none';
    chatWidget.style.zIndex = '9999';

    var iframe = document.createElement('iframe');
    iframe.src = `https://chatbot-i5sm.onrender.com?userId=${userId}`; // Your chatbot URL or app
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    chatWidget.appendChild(iframe);
    document.body.appendChild(chatWidget);
    // Function to disable page scrolling
    function disablePageScroll(event) {
        event.preventDefault();  // Stop default scroll behavior
    }

    // Enable page scroll when leaving the chat widget
    function enablePageScroll() {
        document.removeEventListener('wheel', disablePageScroll, { passive: false });
        document.removeEventListener('touchmove', disablePageScroll, { passive: false });
    }

    // Disable page scroll when entering the chat widget
    function preventPageScroll() {
        document.addEventListener('wheel', disablePageScroll, { passive: false });
        document.addEventListener('touchmove', disablePageScroll, { passive: false });
    }

    // Add event listeners for scrolling behavior
    chatWidget.addEventListener('mouseenter', function () {
        preventPageScroll();  // Disable page scroll when mouse enters the chat widget
    });

    chatWidget.addEventListener('mouseleave', function () {
        enablePageScroll();  // Enable page scroll when mouse leaves the chat widget
    });
})();
