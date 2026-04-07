import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

// ============================
// SUBJECT CONFIGURATIONS
// ============================

const SUBJECTS = {
  math: {
    id: 'math',
    name: 'Matematica',
    emoji: '🧮',
    tutorName: 'MathMente',
    colors: { primary: '#6C5CE7', secondary: '#A855F7', bg: 'linear-gradient(135deg, #FFF5F5 0%, #FFF0E6 100%)', header: 'linear-gradient(135deg, #6C5CE7, #A855F7)' },
    systemPrompt: 'Voce e a MathMente, uma tutora de matematica super paciente e divertida. A aluna e Ana Clara, uma adolescente com TDAH. REGRAS: 1) Respostas CURTAS (maximo 150 palavras). 2) Use emojis com moderacao. 3) Passos numerados. 4) Linguagem simples de adolescente. 5) Sempre encoraje.',
    parentSystemPrompt: 'Voce e um consultor pedagogico especializado em TDAH e matematica. Ajude o pai a criar estrategias de estudo para sua filha adolescente. Seja pratico e objetivo.',
    topics: [
      { id: 1, name: 'Sequencias', emoji: '🔢', desc: 'Sequencias numericas' },
      { id: 2, name: 'Primos e Compostos', emoji: '⭐', desc: 'Numeros primos e compostos' },
      { id: 3, name: 'Multiplos e Divisores', emoji: '✖️', desc: 'Multiplos e divisores' },
      { id: 4, name: 'MMC e MDC', emoji: '🎯', desc: 'Minimo multiplo comum e maximo divisor comum' },
      { id: 5, name: 'Divisibilidade', emoji: '📏', desc: 'Criterios de divisibilidade' },
      { id: 6, name: 'Numeros Inteiros', emoji: '➕➖', desc: 'Conjunto dos numeros inteiros, adicao e subtracao' }
    ],
    quickActions: [
      { label: '💡 Explicar', prompt: 'Explique este tema de forma simples, com exemplos do dia a dia, para uma adolescente com TDAH. Use passos numerados curtos.' },
      { label: '📝 Exemplo', prompt: 'Me de um exemplo pratico e resolvido passo a passo deste tema. Use numeros simples.' },
      { label: '🧠 Macete', prompt: 'Me de um macete ou dica mnemonica para lembrar este conceito facilmente.' },
      { label: '🎮 Quiz', prompt: 'Crie um quiz rapido com 3 questoes de multipla escolha sobre este tema. Formate bem.' },
      { label: '🐢 Mais devagar', prompt: 'Explique este tema de um jeito ainda mais simples, como se eu tivesse 10 anos.' },
      { label: '📋 Resumo', prompt: 'Faca um resumo super curto (maximo 5 linhas) dos pontos mais importantes deste tema.' }
    ],
    parentQuickActions: [
      ['Estrategias TDAH', 'Quais as melhores estrategias de estudo para matematica com TDAH?'],
      ['Plano de Revisao', 'Crie um plano de revisao de 3 dias para o T1 de matematica'],
      ['Exercicios', 'Sugira exercicios praticos e rapidos sobre numeros inteiros'],
      ['Desempenho', 'Como avaliar se a Ana Clara esta progredindo nos estudos?']
    ],
    test: { name: 'T1 Matematica', date: '2025-04-10', details: '15 questoes: 3 objetivas + 12 desenvolvimento (peso 0,2 cada)' }
  },
  portuguese: {
    id: 'portuguese',
    name: 'Portugues',
    emoji: '📖',
    tutorName: 'LetraMente',
    colors: { primary: '#E17055', secondary: '#FDCB6E', bg: 'linear-gradient(135deg, #FFF8F0 0%, #FFF5F5 100%)', header: 'linear-gradient(135deg, #E17055, #FDCB6E)' },
    systemPrompt: 'Voce e a LetraMente, uma tutora de portugues super paciente e divertida. A aluna e Ana Clara, uma adolescente com TDAH. REGRAS: 1) Respostas CURTAS (maximo 150 palavras). 2) Use emojis com moderacao. 3) Passos numerados. 4) Linguagem simples de adolescente. 5) Sempre encoraje. 6) De exemplos com frases do dia a dia dela. 7) Quando explicar gramatica, use cores mentais: destaque a palavra-chave com MAIUSCULAS.',
    parentSystemPrompt: 'Voce e um consultor pedagogico especializado em TDAH e lingua portuguesa. Ajude o pai a criar estrategias de estudo de portugues para sua filha adolescente. Seja pratico e objetivo.',
    topics: [
      { id: 1, name: 'Interpretacao de Texto', emoji: '📰', desc: 'Compreensao e interpretacao textual, inferencias' },
      { id: 2, name: 'Classes Gramaticais', emoji: '🏷️', desc: 'Substantivo, adjetivo, verbo, advérbio, pronome' },
      { id: 3, name: 'Tipos de Frase', emoji: '❗', desc: 'Declarativa, interrogativa, exclamativa, imperativa' },
      { id: 4, name: 'Acentuacao', emoji: '✏️', desc: 'Regras de acentuacao grafica, oxitonas, paroxitonas, proparoxitonas' },
      { id: 5, name: 'Pontuacao', emoji: '🔣', desc: 'Virgula, ponto, dois-pontos, ponto e virgula, travessao' },
      { id: 6, name: 'Ortografia', emoji: '🔤', desc: 'Escrita correta, S/SS/C/SC, X/CH, G/J, homônimos' },
      { id: 7, name: 'Verbos', emoji: '🏃', desc: 'Conjugacao, tempos verbais, modos indicativo, subjuntivo e imperativo' },
      { id: 8, name: 'Sujeito e Predicado', emoji: '🧩', desc: 'Analise sintatica, tipos de sujeito e predicado' },
      { id: 9, name: 'Figuras de Linguagem', emoji: '🎭', desc: 'Metafora, comparacao, personificacao, hiperbole, ironia' },
      { id: 10, name: 'Generos Textuais', emoji: '📚', desc: 'Narrativo, descritivo, dissertativo, carta, cronica, conto' }
    ],
    quickActions: [
      { label: '💡 Explicar', prompt: 'Explique este tema de portugues de forma simples, com exemplos do dia a dia, para uma adolescente com TDAH. Use passos numerados curtos.' },
      { label: '📝 Exemplo', prompt: 'Me de exemplos praticos deste tema usando frases simples do cotidiano. Destaque as palavras importantes.' },
      { label: '🧠 Macete', prompt: 'Me de um macete ou dica mnemonica para lembrar esta regra de portugues facilmente.' },
      { label: '🎮 Quiz', prompt: 'Crie um quiz rapido com 3 questoes de multipla escolha sobre este tema de portugues. Formate bem.' },
      { label: '🐢 Mais devagar', prompt: 'Explique este tema de um jeito ainda mais simples, como se eu tivesse 10 anos.' },
      { label: '📋 Resumo', prompt: 'Faca um resumo super curto (maximo 5 linhas) dos pontos mais importantes deste tema de portugues.' },
      { label: '✍️ Ditado', prompt: 'Crie um mini-ditado com 5 palavras dificeis relacionadas a este tema. Depois me diga a resposta.' },
      { label: '🔍 Erro comum', prompt: 'Quais os erros mais comuns que alunos cometem neste tema? Me mostre como evitar cada um.' }
    ],
    parentQuickActions: [
      ['Estrategias TDAH', 'Quais as melhores estrategias de estudo para portugues com TDAH?'],
      ['Plano Revisao Rapida', 'Crie um plano de revisao intensivo de 1 dia para prova de portugues amanha'],
      ['Exercicios Praticos', 'Sugira exercicios rapidos de portugues que posso fazer com minha filha hoje a noite'],
      ['Pontos Fracos', 'Quais os topicos de portugues que alunos com TDAH mais tem dificuldade e como ajudar?']
    ],
    test: { name: 'Prova de Portugues', date: '2026-04-08', details: 'Prova amanha! Revisao intensiva.' }
  }
};

