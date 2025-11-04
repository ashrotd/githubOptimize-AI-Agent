from utils.github_client import GithubClient

class GitHubAnalyzer:
    """Analyzes GitHub Profiles and Repositories"""

    def __init__(self):
        self.client = None

    def analyze_profile(self, username, token=None):
        """complete profile analysis"""
        self.client = GithubClient(token)

        # Get profile data
        profile = self.client.get_user_profile(username)
        if 'error' in profile:
            return profile
    
        # Get repositories
        repos = self.client.get_user_repos(username)
        if 'error' in repos:
            return repos
        
        # Analyze repositories
        repo_analysis = self._analyze_repositories(repos)

        # calculate statistics
        statistics = self._calculate_statistics(profile, repos)

        return {
            "profile": {
                "username": profile.get('login'),
                "name": profile.get('name'),
                "bio": profile.get('bio'),
                "avatar_url": profile.get('avatar_url'),
                "public_repos": profile.get('public_repos'),
                "followers": profile.get('followers'),
                "following": profile.get('following'),
                "created_at": profile.get('created_at')
            },
            "statistics": statistics,
            "repository_analysis": repo_analysis
        }
    
    def _analyze_repositories(self, repos):
        """Analyze all repositories"""
        total_repos = len(repos)
        repos_with_readme = 0
        repos_with_license = 0
        repos_with_description = 0
        archived_repos = 0

        for repo in repos:
            # check for README (Github doesn't directly let us know)
            if repo.get('description'):
                repos_with_description += 1
            
            # Check for license
            if repo.get('license'):
                repos_with_license += 1
            
            # Check if archived
            if repo.get('archived'):
                archived_repos += 1
            
            # Assume repos with descriptions likely have READMEs
            # (In a real app, you'd make additional API calls to check)
            if repo.get('size', 0) > 0:
                repos_with_readme += 1
        
        return {
            "total_repositories": total_repos,
            "repos_with_readme": repos_with_readme,
            "repos_with_license": repos_with_license,
            "repos_with_description": repos_with_description,
            "archived_repos": archived_repos,
            "active_repos": total_repos - archived_repos
        }
    
    def _calculate_statistics(self, profile, repos):
        """Calculate profile statistics"""
        total_stars = sum(repo.get('stargazers_count', 0) for repo in repos)
        total_forks = sum(repo.get('forks_count', 0) for repo in repos)
        total_watchers = sum(repo.get('watchers_count', 0) for repo in repos)
        
        # Count languages
        languages = {}
        for repo in repos:
            lang = repo.get('language')
            if lang:
                languages[lang] = languages.get(lang, 0) + 1
        
        return {
            "total_stars": total_stars,
            "total_forks": total_forks,
            "total_watchers": total_watchers,
            "languages": languages,
            "repos_with_readme": sum(1 for r in repos if r.get('size', 0) > 0),
            "repos_with_license": sum(1 for r in repos if r.get('license'))
        }