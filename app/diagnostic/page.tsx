'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Nav from '@/components/Nav';

const STATUS_LABELS: Record<string, string> = { conforme: 'Conforme', partiel: 'Partiel', non_conforme: 'Non conforme', na: 'N/A' };
const STATUS_COLORS: Record<string, string> = { conforme: '#1E8E5A', partiel: '#C97A24', non_conforme: '#C4402B', na: '#5B6472' };

export default function DiagnosticPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  function load() {
    api.diagnostic().then(setData).catch(() => router.push('/login'));
  }
  useEffect(load, [router]);

  async function setStatus(requirementId: string, status: string) {
    await api.updateDiagnosticResponse(requirementId, { status });
    load();
  }

  if (!data) return <div><Nav /><p style={{ padding: 24 }}>Chargement…</p></div>;

  return (
    <div>
      <Nav />
      <div style={{ padding: 28, maxWidth: 820, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <div style={{ background: '#fff', border: '1px solid #E2E6EE', borderLeft: '3px solid #2F6FED', borderRadius: 8, padding: 14, flex: 1 }}>
            <div style={{ fontSize: 11, color: '#5B6472', textTransform: 'uppercase' }}>Score global</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{data.globalScore}%</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E2E6EE', borderLeft: '3px solid #2F6FED', borderRadius: 8, padding: 14, flex: 1 }}>
            <div style={{ fontSize: 11, color: '#5B6472', textTransform: 'uppercase' }}>Exigences évaluées</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{data.answered}</div>
          </div>
        </div>

        {data.clauses.map((cl: any) => (
          <div key={cl.code} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
              <span style={{ fontFamily: 'monospace', color: '#2F6FED', fontWeight: 700 }}>Chap. {cl.code}</span>
              <b>{cl.title}</b>
              <span style={{ marginLeft: 'auto', fontWeight: 700, color: cl.score === null ? '#5B6472' : cl.score >= 80 ? '#1E8E5A' : cl.score >= 50 ? '#C97A24' : '#C4402B' }}>
                {cl.score === null ? '—' : cl.score + '%'}
              </span>
            </div>
            {cl.requirements.map((r: any) => (
              <div key={r.id} style={{ background: '#fff', border: '1px solid #E2E6EE', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: '#5B6472', fontFamily: 'monospace' }}>{r.code}</div>
                <div style={{ fontWeight: 600, margin: '3px 0' }}>{r.question}</div>
                <div style={{ fontSize: 12, color: '#5B6472', marginBottom: 8 }}>{r.explanation}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {Object.keys(STATUS_LABELS).map((s) => {
                    const active = r.response?.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setStatus(r.id, s)}
                        style={{
                          padding: '5px 11px',
                          borderRadius: 16,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: '1px solid #E2E6EE',
                          background: active ? STATUS_COLORS[s] : '#fff',
                          color: active ? '#fff' : '#5B6472',
                        }}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
