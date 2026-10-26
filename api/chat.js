export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const { message } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: "No message received" });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "The AI key is missing in Vercel settings" });
  }

  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent";

  const systemText = `You are Diamond, a personal assistant for Joseph. Speak clearly and briefly, in 2 to 5 sentences unless he asks for more detail.
You help with:
- Finding remote job opportunities, with the job title, what the client wants, and a short proposal Joseph can review.
- Writing scripts (YouTube, video, ads, sales messages).
- Suggesting profitable niches with reasons.
- Planning websites, apps, and games step by step.
- Research, using web search for anything current such as news, people in office, prices, or job listings.
If Joseph rejects a job, offer a different one in another category.
Never promise income or guarantee results. Never apply to jobs or contact clients for him; always let him approve first.`;

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemText }] },
        contents: [{ role: "user", parts: [{ text: message }] }],
        tools: [{ google_search: {} }]
      })
    });

    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: data.error?.message || "The AI request failed" });
    }

    const parts = data.candidates?.[0]?.content?.parts || [];
    const reply = parts.map(p => p.text || "").join("").trim() || "I don't have an answer for that.";
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: "Could not reach the AI service" });
  }
}
