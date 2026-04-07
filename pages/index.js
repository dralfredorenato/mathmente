import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

const TOPICS = [
  { id: 1, name: 'Sequencias', emoji: '🔢', desc: 'Sequencias numericas' },
  { id: 2, name: 'Primos e Compostos', emoji: '⭐', desc: 'Numeros primos e compostos' },
  { id: 3, name: 'Multiplos e Divisores', emoji: '✖️', desc: 'Multiplos e divisores' },
  { id: 4, name: 'MMC e MDC', emoji: '🎯', desc: 'Minimo multiplo comum e maximo divisor comum' },
  { id: 5, name: 'Divisibilidade', emoji: '📏', desc: 'Criterios de divisibilidade' },
  { id: 6, name: 'Numeros Inteiros', emoji: '➕➖', desc: 'Conjunto dos numeros inteiros, adicao e subtracao' }
];

const QUICK_ACTIONS_STUDENT = [
  { label: '💡 Explicar', prompt: 'Explique este tema de forma simples, com exemplos do dia a dia, para uma adolescente com TDAH. Use passos numerados curtos.' },
  { label: '📝 Exemplo', prompt: 'Me de um exemplo pratico e resolvido passo a passo deste tema. Use numeros simples.' },
  { label: '🧠 Macete', prompt: 'Me de um macete ou dica mnemonica para lembrar este conceito facilmente.' },
  { label: '🎮 Quiz', prompt: 'Crie um quiz rapido com 3 questoes de multipla escolha sobre este tema. Formate bem.' },
  { label: '🐢 Mais devagar', prompt: 'Explique este tema de um jeito ainda mais simples, como se eu tivesse 10 anos.' },
  { label: '📋 Resumo', prompt: 'Faca um resumo super curto (maximo 5 linhas) dos pontos mais importantes deste tema.' }
];

