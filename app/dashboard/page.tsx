'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Nav from '@/components/Nav';

export default function DashboardPage() {
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api.me().then(setCompany).catch(() => {
      setFailed(true);
      router.push('/login');
    });
  }, [router]);

  if (failed) return null;
  if (!company) return <p style={{ padding: 24 }}>Chargement…</p>;

  return (
    <div>
      <Nav />
      <div style={{ padding: 28, maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ margin: 0 }}>{company.name}</h1>
        <p style={{ color: '#5B6472', margin: '2px 0 18px' }}>{company.sector}</p>
        <div style={{ background: '#fff', border: '1px solid #E2E6EE', borderRadius: 8, padding: 18 }}>
          <p style={{ marginTop: 0 }}>
            Modules disponibles : <b>Processus</b> et <b>Diagnostic ISO 9001</b> (score calculé
            en temps réel, sauvegardé en base). Les modules suivants (Documents, Audits,
            Non-conformités, CAPA…) arrivent progressivement.
          </p>
        </div>
      </div>
    </div>
  );
}
