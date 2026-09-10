'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Nav from '@/components/Nav';

const TYPES = ['Politique', 'Manuel', 'Procédure', 'Instruction', 'Mode opératoire', 'Formulaire', 'Rapport'];
const STATUS_LABELS: Record<string, string> = { brouillon: 'Brouillon', en_revision: 'En révision', a_approuver: 'À approuver', approuve: 'Approuvé', publie: 'Publié', obsolete: 'Obsolète', archive: 'Archivé' };
const STATUS_COLOR: Record<string, string> = { brouillon: '#5B6472', en_revision: '#C97A24', a_approuver: '#C97A24', approuve: '#1E8E5A', publie: '#1E8E5A', obsolete: '#5B6472', archive: '#5B6472' };

const EMPTY_PROC_FORM = {
  name: '', process: '', owner: '', objective: '', scope: '',
  description: '', actors: '', inputs: '', outputs: '', responsibilities: '',
  steps: '', documentsAssociated: '', indicators: '', risks: '',
};

const inputStyle: React.CSSProperties = { padding: '8px 10px', border: '1px solid #E2E6EE', borderRadius: 6, fontSize: 13, width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 11.5, fontWeight: 600, color: '#5B6472', marginBottom: 4, display: 'block' };

export default function DocumentsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'list' | 'quick' | 'procedure'>('list');
  const [docs, setDocs] = useState<any[] | null>(null);

  const [quickForm, setQuickForm] = useState({ title: '', type: 'Manuel', process: '' });
  const [quickError, setQuickError] = useState('');

  const [procForm, setProcForm] = useState(EMPTY_PROC_FORM);
  const [procError, setProcError] = useState('');
  const [lastCreated, setLastCreated] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);

  function load() { api.documents().then(setDocs).catch(() => router.push('/login')); }
  useEffect(load, [router]);

  async function submitQuick(e: React.FormEvent) {
    e.preventDefault(); setQuickError('');
    try { await api.createDocument(quickForm); setQuickForm({ title: '', type: 'Manuel', process: '' }); setTab('list'); load(); }
    catch (err: any) { setQuickError(err.message); }
  }

  async function submitProcedure(e: React.FormEvent) {
    e.preventDefault(); setProcError('');
    try {
      const created = await api.createProcedure(procForm);
      setLastCreated(created);
      setProcForm(EMPTY_PROC_FORM);
      load();
    } catch (err: any) { setProcError(err.message); }
  }

  async function download(id: string, code: string) {
    setDownloading(true);
    try { await api.downloadProcedureDocx(id, `${code}.docx`); }
    catch (err: any) { setProcError(err.message); }
    setDownloading(false);
  }

  if (!docs) return <div><Nav /><p style={{ padding: 24 }}>Chargement…</p></div>;

  const counts: Record<string, number> = {};
  docs.forEach((d) => { counts[d.status] = (counts[d.status] || 0) + 1; });
  const procedureCount = docs.filter((d) => d.type === 'Procédure').length;

  return (
    <div>
      <Nav />
      <div style={{ padding: 28, maxWidth: 960, margin: '0 auto' }}>
        <h1 style={{ fontSize: 20, marginBottom: 14 }}>Documents</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
          <div style={{ background: '#fff', border: '1px solid #E2E6EE', borderLeft: '3px solid #2F6FED', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 10.5, color: '#5B6472', textTransform: 'uppercase' }}>Total documents</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{docs.length}</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E2E6EE', borderLeft: '3px solid #2F6FED', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 10.5, color: '#5B6472', textTransform: 'uppercase' }}>Procédures</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{procedureCount}</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E2E6EE', borderLeft: '3px solid #C97A24', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 10.5, color: '#5B6472', textTransform: 'uppercase' }}>En attente d'approbation</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{counts['a_approuver'] || 0}</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E2E6EE', borderLeft: '3px solid #1E8E5A', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 10.5, color: '#5B6472', textTransform: 'uppercase' }}>Publiés / Approuvés</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{(counts['publie'] || 0) + (counts['approuve'] || 0)}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #E2E6EE', marginBottom: 16 }}>
          {([['list', `Liste (${docs.length})`], ['procedure', '✍️ Rédiger une procédure ISO 9001'], ['quick', 'Ajout rapide']] as [string, string][]).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id as 'list' | 'quick' | 'procedure')} style={{ padding: '8px 13px', background: 'none', border: 'none', borderBottom: tab === id ? '2px solid #2F6FED' : '2px solid transparent', color: tab === id ? '#2F6FED' : '#5B6472', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'list' && (
          docs.length === 0 ? <p style={{ color: '#5B6472' }}>Aucun document.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ textAlign: 'left', color: '#5B6472', fontSize: 11 }}><th>Code</th><th>Titre</th><th>Type</th><th>Processus</th><th>Version</th><th>Statut</th><th></th></tr></thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id} style={{ borderTop: '1px solid #E2E6EE' }}>
                    <td style={{ padding: '8px 0', fontFamily: 'monospace' }}>{d.code}</td>
                    <td>{d.title}</td><td>{d.type}</td><td>{d.process || '—'}</td><td>v{d.version}</td>
                    <td><span style={{ background: '#F5F6F9', color: STATUS_COLOR[d.status], padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{STATUS_LABELS[d.status]}</span></td>
                    <td>{d.type === 'Procédure' && d.content && (
                      <button onClick={() => download(d.id, d.code)} disabled={downloading} style={{ fontSize: 11.5, background: '#EAF1FF', color: '#2F6FED', border: 'none', borderRadius: 6, padding: '4px 9px', cursor: 'pointer' }}>
                        📄 Word
                      </button>
                    )}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}

        {tab === 'quick' && (
          <form onSubmit={submitQuick} style={{ background: '#fff', border: '1px solid #E2E6EE', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 460 }}>
            <div><label style={labelStyle}>Titre</label><input style={inputStyle} value={quickForm.title} onChange={(e) => setQuickForm({ ...quickForm, title: e.target.value })} required /></div>
            <div><label style={labelStyle}>Type</label><select style={inputStyle} value={quickForm.type} onChange={(e) => setQuickForm({ ...quickForm, type: e.target.value })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
            <div><label style={labelStyle}>Processus concerné</label><input style={inputStyle} value={quickForm.process} onChange={(e) => setQuickForm({ ...quickForm, process: e.target.value })} /></div>
            {quickError && <p style={{ color: '#C4402B', fontSize: 12.5 }}>{quickError}</p>}
            <button type="submit" style={{ background: '#14335E', color: '#fff', border: 'none', padding: 9, borderRadius: 6, cursor: 'pointer' }}>Créer le document</button>
          </form>
        )}

        {tab === 'procedure' && (
          <div>
            <p style={{ color: '#5B6472', fontSize: 12.5, marginTop: 0 }}>
              La procédure générée respecte la structure standard d'une procédure qualité ISO 9001
              (Objet, Domaine d'application, Références, Définitions, Responsabilités, Description,
              Logigramme, Documents associés, Enregistrements, Indicateurs, Gestion des risques, Annexes)
              et peut être téléchargée en fichier Word (.docx) mis en page, avec en-tête, pied de page et zones de signature.
            </p>
            <form onSubmit={submitProcedure} style={{ background: '#fff', border: '1px solid #E2E6EE', borderRadius: 8, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><label style={labelStyle}>Nom de la procédure *</label><input style={inputStyle} value={procForm.name} onChange={(e) => setProcForm({ ...procForm, name: e.target.value })} required /></div>
                <div><label style={labelStyle}>Processus concerné *</label><input style={inputStyle} value={procForm.process} onChange={(e) => setProcForm({ ...procForm, process: e.target.value })} required /></div>
                <div><label style={labelStyle}>Pilote du processus</label><input style={inputStyle} value={procForm.owner} onChange={(e) => setProcForm({ ...procForm, owner: e.target.value })} /></div>
                <div><label style={labelStyle}>Objectif (section 1. Objet)</label><input style={inputStyle} value={procForm.objective} onChange={(e) => setProcForm({ ...procForm, objective: e.target.value })} /></div>
              </div>
              <div><label style={labelStyle}>Domaine d'application (section 2.)</label><input style={inputStyle} value={procForm.scope} onChange={(e) => setProcForm({ ...procForm, scope: e.target.value })} /></div>
              <div><label style={labelStyle}>Description détaillée du déroulement (section 6.)</label><textarea style={{ ...inputStyle, minHeight: 70 }} value={procForm.description} onChange={(e) => setProcForm({ ...procForm, description: e.target.value })} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div><label style={labelStyle}>Acteurs</label><input style={inputStyle} value={procForm.actors} onChange={(e) => setProcForm({ ...procForm, actors: e.target.value })} /></div>
                <div><label style={labelStyle}>Entrées</label><input style={inputStyle} value={procForm.inputs} onChange={(e) => setProcForm({ ...procForm, inputs: e.target.value })} /></div>
                <div><label style={labelStyle}>Sorties</label><input style={inputStyle} value={procForm.outputs} onChange={(e) => setProcForm({ ...procForm, outputs: e.target.value })} /></div>
              </div>
              <div><label style={labelStyle}>Responsabilités — qui fait quoi / valide / contrôle (section 5.)</label><textarea style={{ ...inputStyle, minHeight: 60 }} value={procForm.responsibilities} onChange={(e) => setProcForm({ ...procForm, responsibilities: e.target.value })} /></div>
              <div><label style={labelStyle}>Logigramme — une étape par ligne (section 7.)</label><textarea style={{ ...inputStyle, minHeight: 80 }} placeholder={'Réception de la demande\nAnalyse et traitement\nValidation\nClôture'} value={procForm.steps} onChange={(e) => setProcForm({ ...procForm, steps: e.target.value })} /></div>
              <div><label style={labelStyle}>Documents associés (section 8.)</label><input style={inputStyle} value={procForm.documentsAssociated} onChange={(e) => setProcForm({ ...procForm, documentsAssociated: e.target.value })} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><label style={labelStyle}>Indicateurs de performance (section 10.)</label><input style={inputStyle} value={procForm.indicators} onChange={(e) => setProcForm({ ...procForm, indicators: e.target.value })} /></div>
                <div><label style={labelStyle}>Gestion des risques (section 11.)</label><input style={inputStyle} value={procForm.risks} onChange={(e) => setProcForm({ ...procForm, risks: e.target.value })} /></div>
              </div>
              {procError && <p style={{ color: '#C4402B', fontSize: 12.5 }}>{procError}</p>}
              <button type="submit" style={{ background: '#2F6FED', color: '#fff', border: 'none', padding: 10, borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Créer la procédure</button>
            </form>

            {lastCreated && (
              <div style={{ background: '#EAF1FF', border: '1px solid #2F6FED', borderRadius: 8, padding: 14, marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Procédure <b>{lastCreated.code}</b> créée avec succès.</span>
                <button onClick={() => download(lastCreated.id, lastCreated.code)} disabled={downloading} style={{ background: '#2F6FED', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', cursor: 'pointer' }}>
                  {downloading ? 'Génération…' : '📄 Télécharger le Word'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
