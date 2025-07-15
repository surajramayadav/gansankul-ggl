import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy load all pages 
const Dashboard = lazy(() => import('./pages/d1'));
const ConfigPage = lazy(() => import('./pages/config'));
// Loading component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#666'
  }}>
    Loading...
  </div>
);

function App() {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: 'transparent', // transparent outer
        display: 'flex', 
        justifyContent: 'center',
      }}
    >
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes> 
            <Route path="/" element={<Dashboard />} />
            <Route path="/config" element={<ConfigPage />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;