'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Nav from '@/components/Nav';

const TYPES = ['Politique', 'Manuel', 'Procédure', 'Instruction', 'Mode opératoire', 'Formulaire', 'Rapport'];
const STATUS_LABELS: Record<string, string> = { brouillon: 'Brouillon', en_revision: 'En révision', a_approuver: 'À approuver', approuve: 'Approuvé', publie: 'Publié', obsolete: 'Obsolète', archive: 'Archivé' };

export default function DocumentsPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<any[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'Procédure', process: '' });
  const [error, setError] = useState('');

  function load() { api.documents().then(setDocs).catch(() => router.push('/login')); }
  useEffect(load, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError('');
    try { await api.createDocument(form); setForm({ title: '', type: 'Procédure', process: '' }); setShowForm(false); load(); }
    catch (err: any) { setError(err.message); }
  }

  if (!docs) return <div><Nav /><p style={{ padding: 24 }}>Chargement…</p></div>;
  const inputStyle: React.CSSProperties = { padding: '8px 10px', border: '1px solid #E2E6EE', borderRadius: 6, fontSize: 13 };

  return (
    <div>
      <Nav />
      <div style={{ padding: 28, maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 20 }}>Documents ({docs.length})</h1>
          <button onClick={() => setShowForm(!showForm)} style={{ background: '#2F6FED', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 6, cursor: 'pointer' }}>
            {showForm ? 'Annuler' : '+ Nouveau document'}
          </button>
        </div>
        {showForm && (
          <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #E2E6EE', borderRadius: 8, padding: 16, marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input style={inputStyle} placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <select style={inputStyle} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <input style={inputStyle} placeholder="Processus concerné" value={form.process} onChange={(e) => setForm({ ...form, process: e.target.value })} />
            {error && <p style={{ color: '#C4402B', fontSize: 12.5 }}>{error}</p>}
            <button type="submit" style={{ background: '#14335E', color: '#fff', border: 'none', padding: 9, borderRadius: 6, cursor: 'pointer' }}>Créer</button>
          </form>
        )}
        {docs.length === 0 ? <p style={{ color: '#5B6472', marginTop: 20 }}>Aucun document.</p> : (
          <table style={{ width: '100%', marginTop: 18, borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ textAlign: 'left', color: '#5B6472', fontSize: 11 }}><th>Code</th><th>Titre</th><th>Type</th><th>Processus</th><th>Version</th><th>Statut</th></tr></thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id} style={{ borderTop: '1px solid #E2E6EE' }}>
                  <td style={{ padding: '8px 0', fontFamily: 'monospace' }}>{d.code}</td>
                  <td>{d.title}</td><td>{d.type}</td><td>{d.process || '—'}</td><td>v{d.version}</td>
                  <td><span style={{ background: '#EAF1FF', color: '#2F6FED', padding: '2px 8px', borderRadius: 12, fontSize: 11 }}>{STATUS_LABELS[d.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
