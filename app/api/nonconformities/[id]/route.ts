import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

const VALID_STATUS = ['ouverte', 'en_analyse', 'action_en_cours', 'en_verification', 'cloturee'];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
  const { status } = await req.json();
  if (!VALID_STATUS.includes(status)) return NextResponse.json({ message: 'Statut invalide.' }, { status: 400 });

  // updateMany avec companyId dans le WHERE : isolation multi-tenant serveur.
  const result = await prisma.nonConformity.updateMany({
    where: { id: params.id, companyId: user.companyId },
    data: { status, closed: status === 'cloturee' },
  });
  if (result.count === 0) return NextResponse.json({ message: 'Non trouvée.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
