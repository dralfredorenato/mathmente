import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useLocalStorage, todayStr, formatDate, genId, nowTime, THEME, CATEGORIES } from '@/lib/store';

const TABS = [
  { id: 'mente', icon: '🧠', label: 'Mente' },
  { id: 'saude', icon: '💊', label: 'Saude' },
  { id: 'exercicio', icon: '💪', label: 'Exercicio' },
];

const MOODS = [
  { emoji: '😊', label: 'Feliz', color: '#10B981' },
  { emoji: '😌', label: 'Calmo', color: '#3B82F6' },
  { emoji: '😐', label: 'Neutro', color: '#9CA3AF' },
  { emoji: '😟', label: 'Ansioso', color: '#F59E0B' },
  { emoji: '😤', label: 'Irritado', color: '#EF4444' },
  { emoji: '😢', label: 'Triste', color: '#8B5CF6' },
];

const EXERCISE_TYPES = [
  { id: 'corrida', emoji: '🏃', label: 'Corrida' },
  { id: 'musculacao', emoji: '🏋️', label: 'Musculacao' },
  { id: 'caminhada', emoji: '🚶', label: 'Caminhada' },
  { id: 'natacao', emoji: '🏊', label: 'Natacao' },
  { id: 'bike', emoji: '🚴', label: 'Bike' },
  { id: 'funcional', emoji: '🤸', label: 'Funcional' },
  { id: 'yoga', emoji: '🧘', label: 'Yoga' },
  { id: 'outro', emoji: '⚡', label: 'Outro' },
];

const SPIRITUAL_MESSAGES = [
  "A oracao e o suspiro da alma para Deus.",
  "Em tudo dai gracas.",
  "Aquieta-te e sabe que Eu sou Deus.",
  "A paz que excede todo entendimento.",
  "Lancando sobre Ele toda a vossa ansiedade.",
  "O Senhor e o meu pastor, nada me faltara.",
  "Tudo posso naquele que me fortalece.",
  "Sede fortes e corajosos.",
];

export default function VidaPage() {
  const [tab, setTab] = useState('mente');
  const today = todayStr();

  return (
    <>
      <Head><title>Vida | Meu Ultimo Suspiro</title></Head>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px 16px 100px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Sua Vida
          </h1>
          <p style={{ fontSize: 13, color: THEME.textMuted, marginTop: 4 }}>Cuide do corpo, mente e espirito</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, background: THEME.bgCard, borderRadius: 14, padding: 4 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '10px 8px', borderRadius: 11, fontSize: 13, fontWeight: 600,
              background: tab === t.id ? THEME.primary : 'transparent',
              color: tab === t.id ? '#fff' : THEME.textSecondary,
              transition: 'all 0.2s',
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === 'mente' && <MenteTab today={today} />}
        {tab === 'saude' && <SaudeTab today={today} />}
        {tab === 'exercicio' && <ExercicioTab today={today} />}
      </div>
    </>
  );
}

