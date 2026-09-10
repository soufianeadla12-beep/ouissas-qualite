import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

const VALID_STATUS = ['a_faire', 'en_cours', 'en_verification', 'cloture'];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
  const { status } = await req.json();
  if (!VALID_STATUS.includes(status)) return NextResponse.json({ message: 'Statut invalide.' }, { status: 400 });

  const result = await prisma.correctiveAction.updateMany({
    where: { id: params.id, companyId: user.companyId },
    data: { status },
  });
  if (result.count === 0) return NextResponse.json({ message: 'Non trouvée.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
