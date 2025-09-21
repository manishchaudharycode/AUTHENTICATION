import { ThemeProvider } from "./components/theme-provider";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginForm";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route element={<LoginPage />} path="/login" />
          <Route element={<SignupPage />} path="/signup" />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
