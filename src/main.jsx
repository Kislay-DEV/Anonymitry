import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/authContext.jsx'
import { MessageProvider } from './context/MessagesContext'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <AuthProvider>
        <MessageProvider>
            <App />
        </MessageProvider>
      </AuthProvider>
    </BrowserRouter>
  ,
)
