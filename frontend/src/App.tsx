import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./routes/routes";

// Import AuthProvider từ đúng thư mục context của bạn
import { AuthProvider } from "./context/AuthContext"; 

import Splash from "./pages/splash";
import Login from "./pages/login";
import Register from "./pages/register";
import ChooseAura from "./pages/choose_aura";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 p-4 md:p-8 flex items-center justify-center">
          <div className="phone-shell relative w-full max-w-[402px] h-[812px] bg-white rounded-[48px] shadow-[0_24px_60px_rgba(0,0,0,0.15)] border-[10px] border-white overflow-hidden flex flex-col">
            <Routes>
              <Route path={ROUTES.SPLASH} element={<Splash />} />
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.REGISTER} element={<Register />} />
              <Route path={ROUTES.AURA_SELECTION} element={<ChooseAura />} />
              <Route
                path={ROUTES.HOME}
                element={<div className="p-6"> AI Bestie 🌸</div>}
              />
            </Routes>
          </div>
        </div>

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;