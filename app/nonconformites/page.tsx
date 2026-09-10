'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Nav from '@/components/Nav';

const STATUSES = ['ouverte', 'en_analyse', 'action_en_cours', 'en_verification', 'cloturee'];
const SEV_COLOR: Record<string, string> = { mineure: '#5B6472', majeure: '#C97A24', critique: '#C4402B' };

export default function NonConformitesPage() {
  const router = useRouter();
  const [list, setList] = useState<any[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ process: '', description: '', origin: '', severity: 'mineure' });
  const [error, setError] = useState('');

  function load() { api.nonconformities().then(setList).catch(() => router.push('/login')); }
  useEffect(load, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError('');
    try { await api.createNonConformity(form); setForm({ process: '', description: '', origin: '', severity: 'mineure' }); setShowForm(false); load(); }
    catch (err: any) { setError(err.message); }
  }
  async function changeStatus(id: string, status: string) { await api.updateNcStatus(id, status); load(); }

  if (!list) return <div><Nav /><p style={{ padding: 24 }}>Chargement…</p></div>;
  const inputStyle: React.CSSProperties = { padding: '8px 10px', border: '1px solid #E2E6EE', borderRadius: 6, fontSize: 13 };

  return (
    <div>
      <Nav />
      <div style={{ padding: 28, maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 20 }}>Non-Conformités ({list.length})</h1>
          <button onClick={() => setShowForm(!showForm)} style={{ background: '#2F6FED', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 6, cursor: 'pointer' }}>
            {showForm ? 'Annuler' : '+ Déclarer une non-conformité'}
          </button>
        </div>
        {showForm && (
          <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #E2E6EE', borderRadius: 8, padding: 16, marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input style={inputStyle} placeholder="Processus concerné" value={form.process} onChange={(e) => setForm({ ...form, process: e.target.value })} />
            <textarea style={{ ...inputStyle, minHeight: 70 }} placeholder="Description de la situation" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={inputStyle} placeholder="Origine (ex. Audit interne)" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
              <select style={inputStyle} value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
                <option value="mineure">Mineure</option><option value="majeure">Majeure</option><option value="critique">Critique</option>
              </select>
            </div>
            {error && <p style={{ color: '#C4402B', fontSize: 12.5 }}>{error}</p>}
            <button type="submit" style={{ background: '#14335E', color: '#fff', border: 'none', padding: 9, borderRadius: 6, cursor: 'pointer' }}>Enregistrer</button>
          </form>
        )}
        {list.length === 0 ? <p style={{ color: '#5B6472', marginTop: 20 }}>Aucune non-conformité.</p> : (
          <table style={{ width: '100%', marginTop: 18, borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ textAlign: 'left', color: '#5B6472', fontSize: 11 }}><th>Réf.</th><th>Processus</th><th>Description</th><th>Gravité</th><th>Statut</th></tr></thead>
            <tbody>
              {list.map((n) => (
                <tr key={n.id} style={{ borderTop: '1px solid #E2E6EE' }}>
                  <td style={{ padding: '8px 0', fontFamily: 'monospace' }}>{n.ref}</td>
                  <td>{n.process || '—'}</td>
                  <td>{n.description.slice(0, 50)}{n.description.length > 50 ? '…' : ''}</td>
                  <td><span style={{ color: SEV_COLOR[n.severity], fontWeight: 600 }}>{n.severity}</span></td>
                  <td>
                    <select value={n.status} onChange={(e) => changeStatus(n.id, e.target.value)} style={{ fontSize: 12, padding: '4px 6px' }}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
