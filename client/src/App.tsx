import { ThemeProvider } from "./components/theme-provider";
import { Navbar } from "./components/navbar/navbar.tsx";
import { BrowserRouter, Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import { Home } from "./pages/home.tsx";
import { Search } from "./components/search/search.tsx";
import UploadPage from "./pages/VideoUploadPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<Search />} path="/search" />
          <Route element={<UploadPage />} path="/videos" />
          <Route element={<LoginPage />} path="/sigin" />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors />
    </ThemeProvider>
  );
}

export default App;
