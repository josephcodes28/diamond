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

  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: "You are Diamond, a helpful personal assistant for Joseph. Answer briefly and clearly, in 2 to 4 sentences unless he asks for more. You help with remote job research, writing scripts, finding niche ideas, and planning websites, apps, and games. Never promise income."
          }]
        },
        contents: [{ role: "user", parts: [{ text: message }] }]
      })
    });

    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: data.error?.message || "The AI request failed" });
    }

    const reply = data.candidates?.[0]?.content?.parts?.map(p => p.text).join("")
      || "I don't have an answer for that.";
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: "Could not reach the AI service" });
  }
}
