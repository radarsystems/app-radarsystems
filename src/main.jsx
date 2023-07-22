import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './Context/AuthContext.jsx'
import { WizardProvider } from './Context/WizardContext.jsx'
import { AppProvider } from './Context/AppContext.jsx'
import { TitleProvider } from './Context/TitleContext.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <WizardProvider>
        <AppProvider>
          <TitleProvider>
            <App />
          </TitleProvider>
        </AppProvider>
      </WizardProvider>
    </AuthProvider>

  </React.StrictMode>,
)
