import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { apiService } from './services/api';

function App() {

  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testApi = async () => {
    try {
      // Call the test endpoint from your TestController
      const response = await apiService.get<{ message: string }>('api/test');
      setApiMessage(response.message);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to API');
      setApiMessage(null);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload. Wahoo!
        </p>

        {/* Button to test API connection */}
        <button onClick={testApi} style={{ margin: '20px 0' }}>
          Test API Connection
        </button>
        
        {/* Display API response or error */}
        {apiMessage && <p>API Response: {apiMessage}</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
