import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
    }

  const apiKey = process.env.ANTHROPIC_API_KEY_MATHMENTE || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
          return res.status(500).json({ error: 'API key not configured (defina ANTHROPIC_API_KEY_MATHMENTE)' });
    }

  try {
        const { messages, system } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
              return res.status(400).json({ error: 'messages e obrigatorio' });
      }

      const client = new Anthropic({ apiKey });

      const systemPrompt = (system || 'Voce e um tutor paciente especializado em TDAH.')
              + ' Responda em portugues, apenas com a resposta final para o usuario, sem mostrar seu raciocinio interno.';

      // Mapeia o historico do app (roles user/assistant) para o formato da Messages API
      const anthropicMessages = messages.map(m => ({
              role: m.role === 'assistant' ? 'assistant' : 'user',
              content: String(m.content ?? '')
      }));

      const response = await client.messages.create({
              model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5',
              max_tokens: 8192,
              system: systemPrompt,
              messages: anthropicMessages
      });

      const text = response.content
              .filter(block => block.type === 'text')
              .map(block => block.text)
              .join('')
              .trim();

      return res.status(200).json({ content: text || 'Sem resposta' });
  } catch (error) {
        if (error instanceof Anthropic.APIError) {
              console.error('Anthropic API error:', error.status, error.message);
              return res.status(error.status || 500).json({ error: error.message });
        }
        console.error('Chat handler error:', error);
        return res.status(500).json({ error: error.message || 'Erro interno' });
  }
}
