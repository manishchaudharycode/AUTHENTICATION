import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter, Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import UploadPage from "./pages/VideoUploadPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import { Toaster } from "sonner";
import Layout from "./components/Layout.tsx";
import Profile from "./pages/Profile.tsx";
import Library from "./pages/Library.tsx";
import Short from "./pages/Short.tsx";
import Subscription from "./pages/Subscription.tsx";
import VideoPlayer from "./pages/home/VideoPlayer.tsx"; 
import { Home } from "./pages/home/home.tsx";



function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home/>} /> 
            <Route path="/signin" element={<LoginPage/>} />      
            <Route element={<UploadPage />} path="/video" />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/library" element={<Library/>}/>
            <Route path="/shorts" element={<Short/>}/>
            <Route path="/subscriptions" element={<Subscription/>}/>
            <Route path="/:videoId" element={<VideoPlayer/>}/>
          </Routes>
        </Layout>
      </BrowserRouter>
      <Toaster richColors />
    </ThemeProvider>
  );
}

export default App;