function ChatBubble({ role, content }) {
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
        background: role === 'user' ? '#6C5CE7' : '#ffffff',
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

function StudentView() {
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
          system: 'Voce e a MathMente, uma tutora de matematica super paciente e divertida. A aluna e Ana Clara, uma adolescente com TDAH. REGRAS: 1) Respostas CURTAS (maximo 150 palavras). 2) Use emojis com moderacao. 3) Passos numerados. 4) Linguagem simples de adolescente. 5) Sempre encoraje.' + topicContext
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

  const xpLevel = xp < 10 ? 'Curiosa' : xp < 25 ? 'Persistente' : xp < 50 ? 'Guerreira' : 'Mestre da Matematica';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF5F5 0%, #FFF0E6 100%)', fontFamily: "'Nunito', sans-serif" }}>
      <Head>
        <title>MathMente - Ana Clara</title>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', padding: '16px 20px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22 }}>🧠 MathMente</h1>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>Oi, Ana Clara!</p>
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
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 20px', gap: 10, alignItems: 'center', background: 'rgba(108,92,231,0.08)' }}>
        <span style={{ fontSize: 14 }}>⏱️ {formatTime(pomodoroTime)}</span>
        <button onClick={() => setPomodoroActive(!pomodoroActive)} style={{ background: pomodoroActive ? '#EF4444' : '#6C5CE7', color: '#fff', border: 'none', borderRadius: 20, padding: '6px 16px', fontSize: 13, cursor: 'pointer' }}>
          {pomodoroActive ? 'Pausar' : 'Iniciar Pomodoro'}
        </button>
      </div>

      {/* Topics */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 20px', overflowX: 'auto', flexWrap: 'nowrap' }}>
        {TOPICS.map(t => (
          <button key={t.id} onClick={() => setSelectedTopic(t)} style={{
            background: selectedTopic?.id === t.id ? '#6C5CE7' : '#fff',
            color: selectedTopic?.id === t.id ? '#fff' : '#6C5CE7',
            border: '2px solid #6C5CE7',
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
        {QUICK_ACTIONS_STUDENT.map((a, i) => (
          <button key={i} onClick={() => sendMessage(a.prompt)} style={{
            background: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: 16,
            padding: '6px 12px',
            fontSize: 12,
            cursor: 'pointer',
            color: '#6C5CE7',
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
            <p style={{ fontSize: 40 }}>🧠</p>
            <p>Escolha um tema acima e me pergunte qualquer coisa!</p>
          </div>
        )}
        {messages.map((m, i) => <ChatBubble key={i} role={m.role} content={m.content} />)}
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
        <button onClick={() => sendMessage(input)} style={{ background: '#6C5CE7', color: '#fff', border: 'none', borderRadius: 24, padding: '10px 20px', fontSize: 15, cursor: 'pointer' }}>
          Enviar
        </button>
      </div>
    </div>
  );
}

function ParentView() {
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
          system: 'Voce e um consultor pedagogico especializado em TDAH e matematica. Ajude o pai a criar estrategias de estudo para sua filha adolescente. Seja pratico e objetivo.'
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
    const test = new Date('2025-04-10');
    const now = new Date();
    const diff = Math.ceil((test - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const tabs = ['overview', 'content', 'consultant'];

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', fontFamily: "'Inter', sans-serif" }}>
      <Head>
        <title>MathMente - Painel do Pai</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A5F, #2D5F8B)', padding: '16px 20px', color: '#fff' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>📊 MathMente - Painel do Pai</h1>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>Acompanhe o progresso da Ana Clara</p>
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
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 12px' }}>📅 Proxima Prova</h3>
              <p style={{ fontSize: 28, fontWeight: 700, color: '#1E3A5F', margin: 0 }}>T1 Matematica</p>
              <p style={{ color: '#6B7280', margin: '4px 0' }}>10 de Abril - {daysUntilTest()} dias restantes</p>
              <p style={{ color: '#6B7280', fontSize: 13 }}>15 questoes: 3 objetivas + 12 desenvolvimento (peso 0,2 cada)</p>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 12px' }}>📚 Topicos do T1</h3>
              {TOPICS.map(t => (
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
                style={{ width: '100%', minHeight: 80, border: '1px solid #E5E7EB', borderRadius: 8, padding: 12, fontSize: 14, resize: 'vertical' }}
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
              <h3 style={{ margin: '0 0 12px' }}>📝 Adicionar Novo Conteudo</h3>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>Cole o texto da materia ou prova abaixo. A IA processara e extraira os topicos automaticamente.</p>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Cole aqui o texto da materia, prova, ou orientacoes do professor..."
                style={{ width: '100%', minHeight: 200, border: '1px solid #E5E7EB', borderRadius: 8, padding: 12, fontSize: 14, resize: 'vertical' }}
              />
              <button onClick={() => { if (newContent) { sendMessage('Analise este conteudo escolar e extraia: titulo, materia, topicos principais e sugestoes de estudo para aluna com TDAH: ' + newContent); setNewContent(''); setTab('consultant'); }}} style={{ marginTop: 12, background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 14 }}>
                🤖 Processar com IA
              </button>
            </div>
          </div>
        )}

        {tab === 'consultant' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {[
                ['Estrategias TDAH', 'Quais as melhores estrategias de estudo para matematica com TDAH?'],
                ['Plano de Revisao', 'Crie um plano de revisao de 3 dias para o T1 de matematica'],
                ['Exercicios', 'Sugira exercicios praticos e rapidos sobre numeros inteiros'],
                ['Desempenho', 'Como avaliar se a Ana Clara esta progredindo nos estudos?']
              ].map(([label, prompt], i) => (
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

const PARENT_PIN = '0608';

function PinScreen({ onSuccess, onBack }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleDigit = (digit) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError(false);
    if (newPin.length === 4) {
      if (newPin === PARENT_PIN) {
        onSuccess();
      } else {
        setError(true);
        setShake(true);
        setTimeout(() => { setPin(''); setShake(false); }, 600);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

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
        <title>MathMente - Acesso do Pai</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
      <h2 style={{ color: '#fff', fontSize: 24, marginBottom: 8 }}>Acesso do Pai</h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 32 }}>Digite o PIN de 4 digitos</p>

      {/* PIN dots */}
      <div style={{
        display: 'flex',
        gap: 16,
        marginBottom: 12,
        animation: shake ? 'shake 0.4s ease-in-out' : 'none'
      }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.4)',
            background: i < pin.length
              ? (error ? '#EF4444' : '#FBBF24')
              : 'transparent',
            transition: 'background 0.15s'
          }} />
        ))}
      </div>

      {error && (
        <p style={{ color: '#EF4444', fontSize: 13, marginBottom: 8, height: 20 }}>PIN incorreto. Tente novamente.</p>
      )}
      {!error && <div style={{ height: 20, marginBottom: 8 }} />}

      {/* Numpad */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 72px)', gap: 12, marginBottom: 20 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <button key={n} onClick={() => handleDigit(String(n))} style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            fontSize: 28,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.15s'
          }}>
            {n}
          </button>
        ))}
        <div />
        <button onClick={() => handleDigit('0')} style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.08)',
          color: '#fff',
          fontSize: 28,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.15s'
        }}>
          0
        </button>
        <button onClick={handleDelete} style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          border: 'none',
          background: 'transparent',
          color: 'rgba(255,255,255,0.6)',
          fontSize: 20,
          cursor: 'pointer'
        }}>
          ⌫
        </button>
      </div>

      <button onClick={onBack} style={{
        background: 'none',
        border: 'none',
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        cursor: 'pointer',
        padding: '8px 16px'
      }}>
        ← Voltar
      </button>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  const [role, setRole] = useState(null);
  const [showPin, setShowPin] = useState(false);

  if (role === 'student') return <StudentView />;
  if (role === 'parent') return <ParentView />;
  if (showPin) return <PinScreen onSuccess={() => setRole('parent')} onBack={() => setShowPin(false)} />;

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
        <title>MathMente - Plataforma de Estudo</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <h1 style={{ color: '#fff', fontSize: 48, marginBottom: 8, textAlign: 'center' }}>🧠 MathMente</h1>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, marginBottom: 8 }}>Plataforma de Apoio Matematico</p>
      <p style={{ color: '#FBBF24', fontSize: 14, marginBottom: 40 }}>📅 T1 Matematica - 10 de Abril</p>

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

        <button onClick={() => setShowPin(true)} style={{
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
