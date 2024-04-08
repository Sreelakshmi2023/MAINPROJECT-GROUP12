from flask import Flask, render_template, request, jsonify
import pickle
import re
import numpy as np

app = Flask(__name__)

# Load the pickled model
with open('detection.pkl', 'rb') as f:
    model = pickle.load(f)
    
@app.route('/')
def index():
    return render_template('popup.html')

# Preprocess URL function
def preprocess_url(url):
    # Tokenize URL
    tokens = re.split('[/:?=.-]', url)
    # Convert tokens to lowercase
    tokens = [token.lower() for token in tokens]
    # Pad or truncate tokens to fixed length
    max_len = 50
    if len(tokens) < max_len:
        tokens += [''] * (max_len - len(tokens))
    else:
        tokens = tokens[:max_len]
    return tokens

# Predict function
def predict_url(url):
    # Preprocess URL
    processed_url = preprocess_url(url)
    # Convert to numpy array
    x = np.array([processed_url])
    # Predict using the model
    prediction = model.predict(x)
    return prediction[0]



@app.route('/predict', methods=['POST'])
def predict():
    # Get URL from request data
    url = request.form['url']
    # Predict whether URL is malicious or not
    prediction = predict_url(url)
    # Return prediction result
    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(debug=True)
