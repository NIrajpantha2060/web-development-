import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Test configuration for Vitest
  test: {
    // Use jsdom environment for React component testing
    environment: 'jsdom',
    
    // Enable global test functions (describe, it, expect, etc.)
    globals: true,
    
    // Setup files to run before tests
    setupFiles: './src/test/setup.js',
    
    // Include patterns for test files
    include: ['src/**/*.{test,spec}.{js,jsx}', 'src/__tests__/**/*.{js,jsx}'],
    
    // Exclude patterns
    exclude: ['node_modules', 'dist'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{js,jsx}',
        '**/*.spec.{js,jsx}'
      ]
    },
    
    // CSS handling
    css: true
  }
})
