import React, { useState } from 'react';
import { Search, Github, Star, GitFork, Users, Code } from 'lucide-react';

export default function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost/api';

  const analyzeProfile = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await fetch(`${API_URL}/analyze/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze profile');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Github className="w-12 h-12 mr-3 text-blue-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              GitHub Profile Analyzer
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            AI-powered analysis to optimize your GitHub profile
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter GitHub username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && analyzeProfile()}
                className="w-full pl-12 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={analyzeProfile}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-500 rounded-xl text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {analysis && (
          <div className="space-y-8">
            {/* Profile Overview */}
            <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Profile Overview</h2>
              <div className="flex items-start gap-6">
                <img
                  src={analysis.profile.avatar_url}
                  alt={analysis.profile.username}
                  className="w-24 h-24 rounded-full border-4 border-blue-500"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{analysis.profile.name || analysis.profile.username}</h3>
                  <p className="text-gray-400 mb-2">@{analysis.profile.username}</p>
                  {analysis.profile.bio && <p className="text-gray-300 mb-4">{analysis.profile.bio}</p>}
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-gray-400">Repositories:</span>
                      <span className="ml-2 font-semibold text-blue-400">{analysis.profile.public_repos}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Followers:</span>
                      <span className="ml-2 font-semibold text-blue-400">{analysis.profile.followers}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Following:</span>
                      <span className="ml-2 font-semibold text-blue-400">{analysis.profile.following}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700 rounded-xl p-4 flex items-center gap-3">
                  <Star className="w-8 h-8 text-yellow-400" />
                  <div>
                    <div className="text-gray-400 text-sm">Total Stars</div>
                    <div className="text-2xl font-bold">{analysis.statistics.total_stars}</div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-xl p-4 flex items-center gap-3">
                  <GitFork className="w-8 h-8 text-green-400" />
                  <div>
                    <div className="text-gray-400 text-sm">Total Forks</div>
                    <div className="text-2xl font-bold">{analysis.statistics.total_forks}</div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-xl p-4 flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-400" />
                  <div>
                    <div className="text-gray-400 text-sm">Watchers</div>
                    <div className="text-2xl font-bold">{analysis.statistics.total_watchers}</div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-xl p-4 flex items-center gap-3">
                  <Code className="w-8 h-8 text-purple-400" />
                  <div>
                    <div className="text-gray-400 text-sm">Languages</div>
                    <div className="text-2xl font-bold">{Object.keys(analysis.statistics.languages).length}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Repository Analysis */}
            <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Repository Analysis</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-1">Total Repos</div>
                  <div className="text-2xl font-bold">{analysis.repository_analysis.total_repositories}</div>
                </div>
                <div className="bg-gray-700 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-1">With README</div>
                  <div className="text-2xl font-bold text-green-400">{analysis.repository_analysis.repos_with_readme}</div>
                </div>
                <div className="bg-gray-700 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-1">With License</div>
                  <div className="text-2xl font-bold text-blue-400">{analysis.repository_analysis.repos_with_license}</div>
                </div>
                <div className="bg-gray-700 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-1">With Description</div>
                  <div className="text-2xl font-bold text-purple-400">{analysis.repository_analysis.repos_with_description}</div>
                </div>
                <div className="bg-gray-700 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-1">Active Repos</div>
                  <div className="text-2xl font-bold text-yellow-400">{analysis.repository_analysis.active_repos}</div>
                </div>
                <div className="bg-gray-700 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-1">Archived</div>
                  <div className="text-2xl font-bold text-red-400">{analysis.repository_analysis.archived_repos}</div>
                </div>
              </div>
            </div>

            {/* Top Languages */}
            {Object.keys(analysis.statistics.languages).length > 0 && (
              <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6">Top Languages</h2>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(analysis.statistics.languages)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([lang, count]) => (
                      <div
                        key={lang}
                        className="px-4 py-2 bg-gray-700 rounded-lg border border-gray-600"
                      >
                        <span className="font-semibold">{lang}</span>
                        <span className="ml-2 text-gray-400 text-sm">({count})</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}