import { useState, useRef } from 'react';
import Head from 'next/head';
import { useLocalStorage, todayStr, formatDate, daysUntil, genId, THEME, WEEKDAYS_FULL, MONTHS } from '@/lib/store';

const TABS = [
  { id: 'financas', icon: '💰', label: 'Financas', color: '#6366F1' },
  { id: 'familia', icon: '👨‍👧', label: 'Familia', color: '#EC4899' },
  { id: 'rotina', icon: '⚡', label: 'Rotina', color: '#F59E0B' },
  { id: 'config', icon: '⚙️', label: 'Config', color: '#9CA3AF' },
];

export default function MaisPage() {
  const [tab, setTab] = useState('financas');
  const activeTab = TABS.find(t => t.id === tab);

  return (
    <>
      <Head><title>Mais | Meu Ultimo Suspiro</title></Head>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px 16px 100px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>☰ Mais</h1>
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: THEME.bgCard, borderRadius: 14, padding: 4 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '9px 4px', borderRadius: 11, fontSize: 11, fontWeight: 600,
              background: tab === t.id ? t.color + '25' : 'transparent',
              color: tab === t.id ? t.color : THEME.textMuted,
              border: tab === t.id ? `1px solid ${t.color}40` : '1px solid transparent',
              transition: 'all 0.2s',
            }}>
              {t.icon}<br />{t.label}
            </button>
          ))}
        </div>
        {tab === 'financas' && <FinancasTab />}
        {tab === 'familia' && <FamiliaTab />}
        {tab === 'rotina' && <RotinaTab />}
        {tab === 'config' && <ConfigTab />}
      </div>
    </>
  );
}

