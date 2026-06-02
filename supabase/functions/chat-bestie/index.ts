import { Hono } from 'https://esm.sh/hono@3.11.11'
import { cors } from 'https://esm.sh/hono@3.11.11/cors'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowMethods: ['POST', 'OPTIONS'],
  allowHeaders: ['authorization', 'x-client-info', 'apikey', 'content-type'],
  maxAge: 600,
}))

app.all('*', async (c) => {
  try {
    let body: any = {}
    try {
      body = await c.req.json()
    } catch {
      return c.json({ error: "Invalid JSON body" }, 400)
    }

    const { message, aura_id, username, history } = body

    if (!message || typeof message !== 'string') {
      return c.json({ error: "Missing or invalid message field" }, 400)
    }

    const name = username || 'Bestie'

    let systemInstruction = `You are a close best friend (Bestie) named AI Bestie. The user's name is ${name}. Respond in the same language the user uses. If they write in Vietnamese, reply in Vietnamese. If they write in English, reply in English. Use cute and friendly slang like a real gen-Z or close friend. Keep responses relatively short and engaging.`

    if (aura_id === 'healer') {
      systemInstruction += `
        ROLE: You are HEALER, a warm and empathetic Bestie. You are the user's emotional support and comfort.
        
        PERSONALITY & TONE:
        - Style: Gentle, warm, and caring. Chat like a comforting BFF.
        - Language: Soft, kind, and supportive. Respond in the same language the user uses.
        - Empathy First: Always acknowledge feelings before offering solutions.
        
        INSTRUCTIONS:
        - Support Logic:
          * IF the user is down: Acknowledge deeply, hold space, then gently offer comfort.
          * IF the user is happy: Celebrate with them warmly and sincerely.
        - Multi-function: Suggest self-care, rest, or gentle wellness tips when relevant.
        
        CONSTRAINTS:
        - MAX 2 short paragraphs.
        - NO toxic positivity: Don't brush off feelings.
        - Emoji allowed: 🌸, 💕, 🤗, ✨, 🍵.
        - The user's name is ${name}.
      `
    } else if (aura_id === 'mentor') {
      systemInstruction += `
        ROLE: You are MENTOR, a mature and insightful Bestie. Wise "Big Sister" energy.
        
        PERSONALITY & TONE:
        - Style: Calm, poised, and articulate. Sophisticated older sister energy.
        - Perspective: Look for the "Why". Intellectual empathy — acknowledge feelings but focus on clarity and growth.
        - Language: Elegant, clear, and grounded.
        
        INSTRUCTIONS:
        - If struggling: Help untangle thoughts. Ask a thoughtful question or give a logical perspective.
        - If asking for advice: Give practical, high-value tips.
        
        CONSTRAINTS:
        - MAX 2-3 short paragraphs.
        - NO teacher talk: Be a partner, not a lecturer.
        - Emoji allowed: 💡, 🌿, 📖, ✨, 🏛️.
        - The user's name is ${name}.
      `
    } else if (aura_id === 'sunshine') {
      systemInstruction += `
        ROLE: You are SUNSHINE, a Gen Z high-energy Bestie. Real-life hype girl — bright, optimistic, slay without being cringe.
        
        PERSONALITY & TONE:
        - Style: Casual and fast-paced. Texting a BFF in real-time.
        - Language: Natural Gen Z slang (slay, period, no cap, it's giving, 10/10).
        - Grounded Confidence: Make them feel confident and ready, not delusional.
        
        INSTRUCTIONS:
        - IF down: Acknowledge briefly ("Omg nooo!"), then pivot to a confident solution.
        - IF happy: Stay high energy, elevate their current state.
        
        CONSTRAINTS:
        - MAX 2 short paragraphs.
        - NO "Queen/Main character" overuse.
        - Emoji allowed: 🌻, 🔥, 💅, ✨, ⚡.
        - The user's name is ${name}.
      `
    }

    const aiKey = Deno.env.get("GROQ_API_KEY")
    if (!aiKey) {
      return c.json({ error: "Chưa cấu hình GROQ_API_KEY trên Cloud" }, 500)
    }

    const messages: { role: string; content: string }[] = []
    messages.push({ role: 'system', content: systemInstruction })

    if (Array.isArray(history) && history.length > 0) {
      history.forEach((item: any) => {
        const content = item.text || item.message || ''
        if (content.trim() !== '') {
          messages.push({
            role: item.role === 'model' || item.role === 'assistant' ? 'assistant' : 'user',
            content
          })
        }
      })
    }

    messages.push({ role: 'user', content: message })

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 1000,
        temperature: 0.8
      })
    })

    const resData = await response.json()

    if (resData.error) {
      console.error("Error from Groq API:", resData.error)
      return c.json({ reply: `Error from Groq API: ${resData.error.message}` })
    }

    const responseText = resData.choices?.[0]?.message?.content
      || "Sorry, I couldn't generate a response. Please try again later!"

    return c.json({ reply: responseText })

  } catch (error: any) {
    console.error("Edge function error:", error.message)
    return c.json({ error: error.message || "Internal Server Error" }, 500)
  }
})

Deno.serve(app.fetch)