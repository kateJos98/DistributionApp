
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy para API REST
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // Proxy para WebSockets
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true,
        changeOrigin: true
      },
      // Microservicios específicos
      '/auth': {
        target: 'http://localhost:8001',
        changeOrigin: true
      },
      '/create-customer': {
        target: 'http://localhost:8003',
        changeOrigin: true
      },
      '/update-location': {
        target: 'http://localhost:8006',
        changeOrigin: true
      },
      '/view-customer': {
        target: 'http://localhost:8005',
        changeOrigin: true
      },
      '/update-customer': {
        target: 'http://localhost:8010',
        changeOrigin: true
      }
    }
  },
  // Configuración para variables de entorno
  define: {
    'process.env': {}
  },
  // Opcional: Configuración de alias para imports
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@hooks': path.resolve(__dirname, 'src/hooks')
    }
  }
});