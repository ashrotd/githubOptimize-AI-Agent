import requests
import os

class GithubClient:
    """Client to interact with GitHub API"""

    def __init__(self, token=None):
        self.base_url = "https://api.github.com"
        self.token = token or os.getenv('GITHUB_TOKEN')
        self.headers = {
            'Accept':'application/vnd.github.v3+json'
        }
        if self.token:
            self.headers['Authorization'] = f'token {self.token}'

    def get_user_profile(self, username):
        """Get user profile info"""
        url = f"{self.base_url}/users/{username}"
        response = requests.get(url,headers=self.headers)

        if response.status_code == 404:
            return {"error": f"User '{username}' not found"}
        elif response.status_code != 200:
            return {"error": f"GitHub API error: {response.status_code}"}
        
        return response.json()
    
    def get_user_repos(self, username):
        """Get all public repo for a user"""
        url = f"{self.base_url}/users/{username}/repos"
        params = {
            'per_page':100, # max repos
            'sort': 'updated' # Most resently updated
        }
        response = requests.get(url,headers=self.headers, params=params)
        if response.status_code != 200:
            return {"error": f"Failed to fetch repositories: {response.status_code}"}
        
        return response.json()