import { useState, useEffect, useCallback } from 'react';

// ==========================================
// LOCAL STORAGE HOOK
// ==========================================
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
    } catch (e) {
      console.error(`Error reading localStorage key "${key}":`, e);
    }
    setLoaded(true);
  }, [key]);

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (e) {
      console.error(`Error setting localStorage key "${key}":`, e);
    }
  }, [key, storedValue]);

  return [storedValue, setValue, loaded];
}

// ==========================================
// DATE UTILITIES
// ==========================================
export function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export function nowTime() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export function formatWeekday(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { weekday: 'long' });
}

export function daysUntil(dateStr) {
  const target = new Date(dateStr + 'T12:00:00');
  const today = new Date(todayStr() + 'T12:00:00');
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

export function isToday(dateStr) {
  return dateStr === todayStr();
}

export function isFuture(dateStr) {
  return dateStr > todayStr();
}

export function isPast(dateStr) {
  return dateStr < todayStr();
}

export function getWeekDates(offsetWeeks = 0) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + offsetWeeks * 7);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export function getMonthDates(year, month) {
  const dates = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  for (let i = startPad; i > 0; i--) {
    const d = new Date(year, month, 1 - i);
    dates.push({ date: d.toISOString().split('T')[0], isCurrentMonth: false });
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i);
    dates.push({ date: d.toISOString().split('T')[0], isCurrentMonth: true });
  }
  const remaining = 42 - dates.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    dates.push({ date: d.toISOString().split('T')[0], isCurrentMonth: false });
  }
  return dates;
}

// ==========================================
// ID GENERATION
// ==========================================
export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ==========================================
// MOTIVATIONAL QUOTES
// ==========================================
const QUOTES = [
  { text: "Disciplina e a ponte entre metas e realizacoes.", author: "Jim Rohn" },
  { text: "Voce nao precisa ser perfeito, so precisa ser constante.", author: "" },
  { text: "Um dia de cada vez. Um passo de cada vez.", author: "" },
  { text: "A coragem nao e ausencia de medo, e a decisao de que algo e mais importante.", author: "Ambrose Redmoon" },
  { text: "Nao e sobre ter tempo, e sobre fazer tempo.", author: "" },
  { text: "O segredo de ir em frente e comecar.", author: "Mark Twain" },
  { text: "Pequenos progressos diarios levam a grandes resultados.", author: "" },
  { text: "Sua unica limitacao e voce mesmo.", author: "" },
  { text: "Faca do seu melhor o suficiente para hoje.", author: "" },
  { text: "A fe move montanhas, mas voce precisa trazer a pa.", author: "" },
  { text: "Organize sua vida e ela te recompensara com paz.", author: "" },
  { text: "Cada manha e uma nova chance de mudar sua vida.", author: "" },
  { text: "O planejamento de hoje e o sucesso de amanha.", author: "" },
  { text: "Respire. Ore. Confie. Siga em frente.", author: "" },
  { text: "Voce ja sobreviveu a 100% dos seus piores dias.", author: "" },
  { text: "A jornada de mil milhas comeca com um unico passo.", author: "Lao Tzu" },
  { text: "Deus nao te trouxe ate aqui para te abandonar.", author: "" },
  { text: "Cuide da sua mente como cuida do seu corpo.", author: "" },
  { text: "O melhor investimento e em voce mesmo.", author: "" },
  { text: "Gratidao transforma o que temos em suficiente.", author: "" },
];

export function getQuoteOfDay() {
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % QUOTES.length;
  return QUOTES[dayIndex];
}

// ==========================================
// GREETING
// ==========================================
export function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return 'Boa madrugada';
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

// ==========================================
// WEEKDAY NAMES
// ==========================================
export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
export const WEEKDAYS_FULL = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
export const MONTHS = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// ==========================================
// THEME
// ==========================================
export const THEME = {
  bg: '#0a0a1a',
  bgCard: '#141428',
  bgCardHover: '#1c1c3a',
  bgInput: '#1a1a35',
  bgModal: '#0f0f25',
  primary: '#FF6B35',
  primaryLight: '#FF8F65',
  primaryDark: '#CC5529',
  secondary: '#7C3AED',
  secondaryLight: '#9F6AFF',
  accent: '#F59E0B',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  border: '#2a2a4a',
  borderLight: '#3a3a5a',
  shadow: '0 4px 20px rgba(0,0,0,0.3)',
  shadowLg: '0 8px 40px rgba(0,0,0,0.4)',
  radius: '16px',
  radiusSm: '10px',
  radiusXs: '6px',
};

// ==========================================
// CATEGORY COLORS
// ==========================================
export const CATEGORIES = {
  trabalho: { label: 'Trabalho', color: '#3B82F6', icon: '💼' },
  estudo: { label: 'Estudo', color: '#8B5CF6', icon: '📚' },
  saude: { label: 'Saude', color: '#10B981', icon: '💊' },
  exercicio: { label: 'Exercicio', color: '#F59E0B', icon: '💪' },
  familia: { label: 'Familia', color: '#EC4899', icon: '👨‍👧' },
  financas: { label: 'Financas', color: '#6366F1', icon: '💰' },
  espiritualidade: { label: 'Espiritualidade', color: '#D4A574', icon: '🙏' },
  lazer: { label: 'Lazer', color: '#14B8A6', icon: '🎮' },
  plantao: { label: 'Plantao', color: '#EF4444', icon: '🏥' },
  pessoal: { label: 'Pessoal', color: '#9CA3AF', icon: '👤' },
};
