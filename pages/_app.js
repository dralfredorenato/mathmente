import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Content rating: safe for all ages - prevents parental control blocking */}
        <meta name="rating" content="general" />
        <meta name="rating" content="safe for kids" />
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://generativelanguage.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com;" />
        <meta name="description" content="EstudaMente - Plataforma educacional de estudos para alunos do 7o ano. Matematica, Portugues e Historia com tutores de IA." />
        <meta name="keywords" content="educacao, estudos, escola, matematica, portugues, historia, 7 ano, plataforma educacional, criancas" />
        <meta name="author" content="EstudaMente" />
        <meta name="classification" content="education" />
        <meta name="category" content="education" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
