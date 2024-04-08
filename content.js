
document.addEventListener('DOMContentLoaded', function () {
  // Automatically read URL from the browser
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'detectUrl') {
        const url = message.url;
        // Fetch prediction result from Flask backend
        fetchPredictionResult(url);
    }
  });
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];
      const url = currentTab.url;
      if (url) {
          // Send URL to Flask backend for prediction
          checkUrl(url);
      }
  });

  function checkUrl(url) {
      fetch('http://localhost:5000/predict', { // Change URL to your Flask backend URL
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url })
      })
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              // Display prediction result
              alert(data.message);
          })
          .catch(error => {
              console.error('Error:', error);
          });
  }


});
// Listen for messages from content.js or other parts of the extension
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'predictionResult') {
    const predictionResult = message.predictionResult;
    // Send prediction result to popup.js
    chrome.runtime.sendMessage({ action: 'displayAlert', predictionResult: predictionResult });
  }
});
