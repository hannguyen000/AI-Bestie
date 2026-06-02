import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import AppLayout from "../layouts/appLayout"; 
import { 
  PASTE_COLORS 
} from "../config/auraConfig";

export default function Health() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <AppLayout>
      <div className="relative h-full w-full overflow-y-auto pb-20">
        {/* Blurred Background Layer */}
        <div 
          className="absolute inset-0 z-0 opacity-50"
          style={{
            backgroundColor: PASTE_COLORS[profile?.aura_id] || PASTE_COLORS.healer,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 1.0
          }}
        />
      </div>
    </AppLayout>
  );
}
