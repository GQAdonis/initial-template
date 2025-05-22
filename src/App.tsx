import { useState } from "react";
import ChatLayout from "./components/ChatLayout";
import { ThemeProvider } from "./components/ThemeProvider";
import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <ChatLayout />
    </ThemeProvider>
  );
}

export default App;