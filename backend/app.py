from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
# from agents.analyzer import GitHubAnalyzer
# from agents.recommender import RecommendationEngine

load_dotenv()

app = Flask(__name__)
CORS(app)
# analyzer = GitHubAnalyzer()
# recommender = RecommendationEngine()
@app.route('/health', methods=['GET'])
def health_check():
    """Health Check Endpoint"""
    return jsonify({
        "status":"Healthy",
        "service": "GitHub Profile Optimizer API"
    }), 200


# @app.route('/api/analyze/profile', methods=['POST'])
# def analyze_profile():
#     """Analyze the GitHub user's profile and repo"""
#     try:
#         data = request.json
#         username = data.get('username')
#         github_token = data.get('token', os.getenv('GITHUB_TOKEN'))

#         if not username:
#             return jsonify({"error": "Username is required"}), 400
        
#         # Analyze the profile using AI agents
#         analyzer_result = analyzer.analyze_profile(username,github_token)

#         if 'error' in analyzer_result:
#             return jsonify({"error": analyzer_result['error']}), 404
#         return jsonify(analyzer_result), 200
    
#     except Exception as e:
#         return jsonify({"error":f"Internal server error: {str(e)}"}),500
    
# @app.route('/api/recommendations', methods=['POST'])
# def get_recommendations():

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
