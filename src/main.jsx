import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App.jsx'

// Configurando o tema personalizado do Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#b69348ff', // blanca escuro
      light: '#fbf2e2ff', // blanca claro
    },
    background: {
      default: '#f5f5f5', // gray.50 equivalente
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
