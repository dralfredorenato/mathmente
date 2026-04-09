import { useState, useMemo } from 'react';
import Head from 'next/head';
import { useLocalStorage, todayStr, isToday, formatDate, formatWeekday, getWeekDates, getMonthDates, genId, THEME, CATEGORIES, WEEKDAYS, MONTHS } from '@/lib/store';

export default function AgendaPage() {
  const [schedule, setSchedule] = useLocalStorage('schedule', []);
  const [shifts, setShifts] = useLocalStorage('shifts', []);
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [viewMode, setViewMode] = useState('week');
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthYear, setMonthYear] = useState(() => { const d = new Date(); return { month: d.getMonth(), year: d.getFullYear() }; });
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddShift, setShowAddShift] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [eventForm, setEventForm] = useState({ title: '', description: '', startTime: '08:00', endTime: '09:00', category: 'pessoal' });
  const [shiftForm, setShiftForm] = useState({ type: 'diurno', location: '', notes: '' });

  const today = todayStr();
  const weekDates = getWeekDates(weekOffset);
  const monthDates = getMonthDates(monthYear.year, monthYear.month);

  const dayEvents = useMemo(() => schedule.filter(e => e.date === selectedDate).sort((a, b) => a.startTime.localeCompare(b.startTime)), [schedule, selectedDate]);
  const dayShift = shifts.find(s => s.date === selectedDate);
  const dayTasks = useMemo(() => tasks.filter(t => t.date === selectedDate).sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1)), [tasks, selectedDate]);
  const tasksDone = dayTasks.filter(t => t.done).length;
  const tasksTotal = dayTasks.length;

  const hasEventsOn = (date) => schedule.some(e => e.date === date) || shifts.some(s => s.date === date) || tasks.some(t => t.date === date);
  const isShiftDay = (date) => shifts.some(s => s.date === date);

  const addEvent = () => {
    if (!eventForm.title.trim()) return;
    setSchedule(prev => [...prev, { id: genId(), ...eventForm, date: selectedDate }]);
    setEventForm({ title: '', description: '', startTime: '08:00', endTime: '09:00', category: 'pessoal' });
    setShowAddEvent(false);
  };

  const deleteEvent = (id) => setSchedule(prev => prev.filter(e => e.id !== id));

  const addShift = () => {
    const existing = shifts.findIndex(s => s.date === selectedDate);
    if (existing >= 0) {
      setShifts(prev => prev.map((s, i) => i === existing ? { ...s, ...shiftForm, date: selectedDate } : s));
    } else {
      setShifts(prev => [...prev, { id: genId(), ...shiftForm, date: selectedDate }]);
    }
    setShiftForm({ type: 'diurno', location: '', notes: '' });
    setShowAddShift(false);
  };

  const removeShift = () => {
    setShifts(prev => prev.filter(s => s.date !== selectedDate));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: genId(), title: newTask.trim(), date: selectedDate, done: false, priority: 'media' }]);
    setNewTask('');
  };

  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  const prevMonth = () => setMonthYear(p => p.month === 0 ? { month: 11, year: p.year - 1 } : { ...p, month: p.month - 1 });
  const nextMonth = () => setMonthYear(p => p.month === 11 ? { month: 0, year: p.year + 1 } : { ...p, month: p.month + 1 });

  const selectedDayName = (() => {
    const d = new Date(selectedDate + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  })();

  return (
    <>
      <Head><title>Agenda | Meu Ultimo Suspiro</title></Head>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px 16px 100px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>📅 Agenda</h1>
          <div style={{ display: 'flex', gap: 4, background: THEME.bgCard, borderRadius: 10, padding: 3 }}>
            {['week', 'month'].map(m => (
              <button key={m} onClick={() => setViewMode(m)} style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: viewMode === m ? THEME.primary : 'transparent',
                color: viewMode === m ? '#fff' : THEME.textMuted,
              }}>{m === 'week' ? 'Semana' : 'Mes'}</button>
            ))}
          </div>
        </div>

        {/* Week View */}
        {viewMode === 'week' && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <button onClick={() => setWeekOffset(w => w - 1)} style={{ padding: '6px 12px', fontSize: 16, color: THEME.textSecondary }}>◀</button>
              <button onClick={() => { setWeekOffset(0); setSelectedDate(today); }} style={{ fontSize: 12, color: THEME.primary, fontWeight: 600, padding: '4px 10px', borderRadius: 8, background: THEME.primary + '15' }}>Hoje</button>
              <button onClick={() => setWeekOffset(w => w + 1)} style={{ padding: '6px 12px', fontSize: 16, color: THEME.textSecondary }}>▶</button>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {weekDates.map((date, i) => {
                const d = new Date(date + 'T12:00:00');
                const isSelected = date === selectedDate;
                const isTodayDate = date === today;
                const hasEvents = hasEventsOn(date);
                const isShift = isShiftDay(date);
                return (
                  <button key={date} onClick={() => setSelectedDate(date)} style={{
                    flex: 1, padding: '10px 2px', borderRadius: 12, textAlign: 'center',
                    background: isSelected ? THEME.primary : isShift ? THEME.danger + '20' : THEME.bgCard,
                    border: `1px solid ${isSelected ? THEME.primary : isTodayDate ? THEME.primary + '60' : THEME.border}`,
                    transition: 'all 0.2s',
                  }}>
                    <p style={{ fontSize: 10, fontWeight: 600, color: isSelected ? '#fff' : THEME.textMuted, marginBottom: 2 }}>{WEEKDAYS[d.getDay()]}</p>
                    <p style={{ fontSize: 18, fontWeight: 800, color: isSelected ? '#fff' : isTodayDate ? THEME.primary : THEME.text }}>{d.getDate()}</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 4 }}>
                      {hasEvents && <span style={{ width: 5, height: 5, borderRadius: '50%', background: isSelected ? '#fff' : THEME.accent }} />}
                      {isShift && <span style={{ width: 5, height: 5, borderRadius: '50%', background: isSelected ? '#fff' : THEME.danger }} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Month View */}
        {viewMode === 'month' && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <button onClick={prevMonth} style={{ padding: '6px 12px', fontSize: 16, color: THEME.textSecondary }}>◀</button>
              <span style={{ fontSize: 16, fontWeight: 700 }}>{MONTHS[monthYear.month]} {monthYear.year}</span>
              <button onClick={nextMonth} style={{ padding: '6px 12px', fontSize: 16, color: THEME.textSecondary }}>▶</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
              {WEEKDAYS.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, color: THEME.textMuted, padding: 4 }}>{d}</div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
              {monthDates.map(({ date, isCurrentMonth }) => {
                const d = new Date(date + 'T12:00:00');
                const isSelected = date === selectedDate;
                const isTodayDate = date === today;
                const hasEvents = hasEventsOn(date);
                const isShift = isShiftDay(date);
                return (
                  <button key={date} onClick={() => setSelectedDate(date)} style={{
                    padding: '8px 2px', borderRadius: 8, textAlign: 'center', minHeight: 36,
                    background: isSelected ? THEME.primary : isShift ? THEME.danger + '15' : 'transparent',
                    opacity: isCurrentMonth ? 1 : 0.3,
                    border: isTodayDate && !isSelected ? `1px solid ${THEME.primary}60` : '1px solid transparent',
                  }}>
                    <p style={{ fontSize: 13, fontWeight: isSelected || isTodayDate ? 800 : 400, color: isSelected ? '#fff' : isTodayDate ? THEME.primary : THEME.text }}>{d.getDate()}</p>
                    {(hasEvents || isShift) && (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
                        {hasEvents && <span style={{ width: 4, height: 4, borderRadius: '50%', background: isSelected ? '#fff' : THEME.accent }} />}
                        {isShift && <span style={{ width: 4, height: 4, borderRadius: '50%', background: isSelected ? '#fff' : THEME.danger }} />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Day Header */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 16, fontWeight: 700, textTransform: 'capitalize' }}>{selectedDayName}</p>
          {dayShift && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, padding: '4px 10px', borderRadius: 8, background: THEME.danger + '20', border: `1px solid ${THEME.danger}40` }}>
              <span>{dayShift.type === 'diurno' ? '☀️' : '🌙'}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: THEME.danger }}>PLANTAO {dayShift.type.toUpperCase()}</span>
              {dayShift.location && <span style={{ fontSize: 11, color: THEME.textMuted }}>- {dayShift.location}</span>}
              <button onClick={removeShift} style={{ fontSize: 12, color: THEME.textMuted, marginLeft: 4 }}>✕</button>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>📋 Eventos</h3>
            <span style={{ fontSize: 12, color: THEME.textMuted }}>{dayEvents.length} evento{dayEvents.length !== 1 ? 's' : ''}</span>
          </div>
          {dayEvents.length === 0 ? (
            <p style={{ fontSize: 13, color: THEME.textMuted, textAlign: 'center', padding: 16 }}>Nenhum evento para este dia</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dayEvents.map(ev => {
                const cat = CATEGORIES[ev.category] || CATEGORIES.pessoal;
                return (
                  <div key={ev.id} style={{
                    display: 'flex', gap: 10, padding: 10, borderRadius: 10,
                    background: THEME.bgInput, borderLeft: `4px solid ${cat.color}`,
                  }}>
                    <div style={{ minWidth: 50, textAlign: 'center' }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: cat.color }}>{ev.startTime}</p>
                      <p style={{ fontSize: 10, color: THEME.textMuted }}>{ev.endTime}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600 }}>{cat.icon} {ev.title}</p>
                      {ev.description && <p style={{ fontSize: 12, color: THEME.textMuted, marginTop: 2 }}>{ev.description}</p>}
                    </div>
                    <button onClick={() => deleteEvent(ev.id)} style={{ fontSize: 13, color: THEME.textMuted, padding: 4, alignSelf: 'flex-start' }}>✕</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tasks */}
        <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>✅ Tarefas</h3>
            {tasksTotal > 0 && (
              <span style={{ fontSize: 12, color: tasksDone === tasksTotal ? THEME.success : THEME.textMuted }}>
                {tasksDone}/{tasksTotal}
              </span>
            )}
          </div>
          {/* Progress bar */}
          {tasksTotal > 0 && (
            <div style={{ width: '100%', height: 4, background: THEME.bgInput, borderRadius: 2, marginBottom: 10 }}>
              <div style={{ height: '100%', borderRadius: 2, background: tasksDone === tasksTotal ? THEME.success : THEME.primary, width: `${(tasksDone / tasksTotal) * 100}%`, transition: 'width 0.3s' }} />
            </div>
          )}
          {dayTasks.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${THEME.border}20` }}>
              <button onClick={() => toggleTask(t.id)} style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                background: t.done ? THEME.success : 'transparent',
                border: `2px solid ${t.done ? THEME.success : THEME.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: '#fff',
              }}>{t.done ? '✓' : ''}</button>
              <span style={{ flex: 1, fontSize: 14, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? THEME.textMuted : THEME.text }}>{t.title}</span>
              <button onClick={() => deleteTask(t.id)} style={{ fontSize: 12, color: THEME.textMuted, padding: 4 }}>✕</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input value={newTask} onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addTask(); }}
              placeholder="Nova tarefa..." style={{
                flex: 1, padding: 10, borderRadius: 10, fontSize: 13,
                background: THEME.bgInput, border: `1px solid ${THEME.border}`, color: THEME.text,
              }} />
            <button onClick={addTask} disabled={!newTask.trim()} style={{
              padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700,
              background: newTask.trim() ? THEME.primary : THEME.bgInput, color: newTask.trim() ? '#fff' : THEME.textMuted,
            }}>+</button>
          </div>
        </div>

        {/* Add Event Modal */}
        {showAddEvent && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowAddEvent(false); }}>
            <div className="slide-up" style={{ width: '100%', maxWidth: 480, background: THEME.bgCard, borderRadius: '20px 20px 0 0', padding: 20, maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ width: 40, height: 4, background: THEME.border, borderRadius: 2, margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Novo Evento</h3>
              <input value={eventForm.title} onChange={e => setEventForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Titulo do evento" style={{
                  width: '100%', padding: 12, borderRadius: 10, fontSize: 14, marginBottom: 10,
                  background: THEME.bgInput, border: `1px solid ${THEME.border}`, color: THEME.text,
                }} />
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: THEME.textMuted, display: 'block', marginBottom: 4 }}>Inicio</label>
                  <input type="time" value={eventForm.startTime} onChange={e => setEventForm(p => ({ ...p, startTime: e.target.value }))}
                    style={{ width: '100%', padding: 10, borderRadius: 10, fontSize: 14, background: THEME.bgInput, border: `1px solid ${THEME.border}`, color: THEME.text }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: THEME.textMuted, display: 'block', marginBottom: 4 }}>Fim</label>
                  <input type="time" value={eventForm.endTime} onChange={e => setEventForm(p => ({ ...p, endTime: e.target.value }))}
                    style={{ width: '100%', padding: 10, borderRadius: 10, fontSize: 14, background: THEME.bgInput, border: `1px solid ${THEME.border}`, color: THEME.text }} />
                </div>
              </div>
              <label style={{ fontSize: 11, color: THEME.textMuted, display: 'block', marginBottom: 4 }}>Categoria</label>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <button key={key} onClick={() => setEventForm(p => ({ ...p, category: key }))} style={{
                    padding: '6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                    background: eventForm.category === key ? cat.color + '30' : THEME.bgInput,
                    border: `1px solid ${eventForm.category === key ? cat.color : THEME.border}`,
                    color: eventForm.category === key ? cat.color : THEME.textMuted,
                  }}>{cat.icon} {cat.label}</button>
                ))}
              </div>
              <textarea value={eventForm.description} onChange={e => setEventForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Descricao (opcional)" style={{
                  width: '100%', minHeight: 60, padding: 10, borderRadius: 10, fontSize: 13, marginBottom: 12,
                  background: THEME.bgInput, border: `1px solid ${THEME.border}`, color: THEME.text, resize: 'none',
                }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowAddEvent(false)} style={{ flex: 1, padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 600, background: THEME.bgInput, color: THEME.textSecondary }}>Cancelar</button>
                <button onClick={addEvent} style={{ flex: 1, padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 700, background: THEME.primary, color: '#fff' }}>Salvar</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Shift Modal */}
        {showAddShift && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowAddShift(false); }}>
            <div className="slide-up" style={{ width: '100%', maxWidth: 480, background: THEME.bgCard, borderRadius: '20px 20px 0 0', padding: 20 }}>
              <div style={{ width: 40, height: 4, background: THEME.border, borderRadius: 2, margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🏥 Marcar Plantao</h3>
              <p style={{ fontSize: 13, color: THEME.textSecondary, marginBottom: 12 }}>{selectedDayName}</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {[{ id: 'diurno', icon: '☀️', label: 'Diurno' }, { id: 'noturno', icon: '🌙', label: 'Noturno' }].map(t => (
                  <button key={t.id} onClick={() => setShiftForm(p => ({ ...p, type: t.id }))} style={{
                    flex: 1, padding: 14, borderRadius: 12, textAlign: 'center',
                    background: shiftForm.type === t.id ? THEME.danger + '20' : THEME.bgInput,
                    border: `2px solid ${shiftForm.type === t.id ? THEME.danger : THEME.border}`,
                  }}>
                    <span style={{ fontSize: 28, display: 'block' }}>{t.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: shiftForm.type === t.id ? THEME.danger : THEME.textMuted }}>{t.label}</span>
                  </button>
                ))}
              </div>
              <input value={shiftForm.location} onChange={e => setShiftForm(p => ({ ...p, location: e.target.value }))}
                placeholder="Local (ex: Hospital X)" style={{
                  width: '100%', padding: 12, borderRadius: 10, fontSize: 14, marginBottom: 8,
                  background: THEME.bgInput, border: `1px solid ${THEME.border}`, color: THEME.text,
                }} />
              <input value={shiftForm.notes} onChange={e => setShiftForm(p => ({ ...p, notes: e.target.value }))}
                placeholder="Observacoes" style={{
                  width: '100%', padding: 12, borderRadius: 10, fontSize: 14, marginBottom: 12,
                  background: THEME.bgInput, border: `1px solid ${THEME.border}`, color: THEME.text,
                }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowAddShift(false)} style={{ flex: 1, padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 600, background: THEME.bgInput, color: THEME.textSecondary }}>Cancelar</button>
                <button onClick={addShift} style={{ flex: 1, padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 700, background: THEME.danger, color: '#fff' }}>Marcar</button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowAddEvent(true)} style={{
            flex: 1, padding: 14, borderRadius: 14, fontSize: 14, fontWeight: 700,
            background: THEME.primary, color: '#fff',
          }}>+ Evento</button>
          <button onClick={() => setShowAddShift(true)} style={{
            flex: 1, padding: 14, borderRadius: 14, fontSize: 14, fontWeight: 700,
            background: dayShift ? THEME.danger + '40' : THEME.danger, color: '#fff',
          }}>🏥 Plantao</button>
        </div>
      </div>
    </>
  );
}