// ==========================================
// FINANCAS TAB
// ==========================================
function FinancasTab() {
  const [finances, setFinances] = useLocalStorage('finances', []);
  const [installments, setInstallments] = useLocalStorage('installments', []);
  const [showAddBill, setShowAddBill] = useState(false);
  const [showAddInstallment, setShowAddInstallment] = useState(false);
  const [billForm, setBillForm] = useState({ description: '', amount: '', dueDay: 10, category: 'pessoal' });
  const [instForm, setInstForm] = useState({ description: '', installmentAmount: '', totalInstallments: 12, paidInstallments: 0, dueDay: 10 });

  const today = new Date();
  const currentYM = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  const monthBills = finances.map(f => ({
    ...f,
    paid: (f.paid && f.paid[currentYM]) || false,
  })).sort((a, b) => a.dueDay - b.dueDay);

  const totalDue = monthBills.reduce((s, b) => s + (Number(b.amount) || 0), 0);
  const totalPaid = monthBills.filter(b => b.paid).reduce((s, b) => s + (Number(b.amount) || 0), 0);
  const remaining = totalDue - totalPaid;

  const togglePaid = (id) => {
    setFinances(prev => prev.map(f => f.id === id ? { ...f, paid: { ...f.paid, [currentYM]: !(f.paid && f.paid[currentYM]) } } : f));
  };

  const deleteBill = (id) => setFinances(prev => prev.filter(f => f.id !== id));

  const addBill = () => {
    if (!billForm.description.trim() || !billForm.amount) return;
    setFinances(prev => [...prev, { id: genId(), ...billForm, amount: Number(billForm.amount), paid: {} }]);
    setBillForm({ description: '', amount: '', dueDay: 10, category: 'pessoal' });
    setShowAddBill(false);
  };

  const addInstallment = () => {
    if (!instForm.description.trim() || !instForm.installmentAmount) return;
    setInstallments(prev => [...prev, { id: genId(), ...instForm, installmentAmount: Number(instForm.installmentAmount) }]);
    setInstForm({ description: '', installmentAmount: '', totalInstallments: 12, paidInstallments: 0, dueDay: 10 });
    setShowAddInstallment(false);
  };

  const payInstallment = (id) => {
    setInstallments(prev => prev.map(i => i.id === id ? { ...i, paidInstallments: Math.min(i.paidInstallments + 1, i.totalInstallments) } : i));
  };

  const deleteInstallment = (id) => setInstallments(prev => prev.filter(i => i.id !== id));

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 10, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: THEME.textMuted }}>Total Mes</p>
          <p style={{ fontSize: 16, fontWeight: 800, color: '#6366F1' }}>R$ {totalDue.toFixed(0)}</p>
        </div>
        <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 10, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: THEME.textMuted }}>Pago</p>
          <p style={{ fontSize: 16, fontWeight: 800, color: THEME.success }}>R$ {totalPaid.toFixed(0)}</p>
        </div>
        <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 10, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: THEME.textMuted }}>Restante</p>
          <p style={{ fontSize: 16, fontWeight: 800, color: remaining > 0 ? THEME.danger : THEME.success }}>R$ {remaining.toFixed(0)}</p>
        </div>
      </div>

      {/* Bills */}
      <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>📋 Contas do Mes</h3>
          <button onClick={() => setShowAddBill(true)} style={{ fontSize: 12, color: '#6366F1', fontWeight: 700 }}>+ Adicionar</button>
        </div>
        {monthBills.length === 0 ? (
          <p style={{ fontSize: 13, color: THEME.textMuted, textAlign: 'center', padding: 16 }}>Nenhuma conta cadastrada</p>
        ) : monthBills.map(b => {
          const isOverdue = !b.paid && b.dueDay < today.getDate();
          return (
            <div key={b.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
              borderBottom: `1px solid ${THEME.border}20`,
            }}>
              <button onClick={() => togglePaid(b.id)} style={{
                width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                background: b.paid ? THEME.success : 'transparent',
                border: `2px solid ${b.paid ? THEME.success : isOverdue ? THEME.danger : THEME.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff',
              }}>{b.paid ? '✓' : ''}</button>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, textDecoration: b.paid ? 'line-through' : 'none', color: b.paid ? THEME.textMuted : THEME.text }}>{b.description}</p>
                <p style={{ fontSize: 11, color: isOverdue ? THEME.danger : THEME.textMuted }}>Dia {b.dueDay} {isOverdue ? '- VENCIDA!' : ''}</p>
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: b.paid ? THEME.textMuted : '#6366F1' }}>R$ {Number(b.amount).toFixed(2)}</p>
              <button onClick={() => deleteBill(b.id)} style={{ fontSize: 12, color: THEME.textMuted }}>✕</button>
            </div>
          );
        })}
      </div>

      {/* Installments */}
      <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>💳 Financiamentos / Parcelas</h3>
          <button onClick={() => setShowAddInstallment(true)} style={{ fontSize: 12, color: '#6366F1', fontWeight: 700 }}>+ Adicionar</button>
        </div>
        {installments.length === 0 ? (
          <p style={{ fontSize: 13, color: THEME.textMuted, textAlign: 'center', padding: 16 }}>Nenhum financiamento cadastrado</p>
        ) : installments.map(inst => {
          const progress = inst.totalInstallments > 0 ? (inst.paidInstallments / inst.totalInstallments) * 100 : 0;
          const remaining = inst.totalInstallments - inst.paidInstallments;
          return (
            <div key={inst.id} style={{ padding: '10px 0', borderBottom: `1px solid ${THEME.border}20` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{inst.description}</p>
                  <p style={{ fontSize: 12, color: THEME.textMuted }}>R$ {Number(inst.installmentAmount).toFixed(2)}/mes - Dia {inst.dueDay}</p>
                </div>
                <button onClick={() => deleteInstallment(inst.id)} style={{ fontSize: 12, color: THEME.textMuted }}>✕</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <div style={{ flex: 1, height: 6, background: THEME.bgInput, borderRadius: 3 }}>
                  <div style={{ height: '100%', borderRadius: 3, background: progress >= 100 ? THEME.success : '#6366F1', width: `${progress}%`, transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: 11, color: THEME.textMuted, whiteSpace: 'nowrap' }}>{inst.paidInstallments}/{inst.totalInstallments}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <span style={{ fontSize: 11, color: remaining > 0 ? THEME.accent : THEME.success }}>
                  {remaining > 0 ? `Faltam ${remaining} parcela${remaining > 1 ? 's' : ''}` : '✅ Quitado!'}
                </span>
                {remaining > 0 && (
                  <button onClick={() => payInstallment(inst.id)} style={{
                    padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                    background: THEME.success + '20', color: THEME.success, border: `1px solid ${THEME.success}40`,
                  }}>Pagar parcela</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Bill Modal */}
      {showAddBill && (
        <Modal onClose={() => setShowAddBill(false)}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Nova Conta</h3>
          <input value={billForm.description} onChange={e => setBillForm(p => ({ ...p, description: e.target.value }))}
            placeholder="Descricao (ex: Aluguel)" style={inputS} />
          <input type="number" value={billForm.amount} onChange={e => setBillForm(p => ({ ...p, amount: e.target.value }))}
            placeholder="Valor (R$)" style={inputS} />
          <label style={labelS}>Dia de vencimento</label>
          <input type="number" min="1" max="31" value={billForm.dueDay} onChange={e => setBillForm(p => ({ ...p, dueDay: Number(e.target.value) }))} style={inputS} />
          <BtnRow onCancel={() => setShowAddBill(false)} onSave={addBill} color="#6366F1" />
        </Modal>
      )}

      {/* Add Installment Modal */}
      {showAddInstallment && (
        <Modal onClose={() => setShowAddInstallment(false)}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Novo Financiamento</h3>
          <input value={instForm.description} onChange={e => setInstForm(p => ({ ...p, description: e.target.value }))}
            placeholder="Descricao (ex: Financiamento carro)" style={inputS} />
          <input type="number" value={instForm.installmentAmount} onChange={e => setInstForm(p => ({ ...p, installmentAmount: e.target.value }))}
            placeholder="Valor da parcela (R$)" style={inputS} />
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={labelS}>Total parcelas</label>
              <input type="number" value={instForm.totalInstallments} onChange={e => setInstForm(p => ({ ...p, totalInstallments: Number(e.target.value) }))} style={inputS} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelS}>Ja pagas</label>
              <input type="number" value={instForm.paidInstallments} onChange={e => setInstForm(p => ({ ...p, paidInstallments: Number(e.target.value) }))} style={inputS} />
            </div>
          </div>
          <label style={labelS}>Dia de vencimento</label>
          <input type="number" min="1" max="31" value={instForm.dueDay} onChange={e => setInstForm(p => ({ ...p, dueDay: Number(e.target.value) }))} style={inputS} />
          <BtnRow onCancel={() => setShowAddInstallment(false)} onSave={addInstallment} color="#6366F1" />
        </Modal>
      )}
    </div>
  );
}

// ==========================================
// FAMILIA TAB
// ==========================================
function FamiliaTab() {
  const [daughter, setDaughter] = useLocalStorage('daughter', []);
  const [fabiana, setFabiana] = useLocalStorage('fabiana', []);
  const [showAdd, setShowAdd] = useState(null); // 'daughter' | 'fabiana' | null
  const [form, setForm] = useState({ title: '', date: '', time: '', notes: '', important: false });

  const today = todayStr();

  const addEvent = () => {
    if (!form.title.trim() || !form.date) return;
    const entry = { id: genId(), ...form };
    if (showAdd === 'daughter') setDaughter(prev => [...prev, entry]);
    else setFabiana(prev => [...prev, entry]);
    setForm({ title: '', date: '', time: '', notes: '', important: false });
    setShowAdd(null);
  };

  const deleteEvent = (list, setList, id) => setList(prev => prev.filter(e => e.id !== id));

  const sortedDaughter = [...daughter].filter(d => d.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const sortedFabiana = [...fabiana].filter(f => f.date >= today).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Daughter */}
      <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>👧 Minha Filha</h3>
          <button onClick={() => setShowAdd('daughter')} style={{ fontSize: 12, color: '#EC4899', fontWeight: 700 }}>+ Adicionar</button>
        </div>
        {sortedDaughter.length === 0 ? (
          <p style={{ fontSize: 13, color: THEME.textMuted, textAlign: 'center', padding: 16 }}>Nenhum evento cadastrado</p>
        ) : sortedDaughter.slice(0, 5).map(ev => {
          const days = daysUntil(ev.date);
          return (
            <div key={ev.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: `1px solid ${THEME.border}20`, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EC4899' + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 18 }}>👧</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{ev.title}</p>
                <p style={{ fontSize: 11, color: THEME.textMuted }}>{formatDate(ev.date)} {ev.time && `as ${ev.time}`}</p>
                {ev.notes && <p style={{ fontSize: 11, color: THEME.textMuted }}>{ev.notes}</p>}
              </div>
              <span style={{ fontSize: 10, color: days <= 3 ? THEME.accent : THEME.textMuted, fontWeight: 600 }}>
                {days === 0 ? 'Hoje!' : days === 1 ? 'Amanha' : `${days}d`}
              </span>
              <button onClick={() => deleteEvent(daughter, setDaughter, ev.id)} style={{ fontSize: 12, color: THEME.textMuted }}>✕</button>
            </div>
          );
        })}
      </div>

      {/* Fabiana */}
      <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>💜 Fabiana</h3>
          <button onClick={() => setShowAdd('fabiana')} style={{ fontSize: 12, color: '#EC4899', fontWeight: 700 }}>+ Adicionar</button>
        </div>
        {sortedFabiana.length === 0 ? (
          <p style={{ fontSize: 13, color: THEME.textMuted, textAlign: 'center', padding: 16 }}>Nenhum evento cadastrado</p>
        ) : sortedFabiana.slice(0, 5).map(ev => {
          const days = daysUntil(ev.date);
          return (
            <div key={ev.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: `1px solid ${THEME.border}20`, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EC4899' + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 18 }}>{ev.important ? '⭐' : '💜'}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{ev.title}</p>
                <p style={{ fontSize: 11, color: THEME.textMuted }}>{formatDate(ev.date)} {ev.time && `as ${ev.time}`}</p>
                {ev.notes && <p style={{ fontSize: 11, color: THEME.textMuted }}>{ev.notes}</p>}
              </div>
              <span style={{ fontSize: 10, color: days <= 3 ? THEME.accent : THEME.textMuted, fontWeight: 600 }}>
                {days === 0 ? 'Hoje!' : days === 1 ? 'Amanha' : `${days}d`}
              </span>
              <button onClick={() => deleteEvent(fabiana, setFabiana, ev.id)} style={{ fontSize: 12, color: THEME.textMuted }}>✕</button>
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {showAdd && (
        <Modal onClose={() => setShowAdd(null)}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
            {showAdd === 'daughter' ? '👧 Evento da Filha' : '💜 Evento da Fabiana'}
          </h3>
          <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="Titulo do evento" style={inputS} />
          <label style={labelS}>Data</label>
          <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={inputS} />
          <label style={labelS}>Horario (opcional)</label>
          <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} style={inputS} />
          <input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            placeholder="Observacoes" style={inputS} />
          {showAdd === 'fabiana' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: THEME.textSecondary, marginBottom: 12 }}>
              <input type="checkbox" checked={form.important} onChange={e => setForm(p => ({ ...p, important: e.target.checked }))} />
              ⭐ Marcar como importante
            </label>
          )}
          <BtnRow onCancel={() => setShowAdd(null)} onSave={addEvent} color="#EC4899" />
        </Modal>
      )}
    </div>
  );
}

// ==========================================
// ROTINA TAB
// ==========================================
function RotinaTab() {
  const [dailyRoutine, setDailyRoutine] = useLocalStorage('dailyRoutine', DEFAULT_ROUTINE);
  const [routineLog, setRoutineLog] = useLocalStorage('routineLog', {});
  const [habits, setHabits] = useLocalStorage('habits', []);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [habitForm, setHabitForm] = useState({ name: '', frequency: 'diario' });

  const today = todayStr();
  const todayLog = routineLog[today] || {};
  const completedRoutine = Object.values(todayLog).filter(Boolean).length;
  const enabledRoutine = dailyRoutine.filter(r => r.enabled);
  const routineProgress = enabledRoutine.length > 0 ? (completedRoutine / enabledRoutine.length) * 100 : 0;

  const toggleRoutineItem = (id) => {
    setRoutineLog(prev => ({ ...prev, [today]: { ...(prev[today] || {}), [id]: !(prev[today] || {})[id] } }));
  };

  const addHabit = () => {
    if (!habitForm.name.trim()) return;
    setHabits(prev => [...prev, { id: genId(), ...habitForm, log: {} }]);
    setHabitForm({ name: '', frequency: 'diario' });
    setShowAddHabit(false);
  };

  const toggleHabit = (id) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, log: { ...h.log, [today]: !h.log[today] } } : h));
  };

  const deleteHabit = (id) => setHabits(prev => prev.filter(h => h.id !== id));

  const getHabitStreak = (habit) => {
    let streak = 0;
    const d = new Date();
    while (true) {
      const ds = d.toISOString().split('T')[0];
      if (habit.log[ds]) { streak++; d.setDate(d.getDate() - 1); }
      else if (ds === today) { d.setDate(d.getDate() - 1); }
      else break;
    }
    return streak;
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Daily Routine Progress */}
      <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 16, textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 10px' }}>
          <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="42" fill="none" stroke={THEME.bgInput} strokeWidth="8" />
            <circle cx="50" cy="50" r="42" fill="none" stroke={routineProgress >= 100 ? THEME.success : '#F59E0B'}
              strokeWidth="8" strokeLinecap="round" strokeDasharray={`${routineProgress * 2.64} 264`}
              style={{ transition: 'stroke-dasharray 0.5s' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 20, fontWeight: 800 }}>{Math.round(routineProgress)}%</span>
            <span style={{ fontSize: 9, color: THEME.textMuted }}>do dia</span>
          </div>
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, color: routineProgress >= 100 ? THEME.success : THEME.textSecondary }}>
          {routineProgress >= 100 ? '🎉 Dia completo!' : `${completedRoutine}/${enabledRoutine.length} atividades`}
        </p>
      </div>

      {/* Daily Checklist */}
      <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📋 Rotina do Dia</h3>
        {enabledRoutine.map(item => {
          const done = todayLog[item.id] || false;
          return (
            <button key={item.id} onClick={() => toggleRoutineItem(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 0',
              borderBottom: `1px solid ${THEME.border}15`, textAlign: 'left',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                background: done ? THEME.success : 'transparent',
                border: `2px solid ${done ? THEME.success : THEME.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff',
              }}>{done ? '✓' : ''}</div>
              <span style={{ flex: 1, fontSize: 14, color: done ? THEME.textMuted : THEME.text, textDecoration: done ? 'line-through' : 'none' }}>{item.task}</span>
              <span style={{ fontSize: 11, color: THEME.textMuted }}>{item.time}</span>
            </button>
          );
        })}
      </div>

      {/* Habits Tracker */}
      <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>🎯 Habitos</h3>
          <button onClick={() => setShowAddHabit(true)} style={{ fontSize: 12, color: '#F59E0B', fontWeight: 700 }}>+ Adicionar</button>
        </div>
        {habits.length === 0 ? (
          <p style={{ fontSize: 13, color: THEME.textMuted, textAlign: 'center', padding: 16 }}>Adicione habitos para acompanhar sua evolucao!</p>
        ) : habits.map(h => {
          const done = h.log[today];
          const streak = getHabitStreak(h);
          return (
            <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${THEME.border}15` }}>
              <button onClick={() => toggleHabit(h.id)} style={{
                width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                background: done ? '#F59E0B' : 'transparent',
                border: `2px solid ${done ? '#F59E0B' : THEME.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff',
              }}>{done ? '✓' : ''}</button>
              <span style={{ flex: 1, fontSize: 14 }}>{h.name}</span>
              {streak > 0 && <span style={{ fontSize: 11, color: '#F59E0B', fontWeight: 700 }}>🔥{streak}</span>}
              <button onClick={() => deleteHabit(h.id)} style={{ fontSize: 12, color: THEME.textMuted }}>✕</button>
            </div>
          );
        })}
      </div>

      {/* Add Habit Modal */}
      {showAddHabit && (
        <Modal onClose={() => setShowAddHabit(false)}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Novo Habito</h3>
          <input value={habitForm.name} onChange={e => setHabitForm(p => ({ ...p, name: e.target.value }))}
            placeholder="Nome do habito (ex: Ler 15min)" style={inputS} />
          <BtnRow onCancel={() => setShowAddHabit(false)} onSave={addHabit} color="#F59E0B" />
        </Modal>
      )}
    </div>
  );
}

