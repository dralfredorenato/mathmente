import { useState, useMemo } from 'react';
import Head from 'next/head';
import { useLocalStorage, todayStr, formatDate, daysUntil, isFuture, isPast, genId, THEME, WEEKDAYS_FULL } from '@/lib/store';

const DEFAULT_PROGRAMS = [
  { id: 'pg1', name: 'Pos-Graduacao 1', institution: '', classes: [], deadlines: [], notes: '' },
  { id: 'pg2', name: 'Pos-Graduacao 2', institution: '', classes: [], deadlines: [], notes: '' },
];

const STATUS_MAP = {
  pendente: { label: 'Pendente', color: '#F59E0B', icon: '⏳' },
  em_andamento: { label: 'Em andamento', color: '#3B82F6', icon: '🔄' },
  concluido: { label: 'Concluido', color: '#10B981', icon: '✅' },
};

export default function EstudosPage() {
  const [postgrad, setPostgrad] = useLocalStorage('postgrad', DEFAULT_PROGRAMS);
  const [studyLog, setStudyLog] = useLocalStorage('studyLog', []);
  const [activeProgram, setActiveProgram] = useState(0);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddDeadline, setShowAddDeadline] = useState(false);
  const [showLogStudy, setShowLogStudy] = useState(false);
  const [editingProgram, setEditingProgram] = useState(false);
  const [classForm, setClassForm] = useState({ name: '', professor: '', day: 'Segunda', startTime: '19:00', endTime: '22:00', room: '' });
  const [deadlineForm, setDeadlineForm] = useState({ title: '', description: '', dueDate: '', status: 'pendente', priority: 'media' });
  const [studyForm, setStudyForm] = useState({ subject: '', duration: 60 });

  const today = todayStr();
  const program = postgrad[activeProgram] || DEFAULT_PROGRAMS[0];

  const updateProgram = (field, value) => {
    setPostgrad(prev => prev.map((p, i) => i === activeProgram ? { ...p, [field]: value } : p));
  };

  // Classes sorted by day
  const dayOrder = { 'Segunda': 1, 'Terca': 2, 'Quarta': 3, 'Quinta': 4, 'Sexta': 5, 'Sabado': 6, 'Domingo': 7 };
  const sortedClasses = [...(program.classes || [])].sort((a, b) => (dayOrder[a.day] || 8) - (dayOrder[b.day] || 8) || a.startTime.localeCompare(b.startTime));

  // Deadlines sorted by date
  const sortedDeadlines = [...(program.deadlines || [])].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const pendingDeadlines = sortedDeadlines.filter(d => d.status !== 'concluido');
  const completedDeadlines = sortedDeadlines.filter(d => d.status === 'concluido');

  // Next class
  const todayDayName = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });
  const todayDayCapitalized = todayDayName.charAt(0).toUpperCase() + todayDayName.slice(1).replace('-feira', '');

  // Study stats
  const thisWeekStudy = studyLog.filter(s => {
    const d = new Date(s.date + 'T12:00:00');
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
    weekStart.setHours(0, 0, 0, 0);
    return d >= weekStart && s.program === program.id;
  });
  const weekHours = Math.round(thisWeekStudy.reduce((sum, s) => sum + s.duration, 0) / 60 * 10) / 10;

  const addClass = () => {
    if (!classForm.name.trim()) return;
    updateProgram('classes', [...(program.classes || []), { id: genId(), ...classForm }]);
    setClassForm({ name: '', professor: '', day: 'Segunda', startTime: '19:00', endTime: '22:00', room: '' });
    setShowAddClass(false);
  };

  const deleteClass = (id) => updateProgram('classes', program.classes.filter(c => c.id !== id));

  const addDeadline = () => {
    if (!deadlineForm.title.trim() || !deadlineForm.dueDate) return;
    updateProgram('deadlines', [...(program.deadlines || []), { id: genId(), ...deadlineForm }]);
    setDeadlineForm({ title: '', description: '', dueDate: '', status: 'pendente', priority: 'media' });
    setShowAddDeadline(false);
  };

  const updateDeadlineStatus = (id, status) => {
    updateProgram('deadlines', program.deadlines.map(d => d.id === id ? { ...d, status } : d));
  };

  const deleteDeadline = (id) => updateProgram('deadlines', program.deadlines.filter(d => d.id !== id));

  const logStudy = () => {
    if (!studyForm.subject.trim()) return;
    setStudyLog(prev => [...prev, { id: genId(), program: program.id, subject: studyForm.subject, duration: studyForm.duration, date: today }]);
    setStudyForm({ subject: '', duration: 60 });
    setShowLogStudy(false);
  };

  return (
    <>
      <Head><title>Estudos | Meu Ultimo Suspiro</title></Head>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px 16px 100px' }}>
        {/* Header */}
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>📚 Estudos</h1>
        <p style={{ fontSize: 13, color: THEME.textMuted, marginBottom: 16 }}>Gerencie suas pos-graduacoes</p>

        {/* Program Selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {postgrad.map((pg, i) => (
            <button key={pg.id} onClick={() => setActiveProgram(i)} style={{
              flex: 1, padding: 12, borderRadius: 14, textAlign: 'center',
              background: activeProgram === i ? THEME.secondary + '20' : THEME.bgCard,
              border: `2px solid ${activeProgram === i ? THEME.secondary : THEME.border}`,
              transition: 'all 0.2s',
            }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: activeProgram === i ? THEME.secondaryLight : THEME.text }}>{pg.name || `Pos ${i + 1}`}</p>
              {pg.institution && <p style={{ fontSize: 10, color: THEME.textMuted, marginTop: 2 }}>{pg.institution}</p>}
            </button>
          ))}
        </div>

        {/* Edit Program Name */}
        {editingProgram ? (
          <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.secondary}40`, borderRadius: 14, padding: 14, marginBottom: 16 }}>
            <input value={program.name} onChange={e => updateProgram('name', e.target.value)}
              placeholder="Nome da pos-graduacao" style={{
                width: '100%', padding: 10, borderRadius: 10, fontSize: 14, marginBottom: 8,
                background: THEME.bgInput, border: `1px solid ${THEME.border}`, color: THEME.text,
              }} />
            <input value={program.institution} onChange={e => updateProgram('institution', e.target.value)}
              placeholder="Instituicao" style={{
                width: '100%', padding: 10, borderRadius: 10, fontSize: 14, marginBottom: 8,
                background: THEME.bgInput, border: `1px solid ${THEME.border}`, color: THEME.text,
              }} />
            <button onClick={() => setEditingProgram(false)} style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: THEME.secondary, color: '#fff',
            }}>OK</button>
          </div>
        ) : (
          <button onClick={() => setEditingProgram(true)} style={{
            fontSize: 12, color: THEME.secondary, fontWeight: 600, marginBottom: 16, display: 'block',
          }}>✏️ Editar nome do programa</button>
        )}

        {/* Stats Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 10, textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: THEME.secondary }}>{(program.classes || []).length}</p>
            <p style={{ fontSize: 10, color: THEME.textMuted }}>Disciplinas</p>
          </div>
          <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 10, textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: THEME.accent }}>{pendingDeadlines.length}</p>
            <p style={{ fontSize: 10, color: THEME.textMuted }}>Prazos</p>
          </div>
          <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 10, textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: THEME.success }}>{weekHours}h</p>
            <p style={{ fontSize: 10, color: THEME.textMuted }}>Estudo/sem</p>
          </div>
        </div>

        {/* Classes Section */}
        <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>🎓 Disciplinas</h3>
            <button onClick={() => setShowAddClass(true)} style={{ fontSize: 12, color: THEME.secondary, fontWeight: 700 }}>+ Adicionar</button>
          </div>

          {sortedClasses.length === 0 ? (
            <p style={{ fontSize: 13, color: THEME.textMuted, textAlign: 'center', padding: 16 }}>Adicione suas disciplinas para organizar seus estudos!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sortedClasses.map(cls => (
                <div key={cls.id} style={{
                  display: 'flex', gap: 10, padding: 10, borderRadius: 10, background: THEME.bgInput,
                  borderLeft: `3px solid ${THEME.secondary}`,
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{cls.name}</p>
                    {cls.professor && <p style={{ fontSize: 11, color: THEME.textMuted }}>Prof. {cls.professor}</p>}
                    <p style={{ fontSize: 12, color: THEME.secondaryLight, marginTop: 2 }}>
                      {cls.day} {cls.startTime}-{cls.endTime} {cls.room && `| ${cls.room}`}
                    </p>
                  </div>
                  <button onClick={() => deleteClass(cls.id)} style={{ fontSize: 12, color: THEME.textMuted, alignSelf: 'flex-start' }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deadlines Section */}
        <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>📅 Prazos e Entregas</h3>
            <button onClick={() => setShowAddDeadline(true)} style={{ fontSize: 12, color: THEME.secondary, fontWeight: 700 }}>+ Adicionar</button>
          </div>

          {pendingDeadlines.length === 0 && completedDeadlines.length === 0 ? (
            <p style={{ fontSize: 13, color: THEME.textMuted, textAlign: 'center', padding: 16 }}>Nenhum prazo cadastrado</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pendingDeadlines.map(dl => {
                const days = daysUntil(dl.dueDate);
                const isOverdue = days < 0;
                const isUrgent = days >= 0 && days <= 7;
                const st = STATUS_MAP[dl.status] || STATUS_MAP.pendente;
                return (
                  <div key={dl.id} style={{
                    padding: 12, borderRadius: 10, background: THEME.bgInput,
                    borderLeft: `3px solid ${isOverdue ? THEME.danger : isUrgent ? THEME.accent : THEME.success}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 600 }}>{dl.title}</p>
                        {dl.description && <p style={{ fontSize: 12, color: THEME.textMuted, marginTop: 2 }}>{dl.description}</p>}
                        <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 11, color: isOverdue ? THEME.danger : isUrgent ? THEME.accent : THEME.success, fontWeight: 700 }}>
                            {isOverdue ? `⚠️ Atrasado ${Math.abs(days)} dia${Math.abs(days) > 1 ? 's' : ''}` : days === 0 ? '🔴 HOJE!' : `Faltam ${days} dia${days > 1 ? 's' : ''}`}
                          </span>
                          <span style={{ fontSize: 10, color: THEME.textMuted }}>{formatDate(dl.dueDate)}</span>
                        </div>
                      </div>
                      <button onClick={() => deleteDeadline(dl.id)} style={{ fontSize: 12, color: THEME.textMuted, padding: 4 }}>✕</button>
                    </div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                      {Object.entries(STATUS_MAP).map(([key, s]) => (
                        <button key={key} onClick={() => updateDeadlineStatus(dl.id, key)} style={{
                          flex: 1, padding: '5px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                          background: dl.status === key ? s.color + '25' : 'transparent',
                          border: `1px solid ${dl.status === key ? s.color : THEME.border}`,
                          color: dl.status === key ? s.color : THEME.textMuted,
                        }}>{s.icon} {s.label}</button>
                      ))}
                    </div>
                  </div>
                );
              })}
              {completedDeadlines.length > 0 && (
                <details>
                  <summary style={{ fontSize: 12, color: THEME.textMuted, cursor: 'pointer', padding: '8px 0' }}>✅ {completedDeadlines.length} concluido{completedDeadlines.length > 1 ? 's' : ''}</summary>
                  {completedDeadlines.map(dl => (
                    <div key={dl.id} style={{ padding: 8, borderRadius: 8, background: THEME.bgInput, marginTop: 4, opacity: 0.6 }}>
                      <p style={{ fontSize: 13, textDecoration: 'line-through' }}>{dl.title}</p>
                    </div>
                  ))}
                </details>
              )}
            </div>
          )}
        </div>

        {/* Study Log Button */}
        <button onClick={() => setShowLogStudy(true)} style={{
          width: '100%', padding: 14, borderRadius: 14, fontSize: 14, fontWeight: 700,
          background: `linear-gradient(135deg, ${THEME.secondary}, ${THEME.secondaryLight})`, color: '#fff',
        }}>📖 Registrar Sessao de Estudo</button>

        {/* Add Class Modal */}
        {showAddClass && (
          <ModalOverlay onClose={() => setShowAddClass(false)}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Nova Disciplina</h3>
            <input value={classForm.name} onChange={e => setClassForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Nome da disciplina" style={inputStyle} />
            <input value={classForm.professor} onChange={e => setClassForm(p => ({ ...p, professor: e.target.value }))}
              placeholder="Professor(a)" style={inputStyle} />
            <label style={labelStyle}>Dia da semana</label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
              {['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'].map(d => (
                <button key={d} onClick={() => setClassForm(p => ({ ...p, day: d }))} style={{
                  padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  background: classForm.day === d ? THEME.secondary + '30' : THEME.bgInput,
                  border: `1px solid ${classForm.day === d ? THEME.secondary : THEME.border}`,
                  color: classForm.day === d ? THEME.secondary : THEME.textMuted,
                }}>{d.slice(0, 3)}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Inicio</label>
                <input type="time" value={classForm.startTime} onChange={e => setClassForm(p => ({ ...p, startTime: e.target.value }))} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Fim</label>
                <input type="time" value={classForm.endTime} onChange={e => setClassForm(p => ({ ...p, endTime: e.target.value }))} style={inputStyle} />
              </div>
            </div>
            <input value={classForm.room} onChange={e => setClassForm(p => ({ ...p, room: e.target.value }))}
              placeholder="Sala / Local" style={inputStyle} />
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button onClick={() => setShowAddClass(false)} style={cancelBtnStyle}>Cancelar</button>
              <button onClick={addClass} style={saveBtnStyle}>Salvar</button>
            </div>
          </ModalOverlay>
        )}

        {/* Add Deadline Modal */}
        {showAddDeadline && (
          <ModalOverlay onClose={() => setShowAddDeadline(false)}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Novo Prazo</h3>
            <input value={deadlineForm.title} onChange={e => setDeadlineForm(p => ({ ...p, title: e.target.value }))}
              placeholder="Titulo (ex: Entrega do artigo)" style={inputStyle} />
            <textarea value={deadlineForm.description} onChange={e => setDeadlineForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Descricao (opcional)" style={{ ...inputStyle, minHeight: 60, resize: 'none' }} />
            <label style={labelStyle}>Data de entrega</label>
            <input type="date" value={deadlineForm.dueDate} onChange={e => setDeadlineForm(p => ({ ...p, dueDate: e.target.value }))} style={inputStyle} />
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button onClick={() => setShowAddDeadline(false)} style={cancelBtnStyle}>Cancelar</button>
              <button onClick={addDeadline} style={saveBtnStyle}>Salvar</button>
            </div>
          </ModalOverlay>
        )}

        {/* Log Study Modal */}
        {showLogStudy && (
          <ModalOverlay onClose={() => setShowLogStudy(false)}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📖 Sessao de Estudo</h3>
            <input value={studyForm.subject} onChange={e => setStudyForm(p => ({ ...p, subject: e.target.value }))}
              placeholder="O que estudou?" style={inputStyle} />
            <label style={labelStyle}>Duracao (minutos)</label>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              {[30, 45, 60, 90, 120].map(m => (
                <button key={m} onClick={() => setStudyForm(p => ({ ...p, duration: m }))} style={{
                  flex: 1, padding: 8, borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: studyForm.duration === m ? THEME.secondary : THEME.bgInput,
                  color: studyForm.duration === m ? '#fff' : THEME.textMuted,
                }}>{m}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowLogStudy(false)} style={cancelBtnStyle}>Cancelar</button>
              <button onClick={logStudy} style={saveBtnStyle}>Registrar</button>
            </div>
          </ModalOverlay>
        )}
      </div>
    </>
  );
}

// Shared modal wrapper
function ModalOverlay({ onClose, children }) {
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

const inputStyle = {
  width: '100%', padding: 10, borderRadius: 10, fontSize: 14, marginBottom: 10,
  background: THEME.bgInput, border: `1px solid ${THEME.border}`, color: THEME.text,
};
const labelStyle = { fontSize: 11, color: THEME.textMuted, display: 'block', marginBottom: 4 };
const cancelBtnStyle = { flex: 1, padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 600, background: THEME.bgInput, color: THEME.textSecondary };
const saveBtnStyle = { flex: 1, padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 700, background: THEME.secondary, color: '#fff' };
