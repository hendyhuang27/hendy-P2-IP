// src/components/MusicTest.jsx - TEST COMPONENT
import React, { useState, useEffect } from 'react';
import musicService from '../services/musicService';

const MusicTest = () => {
    const [chartData, setChartData] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('eminem');

    // Test chart API
    const testChart = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('🧪 Testing chart API...');
            const data = await musicService.getChart();
            setChartData(data);
            console.log('✅ Chart test success:', data);
        } catch (err) {
            console.error('❌ Chart test failed:', err);
            setError(`Chart Error: ${err.response?.data?.message || err.message}`);
        }
        setLoading(false);
    };

    // Test search API
    const testSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('🧪 Testing search API with query:', searchQuery);
            const data = await musicService.searchMusic(searchQuery);
            setSearchResults(data);
            console.log('✅ Search test success:', data);
        } catch (err) {
            console.error('❌ Search test failed:', err);
            setError(`Search Error: ${err.response?.data?.message || err.message}`);
        }
        setLoading(false);
    };

    // Test on component mount
    useEffect(() => {
        testChart();
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>🧪 Music API Test</h2>

            {loading && <p>⏳ Loading...</p>}
            {error && <p style={{ color: 'red' }}>❌ {error}</p>}

            {/* Chart Test */}
            <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>📊 Chart Test</h3>
                <button onClick={testChart} disabled={loading}>
                    Test Chart API
                </button>

                {chartData && (
                    <div style={{ marginTop: '10px' }}>
                        <p><strong>Chart Data:</strong></p>
                        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
                            {JSON.stringify(chartData, null, 2)}
                        </pre>

                        {chartData.data && Array.isArray(chartData.data) && (
                            <div>
                                <p><strong>Songs Found: {chartData.data.length}</strong></p>
                                {chartData.data.slice(0, 3).map((song, index) => (
                                    <div key={index} style={{ margin: '10px 0', padding: '10px', background: '#f9f9f9' }}>
                                        <p><strong>{song.title}</strong> by {song.artist?.name}</p>
                                        <p>Duration: {song.duration}s</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Search Test */}
            <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>🔍 Search Test</h3>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter search query"
                        style={{ padding: '8px', marginRight: '10px', width: '200px' }}
                    />
                    <button onClick={testSearch} disabled={loading}>
                        Test Search API
                    </button>
                </div>

                {searchResults && (
                    <div style={{ marginTop: '10px' }}>
                        <p><strong>Search Results:</strong></p>
                        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
                            {JSON.stringify(searchResults, null, 2)}
                        </pre>

                        {searchResults.data && Array.isArray(searchResults.data) && (
                            <div>
                                <p><strong>Songs Found: {searchResults.data.length}</strong></p>
                                {searchResults.data.slice(0, 3).map((song, index) => (
                                    <div key={index} style={{ margin: '10px 0', padding: '10px', background: '#f9f9f9' }}>
                                        <p><strong>{song.title}</strong> by {song.artist?.name}</p>
                                        <p>Duration: {song.duration}s</p>
                                        <p>Preview: {song.preview ? '✅' : '❌'}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* API Endpoints Info */}
            <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', background: '#f0f8ff' }}>
                <h3>🔗 API Endpoints Being Tested</h3>
                <ul>
                    <li><code>GET /api/music/chart</code></li>
                    <li><code>GET /api/music/search?q={searchQuery}</code></li>
                </ul>
                <p><strong>Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}</p>
            </div>
        </div>
    );
};

export default MusicTest;