// ==========================================
// MENTE TAB
// ==========================================
function MenteTab({ today }) {
  const [thoughts, setThoughts] = useLocalStorage('thoughts', []);
  const [prayerLog, setPrayerLog] = useLocalStorage('prayerLog', {});
  const [meditationLog, setMeditationLog] = useLocalStorage('meditationLog', []);
  const [newThought, setNewThought] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [meditating, setMeditating] = useState(false);
  const [medDuration, setMedDuration] = useState(5);
  const [medRemaining, setMedRemaining] = useState(0);
  const timerRef = useRef(null);

  const todayThoughts = thoughts.filter(t => t.date === today);
  const prayedToday = prayerLog[today] || false;
  const meditatedToday = meditationLog.some(m => m.date === today);

  // Prayer streak
  const getPrayerStreak = () => {
    let streak = 0;
    const d = new Date();
    if (prayerLog[today]) { streak = 1; d.setDate(d.getDate() - 1); }
    else { d.setDate(d.getDate() - 1); }
    while (true) {
      const ds = d.toISOString().split('T')[0];
      if (prayerLog[ds]) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return streak;
  };

  const addThought = () => {
    if (!newThought.trim()) return;
    setThoughts(prev => [{ id: genId(), text: newThought.trim(), mood: selectedMood, date: today, time: nowTime() }, ...prev]);
    setNewThought('');
    setSelectedMood(null);
  };

  const deleteThought = (id) => {
    setThoughts(prev => prev.filter(t => t.id !== id));
  };

  const togglePrayer = () => {
    setPrayerLog(prev => ({ ...prev, [today]: !prev[today] }));
  };

  const startMeditation = () => {
    setMeditating(true);
    setMedRemaining(medDuration * 60);
  };

  useEffect(() => {
    if (meditating && medRemaining > 0) {
      timerRef.current = setTimeout(() => setMedRemaining(r => r - 1), 1000);
      return () => clearTimeout(timerRef.current);
    } else if (meditating && medRemaining <= 0) {
      setMeditating(false);
      setMeditationLog(prev => [...prev, { date: today, minutes: medDuration }]);
    }
  }, [meditating, medRemaining]);

  const stopMeditation = () => {
    setMeditating(false);
    clearTimeout(timerRef.current);
    const elapsed = medDuration - Math.ceil(medRemaining / 60);
    if (elapsed > 0) {
      setMeditationLog(prev => [...prev, { date: today, minutes: elapsed }]);
    }
  };

  const spiritMsg = SPIRITUAL_MESSAGES[Math.floor(Date.now() / (1000 * 60 * 60)) % SPIRITUAL_MESSAGES.length];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Spiritual Message */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a35, #2a1a35)', border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 16, textAlign: 'center' }}>
        <span style={{ fontSize: 28 }}>✨</span>
        <p style={{ fontSize: 14, color: THEME.textSecondary, fontStyle: 'italic', marginTop: 8, lineHeight: 1.5 }}>"{spiritMsg}"</p>
      </div>

      {/* Prayer & Meditation Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {/* Prayer */}
        <div style={{ background: THEME.bgCard, border: `1px solid ${prayedToday ? THEME.success + '60' : THEME.border}`, borderRadius: 14, padding: 14, textAlign: 'center' }}>
          <span style={{ fontSize: 28 }}>🙏</span>
          <p style={{ fontSize: 12, color: THEME.textSecondary, margin: '6px 0' }}>Oracao</p>
          <button onClick={togglePrayer} style={{
            width: '100%', padding: '8px 12px', borderRadius: 10, fontSize: 13, fontWeight: 700,
            background: prayedToday ? THEME.success : THEME.bgInput, color: prayedToday ? '#fff' : THEME.textSecondary,
            border: `1px solid ${prayedToday ? THEME.success : THEME.border}`,
          }}>
            {prayedToday ? '✓ Orei hoje' : 'Orar'}
          </button>
          {getPrayerStreak() > 0 && (
            <p style={{ fontSize: 11, color: THEME.accent, marginTop: 6 }}>🔥 {getPrayerStreak()} dias seguidos</p>
          )}
        </div>

        {/* Meditation */}
        <div style={{ background: THEME.bgCard, border: `1px solid ${meditatedToday ? THEME.info + '60' : THEME.border}`, borderRadius: 14, padding: 14, textAlign: 'center' }}>
          <span style={{ fontSize: 28 }}>🧘</span>
          <p style={{ fontSize: 12, color: THEME.textSecondary, margin: '6px 0' }}>Meditacao</p>
          {meditating ? (
            <div>
              <p style={{ fontSize: 28, fontWeight: 800, color: THEME.info, fontVariantNumeric: 'tabular-nums' }}>
                {Math.floor(medRemaining / 60)}:{String(medRemaining % 60).padStart(2, '0')}
              </p>
              <button onClick={stopMeditation} style={{
                width: '100%', padding: '6px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: THEME.danger, color: '#fff', marginTop: 6,
              }}>Parar</button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                {[5, 10, 15, 20].map(m => (
                  <button key={m} onClick={() => setMedDuration(m)} style={{
                    padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    background: medDuration === m ? THEME.info : THEME.bgInput, color: medDuration === m ? '#fff' : THEME.textMuted,
                  }}>{m}min</button>
                ))}
              </div>
              <button onClick={startMeditation} style={{
                width: '100%', padding: '8px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                background: meditatedToday ? THEME.info + '30' : THEME.info, color: '#fff',
              }}>
                {meditatedToday ? '✓ Meditar de novo' : 'Iniciar'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New Thought */}
      <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>💭 Novo Pensamento</h3>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          {MOODS.map(m => (
            <button key={m.emoji} onClick={() => setSelectedMood(selectedMood === m.emoji ? null : m.emoji)} style={{
              fontSize: 22, padding: '4px 6px', borderRadius: 8,
              background: selectedMood === m.emoji ? m.color + '30' : 'transparent',
              border: selectedMood === m.emoji ? `2px solid ${m.color}` : '2px solid transparent',
              transition: 'all 0.2s',
            }}>{m.emoji}</button>
          ))}
        </div>
        <textarea value={newThought} onChange={e => setNewThought(e.target.value)}
          placeholder="O que esta na sua mente?"
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addThought(); } }}
          style={{
            width: '100%', minHeight: 70, padding: 12, borderRadius: 10, fontSize: 14,
            background: THEME.bgInput, border: `1px solid ${THEME.border}`, color: THEME.text,
            resize: 'vertical', lineHeight: 1.5,
          }} />
        <button onClick={addThought} disabled={!newThought.trim()} style={{
          width: '100%', padding: '10px', borderRadius: 10, fontSize: 14, fontWeight: 700, marginTop: 8,
          background: newThought.trim() ? THEME.primary : THEME.bgInput, color: newThought.trim() ? '#fff' : THEME.textMuted,
          transition: 'all 0.2s',
        }}>Registrar</button>
      </div>

      {/* Today's Thoughts */}
      <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📝 Pensamentos de Hoje ({todayThoughts.length})</h3>
        {todayThoughts.length === 0 ? (
          <p style={{ fontSize: 13, color: THEME.textMuted, textAlign: 'center', padding: 20 }}>Nenhum pensamento registrado hoje. Como voce esta se sentindo?</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todayThoughts.map(t => (
              <div key={t.id} style={{ display: 'flex', gap: 10, padding: 10, background: THEME.bgInput, borderRadius: 10, alignItems: 'flex-start' }}>
                {t.mood && <span style={{ fontSize: 20, flexShrink: 0 }}>{t.mood}</span>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, lineHeight: 1.5, wordBreak: 'break-word' }}>{t.text}</p>
                  <p style={{ fontSize: 11, color: THEME.textMuted, marginTop: 4 }}>{t.time}</p>
                </div>
                <button onClick={() => deleteThought(t.id)} style={{ fontSize: 14, color: THEME.textMuted, padding: 4, flexShrink: 0 }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// SAUDE TAB
// ==========================================
function SaudeTab({ today }) {
  const [medications, setMedications] = useLocalStorage('medications', []);
  const [medicationLog, setMedicationLog] = useLocalStorage('medicationLog', {});
  const [showAddMed, setShowAddMed] = useState(false);
  const [medForm, setMedForm] = useState({ name: '', dosage: '', times: ['08:00'], color: '#3B82F6' });

  const MED_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#FF6B35'];

  const todayLog = medicationLog[today] || {};
  const totalDoses = medications.reduce((sum, m) => sum + m.times.length, 0);
  const takenDoses = Object.values(todayLog).filter(Boolean).length;
  const progress = totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 0;

  const toggleDose = (medId, time) => {
    const key = `${medId}_${time}`;
    setMedicationLog(prev => ({
      ...prev,
      [today]: { ...(prev[today] || {}), [key]: !(prev[today] || {})[key] }
    }));
  };

  const addMedication = () => {
    if (!medForm.name.trim()) return;
    setMedications(prev => [...prev, { id: genId(), ...medForm }]);
    setMedForm({ name: '', dosage: '', times: ['08:00'], color: '#3B82F6' });
    setShowAddMed(false);
  };

  const deleteMedication = (id) => {
    setMedications(prev => prev.filter(m => m.id !== id));
  };

  const addTimeSlot = () => {
    setMedForm(prev => ({ ...prev, times: [...prev.times, '12:00'] }));
  };

  const removeTimeSlot = (idx) => {
    setMedForm(prev => ({ ...prev, times: prev.times.filter((_, i) => i !== idx) }));
  };

  const updateTime = (idx, val) => {
    setMedForm(prev => ({ ...prev, times: prev.times.map((t, i) => i === idx ? val : t) }));
  };

  const currentHour = new Date().getHours();
  const currentMin = new Date().getMinutes();

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Progress */}
      <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 16, textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 10px' }}>
          <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="42" fill="none" stroke={THEME.bgInput} strokeWidth="8" />
            <circle cx="50" cy="50" r="42" fill="none" stroke={progress >= 100 ? THEME.success : THEME.primary}
              strokeWidth="8" strokeLinecap="round" strokeDasharray={`${progress * 2.64} 264`}
              style={{ transition: 'stroke-dasharray 0.5s ease' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 22, fontWeight: 800 }}>{takenDoses}/{totalDoses}</span>
            <span style={{ fontSize: 10, color: THEME.textMuted }}>doses</span>
          </div>
        </div>
        <p style={{ fontSize: 14, fontWeight: 600, color: progress >= 100 ? THEME.success : THEME.textSecondary }}>
          {progress >= 100 ? '✓ Todas as medicacoes tomadas!' : totalDoses === 0 ? 'Adicione suas medicacoes' : `${Math.round(progress)}% concluido`}
        </p>
      </div>

      {/* Medication Checklist */}
      {medications.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {medications.map(med => (
            <div key={med.id} style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 14, padding: 14, borderLeft: `4px solid ${med.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700 }}>{med.name}</p>
                  {med.dosage && <p style={{ fontSize: 12, color: THEME.textMuted }}>{med.dosage}</p>}
                </div>
                <button onClick={() => deleteMedication(med.id)} style={{ fontSize: 13, color: THEME.textMuted, padding: 4 }}>🗑️</button>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {med.times.sort().map(time => {
                  const key = `${med.id}_${time}`;
                  const taken = todayLog[key] || false;
                  const [h, m] = time.split(':').map(Number);
                  const isPastTime = currentHour > h || (currentHour === h && currentMin > m);
                  const isOverdue = isPastTime && !taken;
                  return (
                    <button key={time} onClick={() => toggleDose(med.id, time)} style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 10,
                      background: taken ? THEME.success + '20' : isOverdue ? THEME.danger + '15' : THEME.bgInput,
                      border: `1px solid ${taken ? THEME.success + '50' : isOverdue ? THEME.danger + '40' : THEME.border}`,
                      transition: 'all 0.2s',
                    }}>
                      <span style={{ fontSize: 16 }}>{taken ? '✅' : isOverdue ? '⚠️' : '⏰'}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: taken ? THEME.success : isOverdue ? THEME.danger : THEME.text }}>{time}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Medication */}
      {showAddMed ? (
        <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.primary}40`, borderRadius: 16, padding: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Nova Medicacao</h3>
          <input value={medForm.name} onChange={e => setMedForm(p => ({ ...p, name: e.target.value }))}
            placeholder="Nome do medicamento" style={{
              width: '100%', padding: 10, borderRadius: 10, fontSize: 14,
              background: THEME.bgInput, border: `1px solid ${THEME.border}`, marginBottom: 8, color: THEME.text,
            }} />
          <input value={medForm.dosage} onChange={e => setMedForm(p => ({ ...p, dosage: e.target.value }))}
            placeholder="Dosagem (ex: 500mg)" style={{
              width: '100%', padding: 10, borderRadius: 10, fontSize: 14,
              background: THEME.bgInput, border: `1px solid ${THEME.border}`, marginBottom: 8, color: THEME.text,
            }} />
          <p style={{ fontSize: 12, color: THEME.textSecondary, marginBottom: 6 }}>Horarios:</p>
          {medForm.times.map((time, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              <input type="time" value={time} onChange={e => updateTime(idx, e.target.value)} style={{
                flex: 1, padding: 8, borderRadius: 8, fontSize: 14,
                background: THEME.bgInput, border: `1px solid ${THEME.border}`, color: THEME.text,
              }} />
              {medForm.times.length > 1 && (
                <button onClick={() => removeTimeSlot(idx)} style={{ padding: '0 10px', color: THEME.danger, fontSize: 16 }}>✕</button>
              )}
            </div>
          ))}
          <button onClick={addTimeSlot} style={{ fontSize: 12, color: THEME.info, padding: '6px 0', fontWeight: 600 }}>+ Adicionar horario</button>
          <p style={{ fontSize: 12, color: THEME.textSecondary, margin: '8px 0 6px' }}>Cor:</p>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
            {MED_COLORS.map(c => (
              <button key={c} onClick={() => setMedForm(p => ({ ...p, color: c }))} style={{
                width: 28, height: 28, borderRadius: 8, background: c,
                border: medForm.color === c ? '3px solid #fff' : '3px solid transparent',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowAddMed(false)} style={{ flex: 1, padding: 10, borderRadius: 10, fontSize: 14, fontWeight: 600, background: THEME.bgInput, color: THEME.textSecondary }}>Cancelar</button>
            <button onClick={addMedication} style={{ flex: 1, padding: 10, borderRadius: 10, fontSize: 14, fontWeight: 700, background: THEME.primary, color: '#fff' }}>Salvar</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAddMed(true)} style={{
          width: '100%', padding: 14, borderRadius: 14, fontSize: 14, fontWeight: 700,
          background: THEME.bgCard, border: `2px dashed ${THEME.border}`, color: THEME.textSecondary,
          transition: 'all 0.2s',
        }}>
          + Adicionar Medicacao
        </button>
      )}
    </div>
  );
}

// ==========================================
// EXERCICIO TAB
// ==========================================
function ExercicioTab({ today }) {
  const [exerciseLog, setExerciseLog] = useLocalStorage('exerciseLog', []);
  const [showLog, setShowLog] = useState(false);
  const [exForm, setExForm] = useState({ type: '', duration: 30, intensity: 'moderado', notes: '' });

  const todayExercises = exerciseLog.filter(e => e.date === today);
  const exercisedToday = todayExercises.length > 0;

  // Streak
  const getStreak = () => {
    let streak = 0;
    const d = new Date();
    while (true) {
      const ds = d.toISOString().split('T')[0];
      if (exerciseLog.some(e => e.date === ds)) { streak++; d.setDate(d.getDate() - 1); }
      else if (ds === today) { d.setDate(d.getDate() - 1); }
      else break;
    }
    return streak;
  };

  // Weekly data
  const getWeekData = () => {
    const data = [];
    const d = new Date();
    const dayOfWeek = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    for (let i = 0; i < 7; i++) {
      const dd = new Date(monday);
      dd.setDate(monday.getDate() + i);
      const ds = dd.toISOString().split('T')[0];
      const mins = exerciseLog.filter(e => e.date === ds).reduce((sum, e) => sum + (e.duration || 0), 0);
      data.push({ date: ds, day: ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i], mins, isToday: ds === today });
    }
    return data;
  };

  const weekData = getWeekData();
  const maxMins = Math.max(...weekData.map(d => d.mins), 30);
  const weekTotal = weekData.reduce((sum, d) => sum + d.mins, 0);
  const streak = getStreak();

  const logExercise = () => {
    if (!exForm.type) return;
    setExerciseLog(prev => [...prev, { id: genId(), ...exForm, date: today }]);
    setExForm({ type: '', duration: 30, intensity: 'moderado', notes: '' });
    setShowLog(false);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 14, padding: 12, textAlign: 'center' }}>
          <p style={{ fontSize: 26, fontWeight: 800, color: streak > 3 ? THEME.accent : THEME.text }}>{streak > 3 ? '🔥' : ''}{streak}</p>
          <p style={{ fontSize: 10, color: THEME.textMuted }}>Streak (dias)</p>
        </div>
        <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 14, padding: 12, textAlign: 'center' }}>
          <p style={{ fontSize: 26, fontWeight: 800, color: THEME.success }}>{weekTotal}</p>
          <p style={{ fontSize: 10, color: THEME.textMuted }}>Min. semana</p>
        </div>
        <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 14, padding: 12, textAlign: 'center' }}>
          <p style={{ fontSize: 26, fontWeight: 800, color: exercisedToday ? THEME.success : THEME.textMuted }}>{exercisedToday ? '✓' : '—'}</p>
          <p style={{ fontSize: 10, color: THEME.textMuted }}>Hoje</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📊 Esta Semana</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100 }}>
          {weekData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 10, color: THEME.textMuted }}>{d.mins > 0 ? d.mins : ''}</span>
              <div style={{
                width: '100%', borderRadius: 6, minHeight: 4,
                height: d.mins > 0 ? `${(d.mins / maxMins) * 70}px` : 4,
                background: d.mins > 0 ? (d.isToday ? THEME.primary : THEME.success) : THEME.bgInput,
                transition: 'height 0.5s ease',
              }} />
              <span style={{ fontSize: 10, fontWeight: d.isToday ? 800 : 500, color: d.isToday ? THEME.primary : THEME.textMuted }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Motivation or Today's Exercise */}
      {!exercisedToday && !showLog && (
        <div style={{
          background: `linear-gradient(135deg, ${THEME.primary}20, ${THEME.accent}15)`,
          border: `1px solid ${THEME.primary}40`, borderRadius: 16, padding: 20, textAlign: 'center',
        }}>
          <span style={{ fontSize: 40 }}>💪</span>
          <p style={{ fontSize: 16, fontWeight: 700, marginTop: 8 }}>Seu corpo pede movimento!</p>
          <p style={{ fontSize: 13, color: THEME.textSecondary, margin: '6px 0 14px' }}>Que tal pelo menos 20 minutos hoje?</p>
          <button onClick={() => setShowLog(true)} style={{
            padding: '12px 32px', borderRadius: 12, fontSize: 16, fontWeight: 800,
            background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.accent})`, color: '#fff',
            animation: 'pulse 2s ease-in-out infinite',
          }}>VAMOS LA!</button>
        </div>
      )}

      {todayExercises.length > 0 && (
        <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.success}40`, borderRadius: 16, padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: THEME.success }}>✅ Treinos de Hoje</h3>
          {todayExercises.map(ex => {
            const type = EXERCISE_TYPES.find(t => t.id === ex.type) || { emoji: '⚡', label: ex.type };
            return (
              <div key={ex.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${THEME.border}` }}>
                <span style={{ fontSize: 22 }}>{type.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{type.label}</p>
                  <p style={{ fontSize: 12, color: THEME.textMuted }}>{ex.duration}min - {ex.intensity}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Log Exercise Form */}
      {showLog ? (
        <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.primary}40`, borderRadius: 16, padding: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Registrar Treino</h3>
          <p style={{ fontSize: 12, color: THEME.textSecondary, marginBottom: 8 }}>Tipo de exercicio:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 12 }}>
            {EXERCISE_TYPES.map(t => (
              <button key={t.id} onClick={() => setExForm(p => ({ ...p, type: t.id }))} style={{
                padding: '10px 4px', borderRadius: 10, fontSize: 11, fontWeight: 600, textAlign: 'center',
                background: exForm.type === t.id ? THEME.primary + '30' : THEME.bgInput,
                border: `1px solid ${exForm.type === t.id ? THEME.primary : THEME.border}`,
                color: exForm.type === t.id ? THEME.primary : THEME.textSecondary,
              }}>
                <span style={{ fontSize: 20, display: 'block', marginBottom: 2 }}>{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>

          <p style={{ fontSize: 12, color: THEME.textSecondary, marginBottom: 6 }}>Duracao (minutos):</p>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {[15, 20, 30, 45, 60, 90].map(m => (
              <button key={m} onClick={() => setExForm(p => ({ ...p, duration: m }))} style={{
                flex: 1, padding: 8, borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: exForm.duration === m ? THEME.primary : THEME.bgInput,
                color: exForm.duration === m ? '#fff' : THEME.textMuted,
              }}>{m}</button>
            ))}
          </div>

          <p style={{ fontSize: 12, color: THEME.textSecondary, marginBottom: 6 }}>Intensidade:</p>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {[{ id: 'leve', label: 'Leve', color: THEME.success }, { id: 'moderado', label: 'Moderado', color: THEME.accent }, { id: 'intenso', label: 'Intenso', color: THEME.danger }].map(i => (
              <button key={i.id} onClick={() => setExForm(p => ({ ...p, intensity: i.id }))} style={{
                flex: 1, padding: 8, borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: exForm.intensity === i.id ? i.color + '25' : THEME.bgInput,
                border: `1px solid ${exForm.intensity === i.id ? i.color : THEME.border}`,
                color: exForm.intensity === i.id ? i.color : THEME.textMuted,
              }}>{i.label}</button>
            ))}
          </div>

          <textarea value={exForm.notes} onChange={e => setExForm(p => ({ ...p, notes: e.target.value }))}
            placeholder="Notas (opcional)" style={{
              width: '100%', minHeight: 50, padding: 10, borderRadius: 10, fontSize: 13,
              background: THEME.bgInput, border: `1px solid ${THEME.border}`, color: THEME.text,
              resize: 'none', marginBottom: 10,
            }} />

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowLog(false)} style={{ flex: 1, padding: 10, borderRadius: 10, fontSize: 14, fontWeight: 600, background: THEME.bgInput, color: THEME.textSecondary }}>Cancelar</button>
            <button onClick={logExercise} disabled={!exForm.type} style={{
              flex: 1, padding: 10, borderRadius: 10, fontSize: 14, fontWeight: 700,
              background: exForm.type ? THEME.primary : THEME.bgInput, color: exForm.type ? '#fff' : THEME.textMuted,
            }}>Registrar</button>
          </div>
        </div>
      ) : exercisedToday ? (
        <button onClick={() => setShowLog(true)} style={{
          width: '100%', padding: 14, borderRadius: 14, fontSize: 14, fontWeight: 700,
          background: THEME.bgCard, border: `2px dashed ${THEME.border}`, color: THEME.textSecondary,
        }}>
          + Registrar Outro Treino
        </button>
      ) : null}
    </div>
  );
}
