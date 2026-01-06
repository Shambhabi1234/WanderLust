import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Make sure this contains your Tailwind directives
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* The App component contains your BrowserRouter and Layout, 
      enabling the sticky CategoriesNav and functional filtering 
     .
    */}
    <App />
  </React.StrictMode>
);

// Performance measurement
reportWebVitals();