// ============================
// SHARED COMPONENTS
// ============================

function ChatBubble({ role, content, primaryColor }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
      marginBottom: 12
    }}>
      <div style={{
        maxWidth: '80%',
        padding: '12px 16px',
        borderRadius: role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: role === 'user' ? (primaryColor || '#6C5CE7') : '#ffffff',
        color: role === 'user' ? '#fff' : '#2d3436',
        fontSize: 15,
        lineHeight: 1.5,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        whiteSpace: 'pre-wrap'
      }}>
        {content}
      </div>
    </div>
  );
}

// ============================
// STUDENT VIEW
// ============================

function StudentView({ subject, onBack }) {
  const config = SUBJECTS[subject];
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [xp, setXp] = useState(0);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let interval;
    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => setPomodoroTime(t => t - 1), 1000);
    } else if (pomodoroTime === 0) {
      setPomodoroActive(false);
      setXp(x => x + 5);
      setPomodoroTime(25 * 60);
      alert('Pausa! Voce ganhou +5 XP! Descanse 5 minutinhos.');
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroTime]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setXp(x => x + 1);

    try {
      const topicContext = selectedTopic ? ' O tema atual e: ' + selectedTopic.name + ' - ' + selectedTopic.desc + '.' : '';
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          system: config.systemPrompt + topicContext
        })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.content || data.error || 'Erro ao processar' }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Ops, algo deu errado. Tenta de novo?' }]);
    }
    setLoading(false);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0');
  };

  const xpLevel = xp < 10 ? 'Curiosa' : xp < 25 ? 'Persistente' : xp < 50 ? 'Guerreira' : 'Mestre dos Estudos';

  return (
    <div style={{ minHeight: '100vh', background: config.colors.bg, fontFamily: "'Nunito', sans-serif" }}>
      <Head>
        <title>{config.tutorName} - Ana Clara</title>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Header */}
      <div style={{ background: config.colors.header, padding: '16px 20px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, color: '#fff', padding: '6px 10px', cursor: 'pointer', fontSize: 16 }}>
              ←
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: 22 }}>{config.emoji} {config.tutorName}</h1>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>Oi, Ana Clara!</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13 }}>⭐ {xp} XP - {xpLevel}</div>
            <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: 10, height: 8, width: 120, marginTop: 4 }}>
              <div style={{ background: '#FBBF24', borderRadius: 10, height: 8, width: Math.min(xp * 2.4, 120) }} />
            </div>
          </div>
        </div>
      </div>

      {/* Pomodoro */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 20px', gap: 10, alignItems: 'center', background: `${config.colors.primary}14` }}>
        <span style={{ fontSize: 14 }}>⏱️ {formatTime(pomodoroTime)}</span>
        <button onClick={() => setPomodoroActive(!pomodoroActive)} style={{ background: pomodoroActive ? '#EF4444' : config.colors.primary, color: '#fff', border: 'none', borderRadius: 20, padding: '6px 16px', fontSize: 13, cursor: 'pointer' }}>
          {pomodoroActive ? 'Pausar' : 'Iniciar Pomodoro'}
        </button>
      </div>

      {/* Topics */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 20px', overflowX: 'auto', flexWrap: 'nowrap' }}>
        {config.topics.map(t => (
          <button key={t.id} onClick={() => setSelectedTopic(t)} style={{
            background: selectedTopic?.id === t.id ? config.colors.primary : '#fff',
            color: selectedTopic?.id === t.id ? '#fff' : config.colors.primary,
            border: `2px solid ${config.colors.primary}`,
            borderRadius: 20,
            padding: '8px 14px',
            fontSize: 13,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontWeight: 600
          }}>
            {t.emoji} {t.name}
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 6, padding: '8px 20px', flexWrap: 'wrap' }}>
        {config.quickActions.map((a, i) => (
          <button key={i} onClick={() => sendMessage(a.prompt)} style={{
            background: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: 16,
            padding: '6px 12px',
            fontSize: 12,
            cursor: 'pointer',
            color: config.colors.primary,
            fontWeight: 600
          }}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div style={{ flex: 1, padding: '12px 20px', minHeight: 300, maxHeight: 'calc(100vh - 380px)', overflowY: 'auto' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#9CA3AF', padding: 40 }}>
            <p style={{ fontSize: 40 }}>{config.emoji}</p>
            <p>Escolha um tema acima e me pergunte qualquer coisa!</p>
          </div>
        )}
        {messages.map((m, i) => <ChatBubble key={i} role={m.role} content={m.content} primaryColor={config.colors.primary} />)}
        {loading && <div style={{ textAlign: 'center', color: '#9CA3AF' }}>Pensando... 🤔</div>}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 20px', background: '#fff', borderTop: '1px solid #E5E7EB', display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Digite sua duvida..."
          style={{ flex: 1, border: '2px solid #E5E7EB', borderRadius: 24, padding: '10px 16px', fontSize: 15, outline: 'none' }}
        />
        <button onClick={() => sendMessage(input)} style={{ background: config.colors.primary, color: '#fff', border: 'none', borderRadius: 24, padding: '10px 20px', fontSize: 15, cursor: 'pointer' }}>
          Enviar
        </button>
      </div>
    </div>
  );
}

// ============================
// PARENT VIEW
// ============================

function ParentView({ subject, onBack }) {
  const config = SUBJECTS[subject];
  const [tab, setTab] = useState('overview');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [note, setNote] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          system: config.parentSystemPrompt
        })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.content || data.error || 'Erro ao processar' }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Erro de conexao. Tente novamente.' }]);
    }
    setLoading(false);
  };

  const daysUntilTest = () => {
    const test = new Date(config.test.date);
    const now = new Date();
    const diff = Math.ceil((test - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const isUrgent = daysUntilTest() <= 1;

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', fontFamily: "'Inter', sans-serif" }}>
      <Head>
        <title>EstudaMente - Painel do Pai - {config.name}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A5F, #2D5F8B)', padding: '16px 20px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, color: '#fff', padding: '6px 10px', cursor: 'pointer', fontSize: 16 }}>
            ←
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 20 }}>📊 EstudaMente - {config.emoji} {config.name}</h1>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>Painel do Pai - Acompanhe o progresso da Ana Clara</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #E5E7EB' }}>
        {[['overview', '📋 Visao Geral'], ['content', '📚 Conteudo'], ['consultant', '🤖 Consultor IA']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1,
            padding: '12px',
            background: tab === key ? '#1E3A5F' : 'transparent',
            color: tab === key ? '#fff' : '#6B7280',
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: 20 }}>
        {tab === 'overview' && (
          <div>
            <div style={{ background: isUrgent ? '#FEF2F2' : '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: isUrgent ? '2px solid #EF4444' : 'none' }}>
              <h3 style={{ margin: '0 0 12px' }}>{isUrgent ? '🚨' : '📅'} Proxima Prova</h3>
              <p style={{ fontSize: 28, fontWeight: 700, color: isUrgent ? '#EF4444' : '#1E3A5F', margin: 0 }}>{config.test.name}</p>
              <p style={{ color: isUrgent ? '#EF4444' : '#6B7280', margin: '4px 0', fontWeight: isUrgent ? 700 : 400 }}>
                {isUrgent ? '⚡ AMANHA!' : `${daysUntilTest()} dias restantes`}
              </p>
              <p style={{ color: '#6B7280', fontSize: 13 }}>{config.test.details}</p>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 12px' }}>📚 Topicos - {config.name}</h3>
              {config.topics.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: 20, marginRight: 12 }}>{t.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 12px' }}>📝 Enviar Recado para Ana Clara</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Escreva um recado de incentivo..."
                style={{ width: '100%', minHeight: 80, border: '1px solid #E5E7EB', borderRadius: 8, padding: 12, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
              />
              <button onClick={() => { if (note) { alert('Recado salvo! Ana Clara vera quando abrir o app.'); setNote(''); }}} style={{ marginTop: 8, background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer' }}>
                Enviar Recado
              </button>
            </div>
          </div>
        )}

        {tab === 'content' && (
          <div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 12px' }}>📝 Adicionar Novo Conteudo de {config.name}</h3>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>Cole o texto da materia ou prova abaixo. A IA processara e extraira os topicos automaticamente.</p>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Cole aqui o texto da materia, prova, ou orientacoes do professor..."
                style={{ width: '100%', minHeight: 200, border: '1px solid #E5E7EB', borderRadius: 8, padding: 12, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
              />
              <button onClick={() => { if (newContent) { sendMessage('Analise este conteudo escolar de ' + config.name + ' e extraia: titulo, materia, topicos principais e sugestoes de estudo para aluna com TDAH: ' + newContent); setNewContent(''); setTab('consultant'); }}} style={{ marginTop: 12, background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 14 }}>
                🤖 Processar com IA
              </button>
            </div>
          </div>
        )}

        {tab === 'consultant' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {config.parentQuickActions.map(([label, prompt], i) => (
                <button key={i} onClick={() => sendMessage(prompt)} style={{
                  background: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: 12,
                  cursor: 'pointer',
                  color: '#1E3A5F',
                  fontWeight: 500
                }}>
                  {label}
                </button>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 12, minHeight: 300, maxHeight: 400, overflowY: 'auto', padding: 16, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: '#9CA3AF', padding: 40 }}>
                  <p>Use os botoes acima ou digite sua pergunta</p>
                </div>
              )}
              {messages.map((m, i) => <ChatBubble key={i} role={m.role} content={m.content} />)}
              {loading && <div style={{ textAlign: 'center', color: '#9CA3AF' }}>Processando... ⏳</div>}
              <div ref={chatEndRef} />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Pergunte ao consultor pedagogico..."
                style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none' }}
              />
              <button onClick={() => sendMessage(input)} style={{ background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer' }}>
                Enviar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================
// SUBJECT SELECTOR
// ============================

function SubjectSelector({ role, onSelect, onBack }) {
  const subjectList = Object.values(SUBJECTS);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: 20
    }}>
      <Head>
        <title>EstudaMente - Escolha a Materia</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <button onClick={onBack} style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, color: '#fff', padding: '8px 14px', cursor: 'pointer', fontSize: 14 }}>
        ← Voltar
      </button>

      <h1 style={{ color: '#fff', fontSize: 36, marginBottom: 8, textAlign: 'center' }}>📚 Escolha a Materia</h1>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 40 }}>
        {role === 'student' ? 'O que vamos estudar hoje, Ana Clara?' : 'Qual materia deseja acompanhar?'}
      </p>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {subjectList.map(sub => {
          const isUrgent = (() => {
            const test = new Date(sub.test.date);
            const now = new Date();
            return Math.ceil((test - now) / (1000 * 60 * 60 * 24)) <= 1;
          })();

          return (
            <button key={sub.id} onClick={() => onSelect(sub.id)} style={{
              background: sub.colors.header,
              color: '#fff',
              border: isUrgent ? '3px solid #FBBF24' : 'none',
              borderRadius: 20,
              padding: '40px 50px',
              fontSize: 18,
              cursor: 'pointer',
              textAlign: 'center',
              minWidth: 220,
              boxShadow: isUrgent ? '0 10px 30px rgba(251,191,36,0.4)' : '0 10px 30px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s',
              position: 'relative'
            }}>
              {isUrgent && (
                <div style={{
                  position: 'absolute',
                  top: -12,
                  right: -12,
                  background: '#EF4444',
                  color: '#fff',
                  borderRadius: 20,
                  padding: '4px 12px',
                  fontSize: 11,
                  fontWeight: 700,
                  animation: 'pulse 2s infinite'
                }}>
                  PROVA AMANHA!
                </div>
              )}
              <div style={{ fontSize: 48, marginBottom: 12 }}>{sub.emoji}</div>
              <div style={{ fontWeight: 700 }}>{sub.name}</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>{sub.tutorName}</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 8 }}>
                {sub.test.name} - {new Date(sub.test.date).toLocaleDateString('pt-BR')}
              </div>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

// ============================
// MAIN APP
// ============================

export default function Home() {
  const [role, setRole] = useState(null);
  const [subject, setSubject] = useState(null);

  // Full app with subject selected
  if (role && subject) {
    const onBack = () => setSubject(null);
    if (role === 'student') return <StudentView subject={subject} onBack={onBack} />;
    if (role === 'parent') return <ParentView subject={subject} onBack={onBack} />;
  }

  // Subject selector
  if (role) {
    return <SubjectSelector role={role} onSelect={setSubject} onBack={() => setRole(null)} />;
  }

  // Role selector
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: 20
    }}>
      <Head>
        <title>EstudaMente - Plataforma de Estudos</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <h1 style={{ color: '#fff', fontSize: 48, marginBottom: 8, textAlign: 'center' }}>🧠 EstudaMente</h1>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, marginBottom: 8 }}>Plataforma Multidimensional de Estudos</p>
      <p style={{ color: '#FBBF24', fontSize: 14, marginBottom: 40 }}>📖 Prova de Portugues amanha! | 🧮 T1 Matematica - 10 de Abril</p>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => setRole('student')} style={{
          background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
          color: '#fff',
          border: 'none',
          borderRadius: 20,
          padding: '40px 50px',
          fontSize: 18,
          cursor: 'pointer',
          textAlign: 'center',
          minWidth: 220,
          boxShadow: '0 10px 30px rgba(108,92,231,0.4)',
          transition: 'transform 0.2s'
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👩‍🎓</div>
          <div style={{ fontWeight: 700 }}>Sou a Ana Clara</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Modo Aluna</div>
        </button>

        <button onClick={() => setRole('parent')} style={{
          background: 'linear-gradient(135deg, #1E3A5F, #2D5F8B)',
          color: '#fff',
          border: 'none',
          borderRadius: 20,
          padding: '40px 50px',
          fontSize: 18,
          cursor: 'pointer',
          textAlign: 'center',
          minWidth: 220,
          boxShadow: '0 10px 30px rgba(30,58,95,0.4)',
          transition: 'transform 0.2s'
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍💼</div>
          <div style={{ fontWeight: 700 }}>Sou o Pai</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Modo Professor</div>
        </button>
      </div>
    </div>
  );
}
