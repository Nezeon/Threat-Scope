import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ActorTracking from './pages/ActorTracking';
import ThreatChat from './pages/ThreatChat';
import LiveFeed from './pages/LiveFeed';

import { ActorProvider } from './context/ActorContext';

function App() {
  return (
    <ActorProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ActorTracking />} />
            <Route path="chat" element={<ThreatChat />} />
            <Route path="feed" element={<LiveFeed />} />
            <Route path="*" element={<ActorTracking />} />
          </Route>
        </Routes>
      </Router>
    </ActorProvider>
  );
}

export default App;
