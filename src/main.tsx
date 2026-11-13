import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
import './styles.css';

const theme = createTheme({});

const rootEl = document.getElementById('root');

if (!rootEl) throw new Error('Failed to find the root element');

createRoot(rootEl).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StrictMode>

  </BrowserRouter>
);
