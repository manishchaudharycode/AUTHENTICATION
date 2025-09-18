import { LogIn } from "lucide-react";
import { Page } from "./pages/headerPage"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Contact from "./pages/contect";

function App() {


  return (
     <BrowserRouter>
       <Routes>
        <Route path="/" element={<Page />}  />
        <Route path="/contact" element={<Contact />} /> {/* ✅ add this */}
        <Route path="/Login" element={<LogIn  />}/>
       </Routes>
     
     </BrowserRouter>
  )
}

export default App
