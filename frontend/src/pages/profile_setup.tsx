import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import { updateProfile } from "../services/profileService";
import { Sparkles, Spinner, ErrorMessage } from "../components/illusttration";
import { STYLES } from "../components/styles";

const parseStyles = (raw: any): string[] => {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    weight: "0",
    height: "0",
    age: "0",
    styles: [] as string[],
  });

  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async () => {
    setError(null);

    if (!formData.weight || parseFloat(formData.weight) <= 0) {
    setError("Please enter a valid weight.");
    return;
    }
    if (!formData.height || parseFloat(formData.height) <= 0) {
        setError("Please enter a valid height.");
        return;
    }
    if (!formData.age || parseFloat(formData.age) <= 0) {
        setError("Please enter a valid age.");
        return;
    }
    if (formData.styles.length === 0) {
        setError("Please select at least one style!");
        return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Please log in to continue");
        return;
      }

      await updateProfile(user.id, {
        weight: formData.weight,
        height: formData.height,
        age: formData.age,
        styles: formData.styles,
      });

      navigate("/period-setup");
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError("Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

    const handleInputChange = (field: string, value: string) => {
    let processedValue = value;

    if (field === 'age') {
        //just allow numbers for age
        processedValue = value.replace(/[^0-9]/g, '');
    } else {
        // for weight and height, allow numbers with at most one decimal point
        const regex = /^\d*\.?\d{0,1}$/;
        if (!regex.test(value)) return;
        processedValue = value;
    }

    setFormData({
        ...formData,
        [field]: processedValue === "0" ? "" : processedValue, 
    });
    };

    const adjustValue = (field: "weight" | "height" | "age", increment: number) => {
    const currentVal = parseFloat(formData[field] || "0");
    const newVal = Math.max(0, currentVal + increment);
    
    const formattedVal = field === 'age' 
        ? Math.floor(newVal).toString() 
        : newVal.toFixed(1);

    setFormData({
        ...formData,
        [field]: formattedVal,
    });
    };

    const toggleStyle = (styleName: string) => {
        setFormData(prev => {
            const isSelected = prev.styles.includes(styleName);
            
            if (isSelected) {
            return { ...prev, styles: prev.styles.filter(s => s !== styleName) };
            }
            
            if (prev.styles.length < 5) {
            return { ...prev, styles: [...prev.styles, styleName] };
            }

            return prev;
        });
    };

    useEffect(() => {
      (async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("profiles")
          .select("weight, height, age, styles")
          .eq("id", user.id)
          .single();

        if (data) {
          setFormData({
            weight: data.weight != null ? String(data.weight) : "",
            height: data.height != null ? String(data.height) : "",
            age: data.age != null ? String(data.age) : "",
            styles: parseStyles(data.styles),
          });
        }
      })();
    }, []);

  return (
    <div className="relative flex flex-col h-full overflow-y-auto overflow-x-hidden p-6 bg-linear-to-br from-[#FFF7FA] to-[#F1F9FD]">
      {/* Background blobs */}
      <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-50 bg-[radial-gradient(circle,#DDD5F7,transparent_70%)] animate-float" />
      <div className="absolute bottom-0 -left-16 w-48 h-48 rounded-full opacity-40 bg-[radial-gradient(circle,#F7C5D8,transparent_70%)] animate-float animation-delay-500" />
      
      <Sparkles />

      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <div className="text-center mb-2">
          <h2 className="font-display font-black text-3xl text-aura-pink-dark mb-1">
            Setup your profile
          </h2>
        </div>

        {/* Input Card */}
        <div className="glass-card pr-5 pl-5 flex-1 space-y-1 text-center mb-5">
          <p className="text-sm font-body text-gray-500 uppercase tracking-widest pt-5 text-center">
            Personal Information
          </p>
          <GradientNumberInput 
            label="Weight"
            unit="kg" 
            value={formData.weight} 
            onInputChange={(v) => handleInputChange('weight', v)}
            onAdjust={(inc) => adjustValue('weight', inc)}
          />
          <GradientNumberInput 
            label="Height"
            unit="cm" 
            value={formData.height} 
            onInputChange={(v) => handleInputChange('height', v)}
            onAdjust={(inc) => adjustValue('height', inc)}
          />
          <GradientNumberInput 
            label="Age"
            unit="" 
            value={formData.age.toString()} 
            onInputChange={(v) => handleInputChange('age', v)}
            onAdjust={(inc) => adjustValue('age', inc)}
          />
        </div>

        {/* Input Card */}
        <div className="glass-card p-2 flex-1 space-y-1 mb-5">
        <div className="mb-8">
            <p className="font-bold text-gray-700 mb-3 uppercase text-xs"></p>
            <p className="text-sm font-body text-gray-500 uppercase tracking-widest p-2 text-center">
            Favorite Styles (Select Multiple)
            </p>

            <div className="flex flex-wrap gap-2.5 pr-2 pl-3">
            {STYLES.map((styleObj) => {
                const isSelected = formData.styles.includes(styleObj.name);
                return (
                <button
                    key={styleObj.name}
                    type="button"
                    onClick={() => toggleStyle(styleObj.name)}
                    disabled={formData.styles.length >= 5 && !isSelected}
                    className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-300 flex items-center gap-2 
                    ${isSelected 
                        ? `${styleObj.bg} ${styleObj.text} border-current shadow-md scale-105` 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }
                    ${formData.styles.length >= 5 && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    <span>{styleObj.emoji}</span>
                    {styleObj.name}
                </button>
                );
            })}
            </div>
        </div>
        </div>
        
        <div className="mt-4 mb-4">
           <ErrorMessage message={error} />
        </div>
        {/* Submit Button */}
        <button
            onClick={handleUpdate}
            disabled={loading}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <><Spinner /> Saving...</> : "Complete Profile"}
        </button>
      </div>
    </div>
  );
}

interface GradientNumberInputProps {
  label: string;
  unit: string;
  value: string;
  onInputChange: (value: string) => void;
  onAdjust: (increment: number) => void;
}

function GradientNumberInput({ label, unit, value, onInputChange, onAdjust }: GradientNumberInputProps) {
  return (
    <div className="bg-white/70 p-3 rounded-3xl border border-white/50 bg-linear-to-r from-purple-50 to-pink-50 flex items-center shadow-inner relative group mb-3">
      <div className="relative z-10 flex-col mr-4 w-16">
        <p className="text-sm font-semibold text-gray-500 mb-1">{label}</p>
        <p className="text-xs font-body text-gray-400">{unit}</p>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-end">
        <input 
          type="text" 
          inputMode="decimal"
          value={value} 
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="0"
          className="w-full text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-pink-300 to-purple-400 text-right bg-transparent outline-none p-0 pr-4"
        />
        
        <div className="flex flex-col gap-2 ml-2">
          <button 
            type="button"
            className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-gray-600 flex items-center justify-center text-xl shadow" 
            onClick={() => onAdjust(label === "Age" ? 1 : 1)}
          >+</button>
          <button 
            type="button"
            className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-gray-600 flex items-center justify-center text-xl shadow" 
            onClick={() => onAdjust(label === "Age" ? -1 : -1)}
          >-</button>
        </div>
      </div>
    </div>
  );
}