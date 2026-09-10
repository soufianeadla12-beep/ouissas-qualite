export const metadata = {
  title: 'OUISSAS QUALITÉ',
  description: 'La qualité intelligente, simplement maîtrisée.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#F5F6F9', color: '#14171F' }}>
        {children}
      </body>
    </html>
  );
}
