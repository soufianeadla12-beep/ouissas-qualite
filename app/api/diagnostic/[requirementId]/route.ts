import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { requirementId: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });

  const { status, comment, evidence } = await req.json();
  const allowedStatus = ['conforme', 'partiel', 'non_conforme', 'na', null, undefined];
  if (!allowedStatus.includes(status)) {
    return NextResponse.json({ message: 'Statut invalide.' }, { status: 400 });
  }

  const response = await prisma.diagnosticResponse.upsert({
    where: { companyId_requirementId: { companyId: user.companyId, requirementId: params.requirementId } },
    update: { status, comment, evidence },
    create: { companyId: user.companyId, requirementId: params.requirementId, status, comment, evidence },
  });

  return NextResponse.json(response);
}
