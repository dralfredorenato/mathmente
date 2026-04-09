import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { THEME } from '@/lib/store';

const NAV_ITEMS = [
  { href: '/', icon: '🏠', label: 'Inicio' },
  { href: '/agenda', icon: '📅', label: 'Agenda' },
  { href: '/vida', icon: '💪', label: 'Vida' },
  { href: '/estudos', icon: '📚', label: 'Estudos' },
  { href: '/mais', icon: '☰', label: 'Mais' },
];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <>
      <Head>
        <title>Meu Ultimo Suspiro</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${THEME.bg};
          color: ${THEME.text};
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        body {
          padding-bottom: 80px;
        }
        input, textarea, select, button {
          font-family: inherit;
          border: none;
          outline: none;
          background: none;
          color: inherit;
        }
        button {
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: ${THEME.border};
          border-radius: 4px;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .slide-up {
          animation: slideUp 0.4s ease-out forwards;
        }
      `}</style>

      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <Component {...pageProps} />
      </div>

      {/* Bottom Navigation */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '72px',
        background: 'linear-gradient(180deg, rgba(10,10,26,0.95) 0%, rgba(10,10,26,1) 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${THEME.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        zIndex: 1000,
      }}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/'
            ? router.pathname === '/'
            : router.pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 16px',
              borderRadius: '12px',
              background: isActive ? `${THEME.primary}20` : 'transparent',
              transition: 'all 0.2s ease',
              minWidth: '60px',
            }}>
              <span style={{
                fontSize: '22px',
                filter: isActive ? 'none' : 'grayscale(0.5)',
                transition: 'all 0.2s ease',
              }}>
                {item.icon}
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? THEME.primary : THEME.textMuted,
                transition: 'all 0.2s ease',
                letterSpacing: '0.3px',
              }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
