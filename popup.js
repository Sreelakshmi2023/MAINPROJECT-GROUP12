// // Listen for messages from background.js
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//     if (message.action === 'displayAlert') {
//         const predictionResult = message.predictionResult;
//         if (predictionResult === 'malicious') {
//             alert('Alert: This URL is malicious!');
//         } else {
//             alert('This URL is safe.');
//         }
//     }
// });

const form = document.getElementById('urlForm');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get the URL from the input field
        const url = document.getElementById('url').value;
        
        // Send the URL to the backend for prediction
        fetchPrediction(url);
    });

    function fetchPrediction(url) {
        fetch('http://localhost:5000/predict', { // Replace with your Flask backend URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        })
        .then(response => response.json())
        .then(data => {
            // Display prediction result
            resultDiv.textContent = data.prediction;
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.textContent = 'An error occurred. Please try again.';
        });
    }