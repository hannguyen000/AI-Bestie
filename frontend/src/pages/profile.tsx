import { Pencil, Droplets } from "lucide-react";
import AppLayout from "../layouts/appLayout";
import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

import { 
  CHARACTER_IMAGES_WITHOUT_BG, 
  CHARACTER_BACKGROUNDS,
  PASTE_COLORS,
} from "../config/auraConfig";

export default function Profile() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const bmi = profile?.weight && profile?.height 
    ? ((profile.weight / ((profile.height / 100) ** 2))).toFixed(1) 
    : "0.0";
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
    async function fetchData() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data);
        }
        setLoading(false);
    }
    fetchData();
    }, []);
    if (loading) return <div className="flex h-full items-center justify-center">Loading...</div>;

    const handleLogout = async () => {
      try {
        await logout();
        navigate("/login"); 
      } catch (error) {
        alert("Error logging out!");
      }
    };

    // function to handle avatar upload
    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${profile?.id}-${Math.random()}.${fileExt}`;
      const filePath = `user-avatars/${fileName}`;
    

      try {
        setLoading(true);
        // 1. Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('user-avatars')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get public URL of the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('user-avatars')
          .getPublicUrl(filePath);

        // 3. Update user's profile with new avatar URL
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', profile.id);

        if (updateError) throw updateError;

        // 4. Update local state to reflect new avatar immediately
        setProfile({ ...profile, avatar_url: publicUrl });
      } catch (error) {
        alert("Error uploading avatar: " + error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <AppLayout>
    {/* Background */}
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundColor: PASTE_COLORS[profile?.aura_id] || PASTE_COLORS.healer,
      }}
    />
    <main className="flex-1 h-full overflow-y-auto">
    <div className="max-w-3xl overflow-y-auto md:mx-auto">
    <div 
          className="absolute inset-0 z-0" 
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.5 
          }}
    /> 
    <div className="relative z-10 h-full w-full overflow-y-auto">
      {/* 1. Header Avatar & Info */}
      <div className="flex flex-col items-center mb-8">
        {/* Cover Photo */}
        <div 
          className="w-full h-40 bg-linear-to-r from-pink-300 to-purple-400"
          style={{
            backgroundImage: `url('${CHARACTER_BACKGROUNDS[profile?.aura_id] || CHARACTER_BACKGROUNDS.default}')`, 
            backgroundPosition: 'center'
          }}
        />

        {/* Container Avatar above Cover Photo*/}
        <div className="relative -mt-16">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-white overflow-hidden">
            <img 
              src={profile?.avatar_url || CHARACTER_IMAGES_WITHOUT_BG.default} 
              className="w-full h-full object-cover" 
              alt="Avatar"
            />
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow-lg text-pink-500 border border-gray-100">
            <Pencil size={16} />
          </button>
          {/* Input hidden file */}
          <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarUpload} 
              className="hidden" 
              accept="image/*" 
          />
        </div>

        <h2 className="mt-4 text-xl text-gradient-pink font-black text-gray-800">{profile?.username || "Bestie"}</h2>
      </div>
    
        {/* 2. Info Card (BMI Scale) */}
        <div className="glass-card p-6 rounded-3xl shadow-lg mb-6 bg-white/50 mr-5 ml-5">
        <button onClick={() => navigate('/profile-setup')} className="absolute top-2 right-4 p-2 bg-white rounded-full shadow-lg text-pink-500 border border-gray-100 hover:bg-pink-50 transition-colors">
            <Pencil size={16} />
        </button>
            <h3 className="text-xs text-gradient-pink font-bold text-gray-400 uppercase mb-4"> ℹ Info</h3>
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                    { label: "Weight", value: `${profile?.weight || "--"}kg` },
                    { label: "Height", value: `${profile?.height || "--"}cm` },
                    { label: "Age", value: profile?.age || "--" },
                    ].map((item) => (
                    <div key={item.label} className="glass-card p-4 rounded-3xl text-center shadow-lg">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{item.label}</p>
                        <p className="text-lg font-bold text-gray-800">{item.value}</p>
                    </div>
                    ))}
                </div>
            
            <BMIScale bmi={parseFloat(bmi)} />
            <div className="text-center mt-3">
                <p className="font-bold text-gray-700">
                Your BMI is <span className="text-pink-600">{bmi}</span>
                </p>
                <p className={`text-xs font-bold mt-1 ${
                parseFloat(bmi) < 18.5 ? "text-slate-400" :
                parseFloat(bmi) < 25 ? "text-emerald-500" :
                parseFloat(bmi) < 30 ? "text-amber-400" : "text-rose-400"
                }`}>
                {parseFloat(bmi) < 18.5 ? "Underweight" :
                parseFloat(bmi) < 25 ? "Healthy" :
                parseFloat(bmi) < 30 ? "Overweight" : "Obese"}
                </p>
            </div>
        </div>

      {/* 3. Badges & Achievements */}
      <div className="glass-card p-6 rounded-3xl shadow-lg mb-6 mr-5 ml-5 bg-white/50">
        <h3 className="text-xs text-gradient-pink font-bold text-gray-400 uppercase mb-4"> 🏆 Achievements
        </h3>
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Droplets className="text-blue-500" />
            </div>
            <span className="text-[10px] font-bold">Water Warrior</span>
          </div>
          {/* Add more badges here */}
        </div>
      </div>

      {/* 4. Aura Status */}
      <div className="glass-card p-6 rounded-3xl shadow-lg border border-pink-100 bg-white/50 mr-5 ml-5 mb-10">
        <h3 className="text-xs text-gradient-pink font-bold text-gray-400 uppercase mb-4">❤️ Current Aura</h3>
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
                src={CHARACTER_IMAGES_WITHOUT_BG[profile?.aura_id] || CHARACTER_IMAGES_WITHOUT_BG.default} 
                className="w-32 h-40 object-contain drop-shadow-lg -mt-2 -mb-2" 
            />
          </div>
          <div>
            <p className="font-bold text-lg capitalize">{profile?.aura_id}</p>
            <button onClick={() => navigate('/choose-aura')} className="text-xs bg-white px-4 py-1 rounded-full shadow mt-2">Change Aura</button>
          </div>
        </div>
      </div>

      {/* 5. App Settings */}
      <div className="glass-card p-6 rounded-3xl shadow-lg border border-pink-100 bg-white/50 mr-5 ml-5 mb-10">
        <h3 className="text-xs text-gradient-pink font-bold text-gray-400 uppercase mb-4">⚙️ App Settings</h3>
        <div className="space-y-4">
        <button className="flex items-center gap-3 text-sm text-gray-700"><span>🌐</span> Language</button>
        <button className="flex items-center gap-3 text-sm text-gray-700"><span>❓</span> Support & FAQ</button>
        <button className="flex items-center gap-3 text-sm text-gray-700"><span>🔑</span> Account & Security</button>
        
        <button 
          onClick={handleLogout}
          className="w-full mt-4 py-2 bg-white/50 hover:bg-white/80 rounded-full text-sm font-bold text-red-700 shadow transition-all"
        >
          Logout
        </button>
      </div>
      </div>
    </div>
    </div>
    </main>
    </AppLayout>
  );
}

function BMIScale({ bmi }: { bmi: number }) {
    const getStatus = (bmi: number) => {
        if (bmi < 18.5) return { label: "Underweight", color: "text-gray-500" };
        if (bmi < 25) return { label: "Normal", color: "text-green-600" };
        if (bmi < 30) return { label: "Overweight", color: "text-blue-600" };
        return { label: "Obese", color: "text-purple-700" };
    };
    
    // Calculate the position of the indicator based on BMI (assuming BMI range 15-35 for scaling)
    const [currentPos, setCurrentPos] = useState(0);
    // Smoothly animate the indicator to the new position whenever BMI changes
    useEffect(() => {
        const targetPosition = Math.min(Math.max(((bmi - 15) / (35 - 15)) * 100, 0), 100);
        
        const timer = setTimeout(() => {
        setCurrentPos(targetPosition);
        }, 100);

        return () => clearTimeout(timer);
    }, [bmi]); // Re-run animation whenever BMI changes

    const status = getStatus(bmi);

  return (
    <div className="relative">
        <div className="h-3 w-full rounded-full flex overflow-hidden shadow-inner bg-gray-100">
            <div className="bg-slate-200 flex-[0.35]"></div>   {/* Underweight - Soft Gray */}
            <div className="bg-emerald-200 flex-[0.65]"></div>  {/* Healthy - Pastel Green */}
            <div className="bg-amber-200 flex-[0.5]"></div>    {/* Overweight - Pastel Yellow */}
            <div className="bg-rose-200 flex-[0.5]"></div>
        </div>

      {/* Indicator */}
      <div 
        className="absolute top-3 transition-all duration-1000 ease-out" 
        style={{ left: `${currentPos}%` }}
      >
        <div className="flex flex-col items-center -ml-3">
          <span className={`${status.color} text-[10px]`}>▲</span>        
        </div>
      </div>
    </div>
  );
}
