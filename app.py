from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
from analyze_leads import process_leads

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Backend is running"}), 200

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Read file into DataFrame
        if file.filename.endswith('.xlsx'):
            df = pd.read_excel(file)
        elif file.filename.endswith('.csv'):
            df = pd.read_csv(file)
        else:
            return jsonify({"error": "Invalid file format. Please upload .xlsx or .csv"}), 400

        # Process leads
        # Get OpenAI key from header or env
        openai_key = request.headers.get('X-OpenAI-Key') or os.getenv("OPENAI_API_KEY")
        
        results = process_leads(df, openai_key)
        
        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
