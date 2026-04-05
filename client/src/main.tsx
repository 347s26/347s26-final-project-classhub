import { createRoot } from 'react-dom/client'
import './scss/index.scss'
import App from './App.tsx'
import './scss/override.scss'
import { BrowserRouter } from "react-router";

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
