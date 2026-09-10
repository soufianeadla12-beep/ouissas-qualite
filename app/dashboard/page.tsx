'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, clearToken } from '@/lib/api';

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
    <div style={{ padding: 28, maxWidth: 720, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>{company.name}</h1>
          <p style={{ color: '#5B6472', margin: '2px 0 0' }}>{company.sector}</p>
        </div>
        <button
          onClick={() => { clearToken(); router.push('/login'); }}
          style={{ background: '#fff', border: '1px solid #E2E6EE', borderRadius: 6, padding: '8px 14px', cursor: 'pointer' }}
        >
          Déconnexion
        </button>
      </div>
      <div style={{ background: '#fff', border: '1px solid #E2E6EE', borderRadius: 8, padding: 18, marginTop: 20 }}>
        <p style={{ marginTop: 0 }}>
          Ceci est le vrai Dashboard OUISSAS QUALITÉ, connecté à une vraie base de données
          via l'API (authentification JWT + isolation multi-tenant serveur). C'est le
          Module 1 (Fondations) : entreprise, utilisateurs, connexion.
        </p>
        <p style={{ marginBottom: 0, color: '#5B6472', fontSize: 13 }}>
          Les modules suivants (Processus, Diagnostic ISO, Documents, Audits,
          Non-conformités, CAPA…) seront ajoutés un par un sur cette même base.
        </p>
      </div>
    </div>
  );
}
