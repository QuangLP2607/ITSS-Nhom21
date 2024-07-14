import { createRoot } from 'react-dom/client';
import React from 'react';
import { HashRouter } from 'react-router-dom'; 
import { App } from './App';
import { UserIdProvider, GroupIdProvider } from './components/context/UserIdAndGroupIdContext';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HashRouter>
    <UserIdProvider>
      <GroupIdProvider>
          <App />
      </GroupIdProvider>
    </UserIdProvider>
    </HashRouter>
  </React.StrictMode>
);
