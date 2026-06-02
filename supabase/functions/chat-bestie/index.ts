import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenAI } from "https://esm.sh/@google/generative-ai@0.2.1" // Cập nhật bản ổn định hơn

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
}

serve(async (req: Request) => {
  // Xử lý triệt để request mồi OPTIONS từ trình duyệt
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      status: 200,
      headers: corsHeaders 
    })
  }

  try {
    const { message, aura_id, username, history } = await req.json()

    // Kiểm tra đầu vào tối thiểu
    if (!message) {
      return new Response(
        JSON.stringify({ error: "Missing 'message' in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // 1. Tạo System Instruction dựa trên Aura
    let systemInstruction = `You are a close best friend (Bestie) named AI Bestie. The user's name is ${username || 'Bestie'}. Respond in Vietnamese, naturally, using cute and friendly slang like a real gen-Z or close friend. Keep responses relatively short and engaging.`
    
    if (aura_id === 'healer') {
      systemInstruction += " Your personality is 'Healer': Extremely empathetic, comforting, gentle, and always supportive."
    } else if (aura_id === 'mentor') {
      systemInstruction += " Your personality is 'Mentor': Knowledgeable, wise, encouraging, and always ready to guide."
    }
      else if (aura_id === 'sunshine') {
      systemInstruction += " Your personality is 'Sunshine': Energetic, optimistic, cheerful, and always spreading positivity."
    }

    // 2. Khởi tạo Gemini an toàn
    const aiKey = Deno.env.get("GEMINI_API_KEY")
    if (!aiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY is not configured on Supabase" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const genAI = new GoogleGenAI(aiKey)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
    })

    // 3. Chuẩn hóa history đầu vào phòng trường hợp sai định dạng từ frontend
    const safeHistory = Array.isArray(history) && history.length > 0 ? history : []

    // 4. Khởi tạo hội thoại kèm theo systemInstruction ở phần options
    const chat = model.startChat({
      history: safeHistory,
      generationConfig: {
        // Có thể bổ sung cấu hình nếu cần
      },
      // Đưa systemInstruction vào cấu hình chat để tránh crash phiên bản
      systemInstruction: systemInstruction 
    })

    // 5. Gửi tin nhắn mới và lấy kết quả
    const result = await chat.sendMessage(message)
    const responseText = result.response.text()

    return new Response(
      JSON.stringify({ reply: responseText }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    )

  } catch (error: any) {
    // Trả về chi tiết lỗi hệ thống để dễ bề kiểm tra ở Frontend
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})