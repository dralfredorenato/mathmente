export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { messages, system } = req.body;
    const systemPrompt = system || 'Voce e um tutor de matematica especializado em TDAH.';
    const contents = [];
    if (system) {
      contents.push({ role: 'user', parts: [{ text: 'INSTRUCAO DO SISTEMA: ' + systemPrompt }] });
      contents.push({ role: 'model', parts: [{ text: 'Entendido. Vou seguir essas instrucoes.' }] });
    }
    messages.forEach(m => {
      contents.push({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] });
    });

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: contents,
        generationConfig: { maxOutputTokens: 2048, temperature: 0.7 }
      })
    });

    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta';
    return res.status(200).json({ content: text });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
