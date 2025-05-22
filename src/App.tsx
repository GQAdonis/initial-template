import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

// Declare invoke function for TypeScript
let invoke: ((cmd: string, args?: any) => Promise<any>) | null = null;
// Fallback invoke function for debugging
let tauriInvoke: ((cmd: string, args?: any) => Promise<any>) | null = null;

// Try to set up Tauri invoke function with detailed logging
try {
  console.log('Initializing Tauri detection...');
  console.log('Window object type:', typeof window);
  
  if (window) {
    console.log('__TAURI__ exists:', !!(window as any).__TAURI__);
    
    if ((window as any).__TAURI__) {
      console.log('__TAURI__ structure:', Object.keys((window as any).__TAURI__));
      
      // Try to find invoke in different possible locations based on Tauri version
      if ((window as any).__TAURI__.invoke) {
        tauriInvoke = (window as any).__TAURI__.invoke;
        invoke = tauriInvoke;
        console.log('Successfully loaded Tauri invoke from window.__TAURI__.invoke');
      } else if ((window as any).__TAURI__.tauri?.invoke) {
        tauriInvoke = (window as any).__TAURI__.tauri.invoke;
        invoke = tauriInvoke;
        console.log('Successfully loaded Tauri invoke from window.__TAURI__.tauri.invoke');
      } else if ((window as any).__TAURI__.core?.invoke) {
        console.log('__TAURI__.core exists:', !!(window as any).__TAURI__.core);
        console.log('__TAURI__.core structure:', Object.keys((window as any).__TAURI__.core));
        tauriInvoke = (window as any).__TAURI__.core.invoke;
        invoke = tauriInvoke;
        console.log('Successfully loaded Tauri invoke from window.__TAURI__.core.invoke');
      } else {
        console.warn('No invoke method found in any of the expected locations:');
        console.warn('- window.__TAURI__.invoke');
        console.warn('- window.__TAURI__.tauri.invoke');
        console.warn('- window.__TAURI__.core.invoke');
      }
    }
  }
} catch (e) {
  console.error('Failed to initialize Tauri invoke:', e);
}

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [isTauri, setIsTauri] = useState(false);
  
  useEffect(() => {
    // Check if we're running in a Tauri environment based on our global tauriInvoke function
    const checkTauri = async () => {
      try {
        // More detailed logging to debug Tauri detection
        console.log('Window object:', typeof window);
        console.log('__TAURI__ object exists:', !!(window as any).__TAURI__);
        console.log('tauriInvoke available:', !!tauriInvoke);
        
        if (tauriInvoke) {
          setIsTauri(true);
          console.log("Running in Tauri environment");
          
          // Test the invoke function with a simple call
          try {
            console.log('Testing invoke with greet command...');
            const testResponse = await tauriInvoke('greet', { name: 'Test' });
            console.log('Test invoke successful:', testResponse);
          } catch (testError) {
            console.error('Test invoke failed:', testError);
          }
        } else {
          setIsTauri(false);
          console.log("Not running in Tauri environment - invoke function not available");
        }
      } catch (error) {
        setIsTauri(false);
        console.log("Error checking Tauri environment:", error);
      }
    };
    
    checkTauri();
  }, []);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    console.log('Greeting with name:', name);
    console.log('isTauri state:', isTauri);
    console.log('tauriInvoke available:', !!tauriInvoke);
    console.log('invoke function available:', !!invoke);
    
    if (!isTauri) {
      // If not running in Tauri, use a fallback greeting
      console.log('Not in Tauri environment, using fallback');
      setGreetMsg(`Hello, ${name}! (Web fallback - not connected to Tauri backend)`);
      return;
    }
    
    try {
      // Try using the invoke function we found
      if (invoke) {
        console.log('Calling invoke("greet", { name }) with name:', name);
        const response = await invoke("greet", { name });
        console.log('Response from greet command:', response);
        
        // Handle the structured response from Rust
        if (typeof response === 'object' && response !== null && 'message' in response) {
          console.log('Structured response detected, extracting message field');
          setGreetMsg((response as { message: string }).message);
        } else {
          console.log('Direct string response detected');
          setGreetMsg(response as string);
        }
      } else {
        throw new Error('No invoke method available');
      }
    } catch (error: any) { // Use any type for error to access message property
      console.error('Error invoking greet command:', error);
      setGreetMsg(`Error: ${error?.message || 'Unknown error'}`);
    }
  }

  return (
      <main className="container">
        <h1>Welcome to Tauri + React</h1>

        <div className="row">
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank" rel="noopener noreferrer">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
        <p>{greetMsg}</p>
      </main>
  
  );
}

export default App;
