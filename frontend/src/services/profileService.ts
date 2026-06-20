import { supabase } from "../config/supabase";

export async function updateProfile(userId: string, data: any) {
  const { data: updatedData, error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId)
    .select(); 

  if (error) {
    console.error("Supabase Error:", error);
    throw error; 
  }
  return updatedData;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
    
  if (error) throw error;
  return data;
}