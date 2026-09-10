'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Nav from '@/components/Nav';

function level(crit: number) { return crit >= 15 ? 'critique' : crit >= 8 ? 'moyen' : 'faible'; }
const LEVEL_COLOR: Record<string, string> = { critique: '#C4402B', moyen: '#C97A24', faible: '#1E8E5A' };

export default function RisquesPage() {
  const router = useRouter();
  const [risks, setRisks] = useState<any[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ process: '', risk: '', cause: '', consequence: '', probability: 3, severity: 3, owner: '', controls: '' });
  const [error, setError] = useState('');

  function load() { api.risks().then(setRisks).catch(() => router.push('/login')); }
  useEffect(load, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError('');
    try { await api.createRisk(form); setForm({ process: '', risk: '', cause: '', consequence: '', probability: 3, severity: 3, owner: '', controls: '' }); setShowForm(false); load(); }
    catch (err: any) { setError(err.message); }
  }

  if (!risks) return <div><Nav /><p style={{ padding: 24 }}>Chargement…</p></div>;
  const inputStyle: React.CSSProperties = { padding: '8px 10px', border: '1px solid #E2E6EE', borderRadius: 6, fontSize: 13 };

  return (
    <div>
      <Nav />
      <div style={{ padding: 28, maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 20 }}>Risques & Opportunités ({risks.length})</h1>
          <button onClick={() => setShowForm(!showForm)} style={{ background: '#2F6FED', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 6, cursor: 'pointer' }}>
            {showForm ? 'Annuler' : '+ Nouveau risque'}
          </button>
        </div>
        {showForm && (
          <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #E2E6EE', borderRadius: 8, padding: 16, marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input style={inputStyle} placeholder="Processus" value={form.process} onChange={(e) => setForm({ ...form, process: e.target.value })} />
            <input style={inputStyle} placeholder="Description du risque" value={form.risk} onChange={(e) => setForm({ ...form, risk: e.target.value })} required />
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={inputStyle} placeholder="Cause" value={form.cause} onChange={(e) => setForm({ ...form, cause: e.target.value })} />
              <input style={inputStyle} placeholder="Conséquence" value={form.consequence} onChange={(e) => setForm({ ...form, consequence: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <label style={{ fontSize: 12 }}>Probabilité (1-5) <input type="number" min={1} max={5} style={inputStyle} value={form.probability} onChange={(e) => setForm({ ...form, probability: Number(e.target.value) })} /></label>
              <label style={{ fontSize: 12 }}>Gravité (1-5) <input type="number" min={1} max={5} style={inputStyle} value={form.severity} onChange={(e) => setForm({ ...form, severity: Number(e.target.value) })} /></label>
            </div>
            <input style={inputStyle} placeholder="Responsable" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
            <input style={inputStyle} placeholder="Mesures de maîtrise" value={form.controls} onChange={(e) => setForm({ ...form, controls: e.target.value })} />
            {error && <p style={{ color: '#C4402B', fontSize: 12.5 }}>{error}</p>}
            <button type="submit" style={{ background: '#14335E', color: '#fff', border: 'none', padding: 9, borderRadius: 6, cursor: 'pointer' }}>Créer</button>
          </form>
        )}
        {risks.length === 0 ? <p style={{ color: '#5B6472', marginTop: 20 }}>Aucun risque.</p> : (
          <table style={{ width: '100%', marginTop: 18, borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ textAlign: 'left', color: '#5B6472', fontSize: 11 }}><th>Réf.</th><th>Processus</th><th>Risque</th><th>Criticité</th><th>Niveau</th><th>Responsable</th></tr></thead>
            <tbody>
              {risks.map((r) => {
                const crit = r.probability * r.severity; const lvl = level(crit);
                return (
                  <tr key={r.id} style={{ borderTop: '1px solid #E2E6EE' }}>
                    <td style={{ padding: '8px 0', fontFamily: 'monospace' }}>{r.ref}</td>
                    <td>{r.process || '—'}</td><td>{r.risk}</td><td>{crit}</td>
                    <td><span style={{ color: LEVEL_COLOR[lvl], fontWeight: 600 }}>{lvl}</span></td>
                    <td>{r.owner || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
