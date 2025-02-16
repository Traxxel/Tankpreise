import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { DEVEXPRESS_LICENSE_KEY } from './config/devexpress-license'

// DevExpress Lizenz registrieren
import config from 'devextreme/core/config';
config({ licenseKey: DEVEXPRESS_LICENSE_KEY });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 