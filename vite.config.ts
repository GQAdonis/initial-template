import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;
// @ts-expect-error process is a nodejs global
const isTauri = process.env.TAURI_PLATFORM !== undefined;
// @ts-expect-error process is a nodejs global
const isCapacitor = process.env.CAPACITOR_PLATFORM !== undefined;
// @ts-expect-error process is a nodejs global
const isIOS = process.env.CAPACITOR_PLATFORM === 'ios';
// @ts-expect-error process is a nodejs global
const isAndroid = process.env.CAPACITOR_PLATFORM === 'android';
// @ts-expect-error process is a nodejs global
const isAxum = process.env.BUILD_TARGET === 'axum';
// @ts-expect-error process is a nodejs global
const customOutDir = process.env.VITE_OUT_DIR;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],

  // Allow environment variables prefixed with VITE_, TAURI_, or CAPACITOR_
  envPrefix: ['VITE_', 'TAURI_', 'CAPACITOR_'],

  // Prevent vite from obscuring errors
  clearScreen: false,
  
  // Platform-specific build targets
  build: {
    // Set appropriate build targets based on platform
    target: isTauri ? 'chrome105' :
            isIOS ? 'safari14' :
            isAndroid ? 'chrome87' :
            'esnext',
    
    // Don't minify for debug builds
    minify: (!process.env.TAURI_DEBUG && !process.env.CAPACITOR_DEBUG) ? 'esbuild' : false,
    
    // Produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG || !!process.env.CAPACITOR_DEBUG,
    
    // Output configuration - use custom directory if specified, otherwise default to 'dist'
    outDir: customOutDir || (isAxum ? 'app/webserver/dist' : 'dist'),
    
    // Ensure assets are properly handled
    assetsDir: 'assets',
    
    // Rollup options
    rollupOptions: {
      output: {
        // Ensure proper chunking
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'tauri-api': isTauri ? ['@tauri-apps/api'] : [],
          'capacitor-api': isCapacitor ? ['@capacitor/core'] : []
        }
      }
    }
  },
  
  // Server configuration
  server: {
    port: 4321,
    strictPort: true,
    host: host || (isCapacitor ? '0.0.0.0' : false), // Use 0.0.0.0 for Capacitor to allow external access
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 4322,
        }
      : undefined,
    watch: {
      // Tell vite to ignore watching platform-specific directories
      ignored: ["**/src-tauri/**", "**/ios/**", "**/android/**"],
    },
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      // Add any path aliases here if needed
      '@': '/src',
    },
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom'
    ],
    // Exclude platform-specific dependencies from optimization
    exclude: isTauri ? ['@tauri-apps/api'] :
             isCapacitor ? ['@capacitor/core'] : []
  }
}));
