
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create root with the React 18 API
const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
