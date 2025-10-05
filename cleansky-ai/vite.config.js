import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Correct import

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Keep only Babel-specific plugins here
      babel: {
        plugins: [
          ['babel-plugin-react-compiler'] // This is correct for Babel plugins
        ],
      },
    }),
  ],
  
})