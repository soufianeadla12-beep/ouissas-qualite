'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Nav from '@/components/Nav';

const TYPES: Record<string, string> = {
  management: 'Processus de Management',
  operationnel: 'Processus Opérationnels',
  support: 'Processus Support',
};

export default function ProcessusPage() {
  const router = useRouter();
  const [processes, setProcesses] = useState<any[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', type: 'operationnel', owner: '', purpose: '' });
  const [error, setError] = useState('');

  function load() {
    api.processes().then(setProcesses).catch(() => router.push('/login'));
  }
  useEffect(load, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api.createProcess(form);
      setForm({ code: '', name: '', type: 'operationnel', owner: '', purpose: '' });
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (!processes) return <div><Nav /><p style={{ padding: 24 }}>Chargement…</p></div>;

  const inputStyle: React.CSSProperties = { padding: '8px 10px', border: '1px solid #E2E6EE', borderRadius: 6, fontSize: 13 };

  return (
    <div>
      <Nav />
      <div style={{ padding: 28, maxWidth: 820, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 20 }}>Processus</h1>
          <button onClick={() => setShowForm(!showForm)} style={{ background: '#2F6FED', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 6, cursor: 'pointer' }}>
            {showForm ? 'Annuler' : '+ Nouveau processus'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #E2E6EE', borderRadius: 8, padding: 16, marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={inputStyle} placeholder="Code (ex. ACH)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
              <select style={inputStyle} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="management">Management</option>
                <option value="operationnel">Opérationnel</option>
                <option value="support">Support</option>
              </select>
            </div>
            <input style={inputStyle} placeholder="Nom du processus" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input style={inputStyle} placeholder="Pilote" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
            <input style={inputStyle} placeholder="Finalité" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
            {error && <p style={{ color: '#C4402B', fontSize: 12.5 }}>{error}</p>}
            <button type="submit" style={{ background: '#14335E', color: '#fff', border: 'none', padding: 9, borderRadius: 6, cursor: 'pointer' }}>Créer</button>
          </form>
        )}

        {Object.entries(TYPES).map(([type, label]) => (
          <div key={type} style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 13, textTransform: 'uppercase', color: '#5B6472', borderBottom: '1px solid #E2E6EE', paddingBottom: 6 }}>{label}</h3>
            {processes.filter((p) => p.type === type).length === 0 && <p style={{ color: '#5B6472', fontSize: 12.5 }}>Aucun processus.</p>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
              {processes.filter((p) => p.type === type).map((p) => (
                <div key={p.id} style={{ background: '#fff', border: '1px solid #E2E6EE', borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 10, color: '#5B6472', textTransform: 'uppercase' }}>{p.code}</div>
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#5B6472' }}>Pilote : {p.owner || '—'}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
