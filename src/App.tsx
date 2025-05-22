import { ThemeProvider } from "./components/ThemeProvider";
import ChatLayout from "./components/ChatLayout";
import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <ChatLayout />
    </ThemeProvider>
  );
}

export default App;