// ==========================================
// CONFIG TAB
// ==========================================
function ConfigTab() {
  const [userName, setUserName] = useLocalStorage('userName', '');
  const fileInputRef = useRef(null);
  const [exportMsg, setExportMsg] = useState('');

  const exportData = () => {
    const data = {};
    const keys = ['userName', 'thoughts', 'prayerLog', 'meditationLog', 'medications', 'medicationLog',
      'exerciseLog', 'schedule', 'shifts', 'tasks', 'postgrad', 'studyLog', 'finances', 'installments',
      'daughter', 'fabiana', 'dailyRoutine', 'routineLog', 'habits'];
    keys.forEach(k => {
      const val = localStorage.getItem(k);
      if (val) data[k] = JSON.parse(val);
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meu-ultimo-suspiro-backup-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportMsg('Backup exportado!');
    setTimeout(() => setExportMsg(''), 3000);
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
        window.location.reload();
      } catch (err) {
        alert('Erro ao importar dados. Verifique o arquivo.');
      }
    };
    reader.readAsText(file);
  };

  const resetData = () => {
    if (confirm('TEM CERTEZA? Isso apagara TODOS os seus dados. Esta acao nao pode ser desfeita!')) {
      if (confirm('Ultima chance! Realmente deseja apagar tudo?')) {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Profile */}
      <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>👤 Perfil</h3>
        <label style={labelS}>Seu nome</label>
        <input value={userName} onChange={e => setUserName(e.target.value)}
          placeholder="Como quer ser chamado?" style={inputS} />
      </div>

      {/* Data Management */}
      <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>💾 Dados</h3>
        <button onClick={exportData} style={{
          width: '100%', padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 600, marginBottom: 8,
          background: THEME.info + '20', color: THEME.info, border: `1px solid ${THEME.info}40`,
        }}>📥 Exportar Backup (JSON)</button>
        {exportMsg && <p style={{ fontSize: 12, color: THEME.success, marginBottom: 8 }}>{exportMsg}</p>}
        <button onClick={() => fileInputRef.current?.click()} style={{
          width: '100%', padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 600, marginBottom: 8,
          background: THEME.success + '20', color: THEME.success, border: `1px solid ${THEME.success}40`,
        }}>📤 Importar Backup</button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
        <button onClick={resetData} style={{
          width: '100%', padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 600,
          background: THEME.danger + '15', color: THEME.danger, border: `1px solid ${THEME.danger}30`,
        }}>🗑️ Apagar Todos os Dados</button>
      </div>

      {/* About */}
      <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 16, textAlign: 'center' }}>
        <span style={{ fontSize: 40 }}>🔥</span>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 8 }}>Meu Ultimo Suspiro</h3>
        <p style={{ fontSize: 12, color: THEME.textMuted, marginTop: 4 }}>v1.0.0</p>
        <p style={{ fontSize: 13, color: THEME.textSecondary, marginTop: 8, lineHeight: 1.6, fontStyle: 'italic' }}>
          "Cada respiro e uma chance de fazer diferente. Organize sua vida. Cuide de quem voce ama. Seja a melhor versao de si mesmo."
        </p>
      </div>
    </div>
  );
}

