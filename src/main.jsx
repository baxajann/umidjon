import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { seedData } from './utils/mockData.js'

// Force re-seed with UZS prices (clears old seeded flag)
localStorage.removeItem('pm_seeded')
seedData()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
