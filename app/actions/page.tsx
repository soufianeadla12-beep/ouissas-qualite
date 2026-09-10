'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Nav from '@/components/Nav';

const COLUMNS: [string, string][] = [['a_faire', 'À faire'], ['en_cours', 'En cours'], ['en_verification', 'En vérification'], ['cloture', 'Clôturé']];

export default function ActionsPage() {
  const router = useRouter();
  const [actions, setActions] = useState<any[] | null>(null);
  const [form, setForm] = useState({ description: '', owner: '', deadline: '', priority: 'Moyenne' });
  const [error, setError] = useState('');

  function load() { api.actions().then(setActions).catch(() => router.push('/login')); }
  useEffect(load, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError('');
    try { await api.createAction(form); setForm({ description: '', owner: '', deadline: '', priority: 'Moyenne' }); load(); }
    catch (err: any) { setError(err.message); }
  }
  async function move(id: string, status: string) { await api.moveAction(id, status); load(); }

  if (!actions) return <div><Nav /><p style={{ padding: 24 }}>Chargement…</p></div>;
  const inputStyle: React.CSSProperties = { padding: '8px 10px', border: '1px solid #E2E6EE', borderRadius: 6, fontSize: 13 };

  return (
    <div>
      <Nav />
      <div style={{ padding: 28, maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ fontSize: 20 }}>Actions CAPA</h1>
        <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #E2E6EE', borderRadius: 8, padding: 14, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 20 }}>
          <input style={{ ...inputStyle, flex: 2 }} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <input style={inputStyle} placeholder="Responsable" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
          <input type="date" style={inputStyle} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          <select style={inputStyle} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option>Basse</option><option>Moyenne</option><option>Haute</option>
          </select>
          <button type="submit" style={{ background: '#2F6FED', color: '#fff', border: 'none', padding: '9px 14px', borderRadius: 6, cursor: 'pointer' }}>Ajouter</button>
        </form>
        {error && <p style={{ color: '#C4402B', fontSize: 12.5 }}>{error}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {COLUMNS.map(([key, label]) => (
            <div key={key} style={{ background: '#F5F6F9', borderRadius: 8, padding: 10 }}>
              <h4 style={{ fontSize: 11, textTransform: 'uppercase', color: '#5B6472' }}>{label} ({actions.filter((a) => a.status === key).length})</h4>
              {actions.filter((a) => a.status === key).map((a) => (
                <div key={a.id} style={{ background: '#fff', border: '1px solid #E2E6EE', borderRadius: 6, padding: 10, marginBottom: 8, fontSize: 12 }}>
                  <div style={{ fontWeight: 600, marginBottom: 3 }}><span style={{ fontFamily: 'monospace', fontSize: 11 }}>{a.code}</span> {a.description}</div>
                  <div style={{ color: '#5B6472', fontSize: 10.5, marginBottom: 6 }}>{a.owner || '—'} · {a.deadline ? new Date(a.deadline).toLocaleDateString('fr-FR') : '—'} · {a.priority}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {COLUMNS.filter(([k]) => k !== key).map(([k, l]) => (
                      <button key={k} onClick={() => move(a.id, k)} style={{ fontSize: 10, background: 'none', border: '1px solid #E2E6EE', borderRadius: 10, padding: '2px 6px', cursor: 'pointer' }}>→ {l}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
