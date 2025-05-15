import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/react" 
import App from './App.jsx'

// Configurando o tema personalizado
const theme = extendTheme({
  colors: {
    blanca_escuro: {
      500: 'var(--color-blanca-escuro)',
    },
    blanca_claro: {
      500: 'var(--color-blanca-claro)',
    },
  },
  styles: {
    global: {
      ':root': {
        '--color-blanca-escuro': '#b69348ff',
        '--color-blanca-claro': '#fbf2e2ff',
      },
      body: {
        bg: 'gray.50',
      },
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>,
)
