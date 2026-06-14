import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./routes/routes";

import { AuthProvider } from "./context/AuthContext"; 

import Splash from "./pages/splash";
import Login from "./pages/login";
import Register from "./pages/register";
import ChooseAura from "./pages/choose_aura";
import Home from "./pages/home";
import ProfileSetup from "./pages/profile_setup";
import Profile from "./pages/profile";
import GlowUp from "./pages/glow_up";
import Health from "./pages/health";
import Closet from "./pages/closet";
import PeriodSetup from "./pages/period_setup";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="h-dvh w-full bg-linear-to-br from-pink-100 via-blue-100 to-purple-100 overflow-hidden flex flex-col">
          <Routes>
            <Route path={ROUTES.SPLASH} element={<Splash />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route path={ROUTES.AURA_SELECTION} element={<ChooseAura />} />
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.PROFILE_SETUP} element={<ProfileSetup />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path="*" element={<Splash />} />
            <Route path={ROUTES.GLOW_UP} element={<GlowUp />} />
            <Route path={ROUTES.HEALTH} element={<Health />} />
            <Route path={ROUTES.CLOSET} element={<Closet />} />
            <Route path={ROUTES.PERIOD_SETUP} element={<PeriodSetup />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
