import React, {useState} from "react";
import { Heart } from 'lucide-react';

export default function App() {
    // State Variables
    const [healthStatus, setHealthStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    // Fuction to check the backend health API
    const checkHealth = async() => {
        setLoading(true);
        setError('');

        try {
            // call the backend API
            const response = await fetch('http://localhost/health');
            const data = await response.json();

            setHealthStatus(data);
        } catch (err) {
            setError('Failed to connect to backend');
        } finally {
            setLoading(false);
        }
        
    };

    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            GitHub Optimizer - Health Check
          </h1>
          <p className="text-gray-400">
            Testing backend connection
          </p>
        </div>

        {/* Button to check health */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
          <button
            onClick={checkHealth}
            disabled={loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5" />
            {loading ? 'Checking...' : 'Check Backend Health'}
          </button>

          {/* Display error */}
          {error && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-500 rounded-xl text-red-200">
              {error}
            </div>
          )}

          {/* Display health status */}
          {healthStatus && (
            <div className="mt-4 p-6 bg-green-900/30 border border-green-500 rounded-xl">
              <h3 className="text-xl font-bold text-green-400 mb-2">
                Backend is Healthy! ✅
              </h3>
              <div className="text-gray-300">
                <p><strong>Status:</strong> {healthStatus.status}</p>
                <p><strong>Service:</strong> {healthStatus.service}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}