"""
Sentiment Analysis API
Author: Miguel Bolivar
Model: TF-IDF + Logistic Regression
Endpoint: POST /predict
"""

import pickle, re
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load model
with open('vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

def clean(text):
    return re.sub(r'[^a-z\s]', '', text.lower())

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'model': 'sentiment-v1'})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'Missing "text" field'}), 400
    
    text = data['text']
    if isinstance(text, list):
        texts = [clean(t) for t in text]
    else:
        texts = [clean(text)]
    
    X = vectorizer.transform(texts)
    probs = model.predict_proba(X)[:, 1]
    preds = (probs >= 0.5).astype(int)
    
    results = [{
        'text': t[:200],
        'sentiment': 'positive' if p == 1 else 'negative',
        'confidence': round(float(prob), 4)
    } for t, p, prob in zip(texts if isinstance(text, list) else [text], preds, probs)]
    
    return jsonify({'predictions': results})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
