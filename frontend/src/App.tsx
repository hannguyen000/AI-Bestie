import { useState } from 'react';

function App() {
  const [userAvatar] = useState("https://ymivxyrrshkpyyrkndgu.supabase.co/storage/v1/object/public/user-avatars/default_avatar.png");
  const [currentIndex, setCurrentIndex] = useState(0);

  const AURA_LIST = [
    { id: 1, name: "HEALER", image: "https://ymivxyrrshkpyyrkndgu.supabase.co/storage/v1/object/public/system-assets/aura_healer.png" },
    { id: 2, name: "MENTOR", image: "https://ymivxyrrshkpyyrkndgu.supabase.co/storage/v1/object/public/system-assets/aura_mentor.png" },
    { id: 3, name: "SUNSHINE", image: "https://ymivxyrrshkpyyrkndgu.supabase.co/storage/v1/object/public/system-assets/aura_sunshine.png" }
  ];

  const nextAura = () => {
    setCurrentIndex((prev) => (prev + 1) % AURA_LIST.length);
  };

  const prevAura = () => {
    setCurrentIndex((prev) => (prev - 1 + AURA_LIST.length) % AURA_LIST.length);
  };

  const currentAura = AURA_LIST[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 p-8 flex flex-col items-center justify-center relative">
      
      {/* 1. User Profile  */}
      <div className="absolute top-4 right-4">
        <img src={userAvatar} alt="user" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
      </div>

      <h1 className="text-2xl font-bold text-purple-400 mb-8 tracking-widest">SELECT YOUR AURA</h1>

      {/* 2. Aura Selection Card */}
      <div className="flex items-center gap-4">
        
        <button 
          onClick={prevAura} 
          className="w-10 h-10 flex items-center justify-center bg-white/50 rounded-full text-purple-500 font-bold hover:bg-white transition shadow-md"
        >
          {"<"}
        </button>

        {/* Main Cards */}
        <div className="bg-white/50 backdrop-blur-md p-8 rounded-[40px] shadow-xl w-72 text-center border border-white/20">
          <img 
            src={currentAura.image} 
            alt={currentAura.name} 
            className="mx-auto w-40 h-40 object-contain drop-shadow-lg transition-all duration-500" 
          />
          <h2 className="text-xl font-bold mt-6 text-gray-700 tracking-wider">{currentAura.name}</h2>
          
          <button 
            onClick={() => alert(`Đã chốt chọn: ${currentAura.name}`)}
            className="mt-6 bg-pink-300 text-white px-8 py-2 rounded-full hover:bg-pink-400 transition shadow-lg font-medium"
          >
            Select This Aura
          </button>
        </div>

        <button 
          onClick={nextAura} 
          className="w-10 h-10 flex items-center justify-center bg-white/50 rounded-full text-purple-500 font-bold hover:bg-white transition shadow-md"
        >
          {">"}
        </button>
      </div>

      {/* Index Dots */}
      <div className="flex gap-2 mt-6">
        {AURA_LIST.map((_, index) => (
          <div 
            key={index} 
            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-6 bg-purple-400' : 'w-1.5 bg-purple-200'}`} 
          />
        ))}
      </div>
    </div>
  );
}

export default App;