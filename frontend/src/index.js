import { createRoot } from 'react-dom/client';
import React from 'react';
import { BrowserRouter } from 'react-router-dom'; 
import { App } from './App';
import { UserIdProvider, GroupIdProvider } from './components/context/UserIdAndGroupIdContext';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <UserIdProvider>
      <GroupIdProvider>
        <BrowserRouter> {/* Hoặc HashRouter */}
          <App />
        </BrowserRouter>
      </GroupIdProvider>
    </UserIdProvider>
  </React.StrictMode>
);
