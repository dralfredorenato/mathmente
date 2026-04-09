import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  useLocalStorage,
  todayStr,
  formatWeekday,
  daysUntil,
  isToday,
  getGreeting,
  getQuoteOfDay,
  nowTime,
  THEME,
  CATEGORIES,
  WEEKDAYS_FULL,
  MONTHS,
} from '@/lib/store';

// ==========================================
// Helper: full Portuguese date string
// ==========================================
function fullDateStr() {
  const d = new Date();
  const weekday = WEEKDAYS_FULL[d.getDay()];
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${weekday}, ${day} de ${month} de ${year}`;
}

// ==========================================
// Helper: encouragement message by time
// ==========================================
function getEncouragement() {
  const h = new Date().getHours();
  if (h < 6) return { emoji: '🌙', msg: 'Descanse bem. Amanha e um novo dia.' };
  if (h < 12) return { emoji: '☀️', msg: 'Bom dia, guerreiro! Vamos conquistar esse dia!' };
  if (h < 18) return { emoji: '⚡', msg: 'Metade do dia ja foi! Continue forte!' };
  return { emoji: '🌙', msg: 'Hora de descansar. Voce fez o seu melhor hoje.' };
}

// ==========================================
// Helper: get the current week date range
// ==========================================
function getWeekRange() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  };
}

// ==========================================
// QuickStat card sub-component
// ==========================================
function QuickStat({ icon, label, value, color, delay }) {
  return (
    <div
      className="fade-in"
      style={{
        flex: '1 1 calc(50% - 6px)',
        minWidth: 0,
        background: THEME.bgCard,
        border: `1px solid ${THEME.border}`,
        borderRadius: THEME.radiusSm,
        padding: '14px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: '10px',
          background: `${color}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: color,
            lineHeight: 1.2,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: THEME.textMuted,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Timeline event card
// ==========================================
function TimelineEvent({ event, index }) {
  const cat = CATEGORIES[event.category] || CATEGORIES.pessoal;
  return (
    <div
      className="fade-in"
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'stretch',
        animationDelay: `${100 + index * 60}ms`,
        animationFillMode: 'both',
      }}
    >
      {/* Time column */}
      <div
        style={{
          width: 52,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 2,
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 600, color: THEME.textSecondary }}>
          {event.startTime || '--:--'}
        </span>
        {event.endTime && (
          <span style={{ fontSize: '10px', color: THEME.textMuted, marginTop: 2 }}>
            {event.endTime}
          </span>
        )}
      </div>

      {/* Color bar */}
      <div
        style={{
          width: 3,
          borderRadius: 2,
          background: cat.color,
          flexShrink: 0,
        }}
      />

      {/* Content */}
      <div
        style={{
          flex: 1,
          background: THEME.bgCard,
          border: `1px solid ${THEME.border}`,
          borderRadius: THEME.radiusSm,
          padding: '12px 14px',
          borderLeft: `3px solid ${cat.color}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>{cat.icon}</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: THEME.text }}>
            {event.title}
          </span>
        </div>
        <span
          style={{
            fontSize: '11px',
            color: cat.color,
            fontWeight: 500,
            marginTop: 4,
            display: 'inline-block',
          }}
        >
          {cat.label}
        </span>
      </div>
    </div>
  );
}

// ==========================================
// Quick action button
// ==========================================
function QuickAction({ icon, label, href, color, delay }) {
  return (
    <Link
      href={href}
      className="fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '16px 8px',
        background: THEME.bgCard,
        border: `1px solid ${THEME.border}`,
        borderRadius: THEME.radiusSm,
        transition: 'all 0.2s ease',
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '12px',
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
        }}
      >
        {icon}
      </div>
      <span style={{ fontSize: '11px', fontWeight: 600, color: THEME.textSecondary, lineHeight: 1.3 }}>
        {label}
      </span>
    </Link>
  );
}

// ==========================================
// Main Dashboard component
// ==========================================
export default function Dashboard() {
  const [medications, , medLoaded] = useLocalStorage('medications', []);
  const [exerciseLog, , exLoaded] = useLocalStorage('exerciseLog', []);
  const [tasks, , taskLoaded] = useLocalStorage('tasks', []);
  const [finances, , finLoaded] = useLocalStorage('finances', []);
  const [schedule, , schedLoaded] = useLocalStorage('schedule', []);
  const [studies, , studLoaded] = useLocalStorage('studies', []);
  const [familyEvents, , famLoaded] = useLocalStorage('familyEvents', []);

  const allLoaded = medLoaded && exLoaded && taskLoaded && finLoaded && schedLoaded && studLoaded && famLoaded;

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setCurrentTime(nowTime());
    const timer = setInterval(() => setCurrentTime(nowTime()), 60000);
    return () => clearInterval(timer);
  }, []);

  // ---- Quote of the day ----
  const quote = useMemo(() => getQuoteOfDay(), []);
  const greeting = getGreeting();
  const dateStr = fullDateStr();
  const encouragement = getEncouragement();
  const today = todayStr();
  const weekRange = useMemo(() => getWeekRange(), []);

  // ---- Medication stats ----
  const medStats = useMemo(() => {
    if (!Array.isArray(medications) || medications.length === 0) return { taken: 0, total: 0 };
    const total = medications.length;
    const taken = medications.filter((m) => {
      if (Array.isArray(m.log)) {
        return m.log.some((entry) => {
          if (typeof entry === 'string') return entry === today;
          return entry && entry.date === today;
        });
      }
      if (Array.isArray(m.takenDates)) return m.takenDates.includes(today);
      return m.takenToday === true;
    }).length;
    return { taken, total };
  }, [medications, today]);

  // ---- Exercise streak ----
  const exerciseStreak = useMemo(() => {
    if (!Array.isArray(exerciseLog) || exerciseLog.length === 0) return 0;
    const dates = [...new Set(
      exerciseLog.map((e) => (typeof e === 'string' ? e : e.date)).filter(Boolean)
    )].sort().reverse();
    if (dates.length === 0) return 0;

    let streak = 0;
    const check = new Date();
    // If the most recent entry is today or yesterday, start counting
    const mostRecent = dates[0];
    const diffFromToday = Math.round(
      (new Date(today + 'T12:00:00') - new Date(mostRecent + 'T12:00:00')) / (1000 * 60 * 60 * 24)
    );
    if (diffFromToday > 1) return 0;

    for (let i = 0; i < dates.length; i++) {
      const expected = new Date(check);
      expected.setDate(check.getDate() - (i + (diffFromToday === 1 ? 1 : 0)));
      const expectedStr = expected.toISOString().split('T')[0];
      if (dates.includes(expectedStr)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [exerciseLog, today]);

  // ---- Pending tasks ----
  const pendingTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return 0;
    return tasks.filter((t) => !t.done && !t.completed).length;
  }, [tasks]);

  // ---- Financial bills due this week ----
  const billsDueThisWeek = useMemo(() => {
    if (!Array.isArray(finances)) return 0;
    return finances.filter((f) => {
      const dueDate = f.dueDate || f.date;
      if (!dueDate) return false;
      const isPending = !f.paid && !f.done;
      const inRange = dueDate >= weekRange.start && dueDate <= weekRange.end;
      return isPending && inRange;
    }).length;
  }, [finances, weekRange]);

  // ---- Today's schedule ----
  const todaySchedule = useMemo(() => {
    if (!Array.isArray(schedule)) return [];
    return schedule
      .filter((ev) => ev.date === today)
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }, [schedule, today]);

  // ---- Upcoming events (next 3 from all modules) ----
  const upcomingEvents = useMemo(() => {
    const items = [];

    // Finances: upcoming bills
    if (Array.isArray(finances)) {
      finances.forEach((f) => {
        const d = f.dueDate || f.date;
        if (d && d >= today && !f.paid && !f.done) {
          items.push({
            title: f.title || f.description || 'Conta a pagar',
            date: d,
            type: 'financas',
            icon: '💰',
            color: CATEGORIES.financas.color,
          });
        }
      });
    }

    // Schedule: future events
    if (Array.isArray(schedule)) {
      schedule.forEach((ev) => {
        if (ev.date && ev.date > today) {
          const cat = CATEGORIES[ev.category] || CATEGORIES.pessoal;
          items.push({
            title: ev.title,
            date: ev.date,
            type: ev.category || 'pessoal',
            icon: cat.icon,
            color: cat.color,
          });
        }
      });
    }

    // Studies: upcoming deadlines
    if (Array.isArray(studies)) {
      studies.forEach((s) => {
        const d = s.deadline || s.date;
        if (d && d >= today && !s.done && !s.completed) {
          items.push({
            title: s.title || s.subject || 'Estudo',
            date: d,
            type: 'estudo',
            icon: '📚',
            color: CATEGORIES.estudo.color,
          });
        }
      });
    }

    // Family events
    if (Array.isArray(familyEvents)) {
      familyEvents.forEach((fe) => {
        const d = fe.date;
        if (d && d >= today) {
          items.push({
            title: fe.title || fe.name || 'Evento familiar',
            date: d,
            type: 'familia',
            icon: '👨‍👧',
            color: CATEGORIES.familia.color,
          });
        }
      });
    }

    // Tasks with due dates
    if (Array.isArray(tasks)) {
      tasks.forEach((t) => {
        const d = t.dueDate || t.deadline;
        if (d && d >= today && !t.done && !t.completed) {
          items.push({
            title: t.title || t.text || 'Tarefa',
            date: d,
            type: 'pessoal',
            icon: '✅',
            color: CATEGORIES.pessoal.color,
          });
        }
      });
    }

    return items.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  }, [finances, schedule, studies, familyEvents, tasks, today]);

  // ---- Loading skeleton ----
  if (!allLoaded) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px' }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              height: i === 1 ? 120 : 80,
              borderRadius: THEME.radius,
              background: `linear-gradient(90deg, ${THEME.bgCard} 25%, ${THEME.bgCardHover} 50%, ${THEME.bgCard} 75%)`,
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite linear',
              marginBottom: 16,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px 32px' }}>
      {/* ========== HEADER ========== */}
      <header className="slide-up" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: THEME.text, marginBottom: 2 }}>
              {greeting} 👋
            </h1>
            <p style={{ fontSize: '13px', color: THEME.textSecondary, fontWeight: 500 }}>
              {dateStr}
            </p>
          </div>
          {currentTime && (
            <div
              style={{
                background: `${THEME.primary}18`,
                padding: '6px 12px',
                borderRadius: THEME.radiusSm,
                fontSize: '14px',
                fontWeight: 700,
                color: THEME.primary,
                letterSpacing: '0.5px',
              }}
            >
              {currentTime}
            </div>
          )}
        </div>

        {/* Quote */}
        <div
          style={{
            marginTop: 16,
            padding: '14px 16px',
            background: `linear-gradient(135deg, ${THEME.primary}12, ${THEME.secondary}12)`,
            borderRadius: THEME.radiusSm,
            borderLeft: `3px solid ${THEME.primary}`,
          }}
        >
          <p style={{ fontSize: '13px', color: THEME.textSecondary, fontStyle: 'italic', lineHeight: 1.5 }}>
            &ldquo;{quote.text}&rdquo;
          </p>
          {quote.author && (
            <p style={{ fontSize: '11px', color: THEME.textMuted, marginTop: 4, fontWeight: 500 }}>
              — {quote.author}
            </p>
          )}
        </div>
      </header>

      {/* ========== QUICK STATS ========== */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: THEME.textSecondary, marginBottom: 12, letterSpacing: '0.3px' }}>
          📊 Resumo do dia
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <QuickStat
            icon="💊"
            label="Medicacao"
            value={medStats.total > 0 ? `${medStats.taken}/${medStats.total}` : '—'}
            color={medStats.taken === medStats.total && medStats.total > 0 ? THEME.success : THEME.info}
            delay={50}
          />
          <QuickStat
            icon="🔥"
            label="Sequencia treino"
            value={exerciseStreak > 0 ? `${exerciseStreak} dia${exerciseStreak > 1 ? 's' : ''}` : '—'}
            color={THEME.accent}
            delay={100}
          />
          <QuickStat
            icon="📝"
            label="Tarefas pendentes"
            value={pendingTasks > 0 ? pendingTasks : '0'}
            color={pendingTasks > 0 ? THEME.warning : THEME.success}
            delay={150}
          />
          <QuickStat
            icon="💰"
            label="Contas da semana"
            value={billsDueThisWeek > 0 ? billsDueThisWeek : '0'}
            color={billsDueThisWeek > 0 ? THEME.danger : THEME.success}
            delay={200}
          />
        </div>
      </section>

      {/* ========== TODAY'S TIMELINE ========== */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: THEME.textSecondary, marginBottom: 12, letterSpacing: '0.3px' }}>
          🕐 Linha do tempo de hoje
        </h2>

        {todaySchedule.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {todaySchedule.map((ev, i) => (
              <TimelineEvent key={ev.id || i} event={ev} index={i} />
            ))}
          </div>
        ) : (
          <div
            className="fade-in"
            style={{
              background: THEME.bgCard,
              border: `1px solid ${THEME.border}`,
              borderRadius: THEME.radius,
              padding: '28px 20px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: 10 }}>🌟</div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: THEME.text, marginBottom: 4 }}>
              Seu dia esta livre!
            </p>
            <p style={{ fontSize: '13px', color: THEME.textMuted }}>
              Planeje algo incrivel.
            </p>
            <Link
              href="/agenda"
              style={{
                display: 'inline-block',
                marginTop: 14,
                padding: '8px 20px',
                background: `${THEME.primary}20`,
                color: THEME.primary,
                borderRadius: THEME.radiusSm,
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >
              + Adicionar evento
            </Link>
          </div>
        )}
      </section>

      {/* ========== QUICK ACTIONS ========== */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: THEME.textSecondary, marginBottom: 12, letterSpacing: '0.3px' }}>
          ⚡ Acoes rapidas
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
          }}
        >
          <QuickAction
            icon="💭"
            label="Novo Pensamento"
            href="/vida"
            color={THEME.secondary}
            delay={50}
          />
          <QuickAction
            icon="💊"
            label="Registrar Medicacao"
            href="/vida"
            color={THEME.success}
            delay={100}
          />
          <QuickAction
            icon="💪"
            label="Treinar Agora"
            href="/vida"
            color={THEME.accent}
            delay={150}
          />
          <QuickAction
            icon="🙏"
            label="Orar / Meditar"
            href="/vida"
            color={CATEGORIES.espiritualidade.color}
            delay={200}
          />
          <QuickAction
            icon="✅"
            label="Nova Tarefa"
            href="/agenda"
            color={THEME.info}
            delay={250}
          />
          <QuickAction
            icon="💰"
            label="Ver Financas"
            href="/mais"
            color={CATEGORIES.financas.color}
            delay={300}
          />
        </div>
      </section>

      {/* ========== UPCOMING ========== */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: THEME.textSecondary, marginBottom: 12, letterSpacing: '0.3px' }}>
          📅 Proximos compromissos
        </h2>

        {upcomingEvents.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {upcomingEvents.map((ev, i) => {
              const days = daysUntil(ev.date);
              const daysLabel =
                days === 0
                  ? 'Hoje'
                  : days === 1
                  ? 'Amanha'
                  : `Em ${days} dias`;

              return (
                <div
                  key={i}
                  className="fade-in"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    background: THEME.bgCard,
                    border: `1px solid ${THEME.border}`,
                    borderRadius: THEME.radiusSm,
                    animationDelay: `${100 + i * 80}ms`,
                    animationFillMode: 'both',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      background: `${ev.color}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      flexShrink: 0,
                    }}
                  >
                    {ev.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: THEME.text,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {ev.title}
                    </div>
                    <div style={{ fontSize: '11px', color: THEME.textMuted, marginTop: 2 }}>
                      {formatWeekday(ev.date)}{' '}
                      <span style={{ color: ev.color, fontWeight: 600 }}>· {daysLabel}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: days <= 1 ? THEME.danger : THEME.textMuted,
                      flexShrink: 0,
                    }}
                  >
                    {new Date(ev.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="fade-in"
            style={{
              background: THEME.bgCard,
              border: `1px solid ${THEME.border}`,
              borderRadius: THEME.radius,
              padding: '24px 20px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: 8 }}>✨</div>
            <p style={{ fontSize: '13px', color: THEME.textMuted }}>
              Nenhum compromisso proximo. Aproveite!
            </p>
          </div>
        )}
      </section>

      {/* ========== ENCOURAGEMENT CARD ========== */}
      <section className="slide-up" style={{ marginBottom: 16 }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${THEME.primary}20, ${THEME.secondary}20)`,
            border: `1px solid ${THEME.primary}30`,
            borderRadius: THEME.radius,
            padding: '22px 20px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative glow */}
          <div
            style={{
              position: 'absolute',
              top: -30,
              right: -30,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: `${THEME.primary}10`,
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ fontSize: '32px', marginBottom: 10 }}>{encouragement.emoji}</div>
          <p
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: THEME.text,
              lineHeight: 1.5,
              position: 'relative',
            }}
          >
            {encouragement.msg}
          </p>
        </div>
      </section>
    </div>
  );
}
