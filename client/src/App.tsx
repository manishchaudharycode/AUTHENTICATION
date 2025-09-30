import { ThemeProvider } from "./components/theme-provider";
import {Navbar} from "./components/navbar/navbar.tsx";
import { BrowserRouter, Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import { Home } from "./pages/home.tsx";
import {Search} from "./components/search/search.tsx";
import { PlayingVideo } from "./components/playingVideo/playingVideo.tsx";

function App() {
  
  
  return (
    <ThemeProvider>
      <BrowserRouter>
      <Navbar />
      <Routes >
         <Route element={<Home />} path="/" />
         <Route element={<Search />} path="/search/:news" />
         <Route element={<PlayingVideo />} path="/video/:id" />
      </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
