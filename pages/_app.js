import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { THEME, useProfile, AGE_GROUPS, FONT_SCALES, DEFAULT_PROFILE } from '@/lib/store';

const NAV_ITEMS = [
  { href: '/', icon: '🏠', label: 'Inicio' },
  { href: '/agenda', icon: '📅', label: 'Agenda' },
  { href: '/vida', icon: '💪', label: 'Vida' },
  { href: '/estudos', icon: '📚', label: 'Estudos', feature: 'estudos' },
  { href: '/mais', icon: '☰', label: 'Mais' },
];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile, profileLoaded] = useProfile();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !profileLoaded) return null;

  const fontScale = FONT_SCALES[profile.fontScale || 'normal']?.value || 1.0;
  const visibleNav = NAV_ITEMS.filter(n => !n.feature || (profile.features || {})[n.feature] !== false);

  return (
    <>
      <Head>
        <title>LifeApp - Meu Ultimo Suspiro</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${THEME.bg};
          color: ${THEME.text};
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-size: ${fontScale * 16}px;
        }
        body { padding-bottom: 80px; }
        input, textarea, select, button { font-family: inherit; border: none; outline: none; background: none; color: inherit; }
        button { cursor: pointer; -webkit-tap-highlight-color: transparent; }
        a { color: inherit; text-decoration: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${THEME.border}; border-radius: 4px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .slide-up { animation: slideUp 0.4s ease-out forwards; }
      `}</style>

      {!profile.onboarded ? (
        <Onboarding onComplete={(p) => setProfile({ ...p, onboarded: true })} />
      ) : (
        <>
          <div style={{ minHeight: '100vh', position: 'relative' }}>
            <Component {...pageProps} />
          </div>

          <nav style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, height: '72px',
            background: 'linear-gradient(180deg, rgba(10,10,26,0.95) 0%, rgba(10,10,26,1) 100%)',
            backdropFilter: 'blur(20px)',
            borderTop: `1px solid ${THEME.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-around',
            padding: '0 8px', zIndex: 1000,
          }}>
            {visibleNav.map((item) => {
              const isActive = item.href === '/' ? router.pathname === '/' : router.pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  padding: '8px 12px', borderRadius: '12px',
                  background: isActive ? `${THEME.primary}20` : 'transparent',
                  transition: 'all 0.2s ease', minWidth: '56px',
                }}>
                  <span style={{ fontSize: '22px', filter: isActive ? 'none' : 'grayscale(0.5)', transition: 'all 0.2s ease' }}>
                    {item.icon}
                  </span>
                  <span style={{
                    fontSize: '10px', fontWeight: isActive ? '700' : '500',
                    color: isActive ? THEME.primary : THEME.textMuted,
                    transition: 'all 0.2s ease', letterSpacing: '0.3px',
                  }}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </>
  );
}

// ==========================================
// ONBOARDING
// ==========================================
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState('adulto');
  const [fontScale, setFontScale] = useState('normal');

  const finish = () => {
    const grp = AGE_GROUPS[ageGroup];
    onComplete({
      ...DEFAULT_PROFILE,
      name: name.trim() || 'Amigo(a)',
      ageGroup,
      fontScale: grp.fontScale > 1 ? 'grande' : fontScale,
      features: grp.defaults.features,
      educationLabel: grp.defaults.educationLabel,
      studyProgramLabels: grp.defaults.studyProgramLabels,
    });
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '24px 20px 100px', maxWidth: 480, margin: '0 auto',
    }}>
      <div className="slide-up">
        {step === 0 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <span style={{ fontSize: 64 }}>🔥</span>
              <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 16, background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                LifeApp
              </h1>
              <p style={{ fontSize: 14, color: THEME.textSecondary, marginTop: 6 }}>Meu Ultimo Suspiro</p>
              <p style={{ fontSize: 13, color: THEME.textMuted, marginTop: 20, lineHeight: 1.6, fontStyle: 'italic' }}>
                "Cada respiro e uma chance de fazer diferente.<br/>Organize sua vida. Cuide de quem voce ama."
              </p>
            </div>
            <label style={{ fontSize: 13, color: THEME.textSecondary, display: 'block', marginBottom: 8 }}>Como voce quer ser chamado(a)?</label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Seu nome"
              style={{
                width: '100%', padding: 14, borderRadius: 14, fontSize: 16,
                background: THEME.bgCard, border: `1px solid ${THEME.border}`, color: THEME.text, marginBottom: 16,
              }} />
            <button onClick={() => setStep(1)} style={{
              width: '100%', padding: 16, borderRadius: 14, fontSize: 16, fontWeight: 700,
              background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.accent})`, color: '#fff',
            }}>Continuar</button>
          </>
        )}

        {step === 1 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>Qual seu perfil?</h2>
              <p style={{ fontSize: 13, color: THEME.textMuted, marginTop: 6 }}>Isso ajusta o app para voce</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {Object.values(AGE_GROUPS).map(g => (
                <button key={g.id} onClick={() => setAgeGroup(g.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 14, textAlign: 'left',
                  background: ageGroup === g.id ? THEME.primary + '20' : THEME.bgCard,
                  border: `2px solid ${ageGroup === g.id ? THEME.primary : THEME.border}`,
                  transition: 'all 0.2s',
                }}>
                  <span style={{ fontSize: 32 }}>{g.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: ageGroup === g.id ? THEME.primary : THEME.text }}>{g.label}</p>
                    <p style={{ fontSize: 11, color: THEME.textMuted, marginTop: 2 }}>{g.range}</p>
                  </div>
                  {ageGroup === g.id && <span style={{ fontSize: 20, color: THEME.primary }}>✓</span>}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setStep(0)} style={{
                flex: 1, padding: 14, borderRadius: 14, fontSize: 14, fontWeight: 600,
                background: THEME.bgCard, color: THEME.textSecondary, border: `1px solid ${THEME.border}`,
              }}>Voltar</button>
              <button onClick={() => setStep(2)} style={{
                flex: 2, padding: 14, borderRadius: 14, fontSize: 15, fontWeight: 700,
                background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.accent})`, color: '#fff',
              }}>Continuar</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: 48 }}>🔍</span>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>Tamanho do texto</h2>
              <p style={{ fontSize: 13, color: THEME.textMuted, marginTop: 6 }}>Escolha o que fica mais confortavel</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {Object.values(FONT_SCALES).map(f => (
                <button key={f.id} onClick={() => setFontScale(f.id)} style={{
                  padding: 16, borderRadius: 14, textAlign: 'center',
                  background: fontScale === f.id ? THEME.primary + '20' : THEME.bgCard,
                  border: `2px solid ${fontScale === f.id ? THEME.primary : THEME.border}`,
                  fontSize: f.value * 16, fontWeight: 700,
                  color: fontScale === f.id ? THEME.primary : THEME.text,
                  transition: 'all 0.2s',
                }}>{f.label}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setStep(1)} style={{
                flex: 1, padding: 14, borderRadius: 14, fontSize: 14, fontWeight: 600,
                background: THEME.bgCard, color: THEME.textSecondary, border: `1px solid ${THEME.border}`,
              }}>Voltar</button>
              <button onClick={finish} style={{
                flex: 2, padding: 14, borderRadius: 14, fontSize: 15, fontWeight: 700,
                background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.accent})`, color: '#fff',
              }}>Comecar! 🚀</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
