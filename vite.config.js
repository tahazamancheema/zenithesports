import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // Split chunks
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':    ['react', 'react-dom', 'react-router-dom'],
          'supabase':        ['@supabase/supabase-js'],
          'lucide':          ['lucide-react'],
          'toast':           ['react-hot-toast'],
          'papaparse':       ['papaparse'],
          'particles':       ['@tsparticles/engine', '@tsparticles/react', '@tsparticles/slim'],
        },
      },
    },
    // Warn only for chunks > 1MB
    chunkSizeWarningLimit: 1000,
  },
  // Pre-bundle deps for faster dev startup
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'react-hot-toast',
      '@supabase/supabase-js',
      'papaparse',
    ],
  },
});
