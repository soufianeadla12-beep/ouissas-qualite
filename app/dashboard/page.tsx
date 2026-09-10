'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Nav from '@/components/Nav';

function isLate(deadline: string | null) {
  return !!deadline && new Date(deadline) < new Date();
}
function level(crit: number) { return crit >= 15 ? 'critique' : crit >= 8 ? 'moyen' : 'faible'; }

export default function DashboardPage() {
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [processes, setProcesses] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [ncs, setNcs] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [diagnostic, setDiagnostic] = useState<any>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    Promise.all([api.me(), api.processes(), api.documents(), api.nonconformities(), api.actions(), api.risks(), api.diagnostic()])
      .then(([c, p, d, n, a, r, diag]) => { setCompany(c); setProcesses(p); setDocuments(d); setNcs(n); setActions(a); setRisks(r); setDiagnostic(diag); })
      .catch(() => { setFailed(true); router.push('/login'); });
  }, [router]);

  if (failed) return null;
  if (!company) return <div><Nav /><p style={{ padding: 24 }}>Chargement…</p></div>;

  const openNc = ncs.filter((n) => !n.closed);
  const criticalNc = ncs.filter((n) => n.severity === 'critique' && !n.closed);
  const lateActions = actions.filter((a) => a.status !== 'cloture' && isLate(a.deadline));
  const closedActions = actions.filter((a) => a.status === 'cloture');
  const criticalRisks = risks.filter((r) => level(r.probability * r.severity) === 'critique');
  const docsPending = documents.filter((d) => d.status === 'a_approuver');

  const kpiCard = (label: string, value: string | number, accent = '#2F6FED', crit = false) => (
    <div style={{ background: '#fff', border: '1px solid #E2E6EE', borderLeft: `3px solid ${crit ? '#C4402B' : accent}`, borderRadius: 8, padding: 14 }}>
      <div style={{ fontSize: 11, color: '#5B6472', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'monospace' }}>{value}</div>
    </div>
  );

  const closeRate = actions.length ? Math.round((closedActions.length / actions.length) * 100) : 0;

  return (
    <div>
      <Nav />
      <div style={{ padding: 28, maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ margin: 0 }}>{company.name}</h1>
        <p style={{ color: '#5B6472', margin: '2px 0 20px' }}>{company.sector}</p>

        <h3 style={{ fontSize: 12, textTransform: 'uppercase', color: '#5B6472', borderBottom: '1px solid #E2E6EE', paddingBottom: 6 }}>Système Qualité</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 18 }}>
          {kpiCard('Score ISO global', diagnostic ? `${diagnostic.globalScore}%` : '—')}
          {kpiCard('Processus', processes.length)}
          {kpiCard('Non-conformités ouvertes', openNc.length, '#2F6FED', openNc.length > 5)}
          {kpiCard('Non-conformités critiques', criticalNc.length, '#2F6FED', criticalNc.length > 0)}
        </div>

        <h3 style={{ fontSize: 12, textTransform: 'uppercase', color: '#5B6472', borderBottom: '1px solid #E2E6EE', paddingBottom: 6 }}>Pilotage</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 18 }}>
          {kpiCard('Actions CAPA', actions.length)}
          {kpiCard('Actions en retard', lateActions.length, '#2F6FED', lateActions.length > 0)}
          {kpiCard('Taux de clôture actions', `${closeRate}%`)}
          {kpiCard('Risques critiques', criticalRisks.length, '#2F6FED', criticalRisks.length > 0)}
        </div>

        <h3 style={{ fontSize: 12, textTransform: 'uppercase', color: '#5B6472', borderBottom: '1px solid #E2E6EE', paddingBottom: 6 }}>Documents</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 22 }}>
          {kpiCard('Documents', documents.length)}
          {kpiCard('Procédures', documents.filter((d) => d.type === 'Procédure').length)}
          {kpiCard("En attente d'approbation", docsPending.length, '#2F6FED', docsPending.length > 0)}
        </div>

        {diagnostic && (
          <>
            <h3 style={{ fontSize: 12, textTransform: 'uppercase', color: '#5B6472', borderBottom: '1px solid #E2E6EE', paddingBottom: 6 }}>Score ISO par chapitre</h3>
            <div style={{ background: '#fff', border: '1px solid #E2E6EE', borderRadius: 8, padding: 16, marginBottom: 22 }}>
              {diagnostic.clauses.map((cl: any) => (
                <div key={cl.code} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ width: 70, fontSize: 12, color: '#5B6472' }}>Chap. {cl.code}</span>
                  <div style={{ flex: 1, background: '#F5F6F9', borderRadius: 4, height: 10, overflow: 'hidden' }}>
                    <div style={{ width: `${cl.score || 0}%`, background: (cl.score || 0) >= 80 ? '#1E8E5A' : (cl.score || 0) >= 50 ? '#C97A24' : '#C4402B', height: '100%' }} />
                  </div>
                  <span style={{ width: 40, fontSize: 12, textAlign: 'right', fontWeight: 600 }}>{cl.score === null ? '—' : cl.score + '%'}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {(criticalNc.length > 0 || lateActions.length > 0 || criticalRisks.length > 0 || docsPending.length > 0) && (
          <>
            <h3 style={{ fontSize: 12, textTransform: 'uppercase', color: '#5B6472', borderBottom: '1px solid #E2E6EE', paddingBottom: 6 }}>🔴 À traiter en priorité</h3>
            <div style={{ background: '#fff', border: '1px solid #E2E6EE', borderRadius: 8, padding: 6 }}>
              {criticalNc.map((n) => <div key={n.id} style={{ padding: '9px 12px', borderBottom: '1px solid #F5F6F9', fontSize: 13 }}>🔴 NC critique — {n.description.slice(0, 60)}</div>)}
              {lateActions.map((a) => <div key={a.id} style={{ padding: '9px 12px', borderBottom: '1px solid #F5F6F9', fontSize: 13 }}>🔴 Action {a.code} en retard</div>)}
              {criticalRisks.map((r) => <div key={r.id} style={{ padding: '9px 12px', borderBottom: '1px solid #F5F6F9', fontSize: 13 }}>🟠 Risque critique — {r.risk}</div>)}
              {docsPending.map((d) => <div key={d.id} style={{ padding: '9px 12px', fontSize: 13 }}>🟠 {d.code} en attente d'approbation</div>)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
