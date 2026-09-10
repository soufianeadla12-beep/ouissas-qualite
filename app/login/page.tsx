'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setToken } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [managerName, setManagerName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result =
        mode === 'login'
          ? await api.login({ email, password })
          : await api.register({ email, password, companyName, sector, managerName });
      setToken(result.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    padding: '10px 12px',
    border: '1px solid #E2E6EE',
    borderRadius: 6,
    fontSize: 14,
  };

  return (
    <div style={{ maxWidth: 420, margin: '70px auto', padding: 24 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: '#2F6FED', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, marginBottom: 12 }}>O</div>
      <h1 style={{ fontSize: 22, margin: '0 0 2px' }}>OUISSAS QUALITÉ</h1>
      <p style={{ color: '#5B6472', marginTop: 0 }}>La qualité intelligente, simplement maîtrisée.</p>

      <div style={{ display: 'flex', gap: 4, marginBottom: 18, borderBottom: '1px solid #E2E6EE' }}>
        <button
          onClick={() => setMode('register')}
          style={{ padding: '8px 12px', background: 'none', border: 'none', borderBottom: mode === 'register' ? '2px solid #2F6FED' : '2px solid transparent', color: mode === 'register' ? '#2F6FED' : '#5B6472', fontWeight: 600, cursor: 'pointer' }}
        >
          Créer mon entreprise
        </button>
        <button
          onClick={() => setMode('login')}
          style={{ padding: '8px 12px', background: 'none', border: 'none', borderBottom: mode === 'login' ? '2px solid #2F6FED' : '2px solid transparent', color: mode === 'login' ? '#2F6FED' : '#5B6472', fontWeight: 600, cursor: 'pointer' }}
        >
          Se connecter
        </button>
      </div>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {mode === 'register' && (
          <>
            <input style={inputStyle} placeholder="Nom de l'entreprise" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            <input style={inputStyle} placeholder="Secteur d'activité" value={sector} onChange={(e) => setSector(e.target.value)} required />
            <input style={inputStyle} placeholder="Votre nom" value={managerName} onChange={(e) => setManagerName(e.target.value)} required />
          </>
        )}
        <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input style={inputStyle} type="password" placeholder="Mot de passe (8 caractères min.)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        {error && <p style={{ color: '#C4402B', fontSize: 13 }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ background: '#2F6FED', color: '#fff', border: 'none', padding: 11, borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
          {loading ? 'Un instant…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
        </button>
      </form>
    </div>
  );
}
