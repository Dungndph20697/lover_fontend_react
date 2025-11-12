import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Đảm bảo chạy trên port 5173
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Keep /api prefix
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('❌ Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('📤 Proxying Request:', req.method, req.url);
            console.log('📋 Request Headers:', {
              origin: req.headers.origin,
              host: req.headers.host,
              'content-type': req.headers['content-type'],
              'authorization': req.headers.authorization ? 'Bearer ***' : 'No auth'
            });
            
            // KHÔNG remove origin header - để backend kiểm tra CORS đúng cách
            // Backend đã được cấu hình để accept origin từ http://localhost:5173
            // Vì vậy chúng ta cần giữ nguyên origin header để backend có thể validate
            
            // Log final headers being sent to backend
            console.log('📤 Headers sent to backend:', {
              host: proxyReq.getHeader('host'),
              origin: proxyReq.getHeader('origin') || 'No origin header',
              'content-type': proxyReq.getHeader('content-type'),
              'authorization': proxyReq.getHeader('authorization') ? 'Bearer ***' : 'No auth'
            });
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('📥 Proxy Response:', proxyRes.statusCode, req.method, req.url);
            console.log('📋 Response Headers:', {
              'access-control-allow-origin': proxyRes.headers['access-control-allow-origin'],
              'access-control-allow-credentials': proxyRes.headers['access-control-allow-credentials']
            });
            
            if (proxyRes.statusCode === 403) {
              console.log('⚠️ 403 Forbidden - Backend rejected request');
              console.log('💡 Possible causes:');
              console.log('   1. CORS origin not allowed');
              console.log('   2. Invalid or missing token');
              console.log('   3. Backend security filter blocking request');
            }
          });
        },
      },
    },
  },
})
