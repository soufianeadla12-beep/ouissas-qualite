'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearToken } from '@/lib/api';

const LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/processus', label: 'Processus' },
  { href: '/diagnostic', label: 'Diagnostic ISO' },
  { href: '/documents', label: 'Documents' },
  { href: '/nonconformites', label: 'Non-Conformités' },
  { href: '/actions', label: 'Actions CAPA' },
  { href: '/risques', label: 'Risques' },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '12px 24px', background: '#0F2A4A', flexWrap: 'wrap' }}>
      <span style={{ color: '#fff', fontWeight: 700, marginRight: 16 }}>OUISSAS QUALITÉ</span>
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          style={{
            color: pathname === l.href ? '#fff' : '#B9C9E4',
            background: pathname === l.href ? '#2F6FED' : 'transparent',
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: 13,
            textDecoration: 'none',
          }}
        >
          {l.label}
        </Link>
      ))}
      <button
        onClick={() => { clearToken(); router.push('/login'); }}
        style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid #2A3252', color: '#DCE6F5', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 13 }}
      >
        Déconnexion
      </button>
    </div>
  );
}
