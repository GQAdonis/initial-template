import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

const host = process.env.TAURI_DEV_HOST;
const isTauri = process.env.TAURI_PLATFORM !== undefined;
const isCapacitor = process.env.CAPACITOR_PLATFORM !== undefined;
const isIOS = process.env.CAPACITOR_PLATFORM === 'ios';
const isAndroid = process.env.CAPACITOR_PLATFORM === 'android';
const isAxum = process.env.BUILD_TARGET === 'axum';
const customOutDir = process.env.VITE_OUT_DIR;

export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],

  envPrefix: ['VITE_', 'TAURI_', 'CAPACITOR_'],

  clearScreen: false,
  
  build: {
    target: isTauri ? 'chrome105' :
            isIOS ? 'safari14' :
            isAndroid ? 'chrome87' :
            'esnext',
    
    minify: (!process.env.TAURI_DEBUG && !process.env.CAPACITOR_DEBUG) ? 'esbuild' : false,
    
    sourcemap: !!process.env.TAURI_DEBUG || !!process.env.CAPACITOR_DEBUG,
    
    outDir: customOutDir || (isAxum ? 'app/webserver/dist' : 'dist'),
    
    assetsDir: 'assets',
    
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'tauri-api': isTauri ? ['@tauri-apps/api'] : [],
          'capacitor-api': isCapacitor ? ['@capacitor/core'] : []
        }
      }
    }
  },
  
  server: {
    port: 4321,
    strictPort: true,
    host: host || (isCapacitor ? '0.0.0.0' : false),
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 4322,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**", "**/ios/**", "**/android/**"],
    },
  },
  
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@powersync/web > js-logger'
    ],
    exclude: isTauri ? ['@tauri-apps/api', '@journeyapps/wa-sqlite', '@powersync/web'] :
             isCapacitor ? ['@capacitor/core', '@journeyapps/wa-sqlite', '@powersync/web'] : []
  },
  
  worker: {
    format: 'es'
  }
});