// ==========================================
// DEFAULT ROUTINE
// ==========================================
const DEFAULT_ROUTINE = [
  { id: 'r1', task: '🌅 Acordar', time: '05:30', enabled: true },
  { id: 'r2', task: '🙏 Oracao matinal', time: '05:40', enabled: true },
  { id: 'r3', task: '💊 Tomar medicacao', time: '06:00', enabled: true },
  { id: 'r4', task: '💪 Exercicio fisico', time: '06:15', enabled: true },
  { id: 'r5', task: '🚿 Banho e preparo', time: '07:00', enabled: true },
  { id: 'r6', task: '☕ Cafe da manha', time: '07:30', enabled: true },
  { id: 'r7', task: '💼 Trabalho / Plantao', time: '08:00', enabled: true },
  { id: 'r8', task: '🍽️ Almoco', time: '12:00', enabled: true },
  { id: 'r9', task: '💊 Medicacao do almoco', time: '12:30', enabled: true },
  { id: 'r10', task: '💼 Trabalho (tarde)', time: '13:30', enabled: true },
  { id: 'r11', task: '📚 Estudo / Pos-graduacao', time: '18:00', enabled: true },
  { id: 'r12', task: '🍽️ Jantar', time: '20:00', enabled: true },
  { id: 'r13', task: '💊 Medicacao da noite', time: '20:30', enabled: true },
  { id: 'r14', task: '👨‍👧 Tempo com a filha', time: '21:00', enabled: true },
  { id: 'r15', task: '🙏 Oracao noturna', time: '22:00', enabled: true },
  { id: 'r16', task: '😴 Dormir', time: '22:30', enabled: true },
];

// ==========================================
// SHARED COMPONENTS
// ==========================================
function Modal({ onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="slide-up" style={{ width: '100%', maxWidth: 480, background: THEME.bgCard, borderRadius: '20px 20px 0 0', padding: 20, maxHeight: '80vh', overflowY: 'auto' }}>
        <div style={{ width: 40, height: 4, background: THEME.border, borderRadius: 2, margin: '0 auto 16px' }} />
        {children}
      </div>
    </div>
  );
}

function BtnRow({ onCancel, onSave, color }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
      <button onClick={onCancel} style={{ flex: 1, padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 600, background: THEME.bgInput, color: THEME.textSecondary }}>Cancelar</button>
      <button onClick={onSave} style={{ flex: 1, padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 700, background: color, color: '#fff' }}>Salvar</button>
    </div>
  );
}

const inputS = { width: '100%', padding: 10, borderRadius: 10, fontSize: 14, marginBottom: 10, background: THEME.bgInput, border: `1px solid ${THEME.border}`, color: THEME.text };
const labelS = { fontSize: 11, color: THEME.textMuted, display: 'block', marginBottom: 4 };
