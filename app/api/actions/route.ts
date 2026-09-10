import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
  const list = await prisma.correctiveAction.findMany({ where: { companyId: user.companyId }, orderBy: { deadline: 'asc' } });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
  const { description, owner, deadline, priority, nonConformityId } = await req.json();
  if (!description) return NextResponse.json({ message: 'Description requise.' }, { status: 400 });

  const count = await prisma.correctiveAction.count({ where: { companyId: user.companyId } });
  const code = `CAPA-${String(count + 1).padStart(3, '0')}`;

  const action = await prisma.correctiveAction.create({
    data: {
      companyId: user.companyId,
      code,
      description,
      owner,
      deadline: deadline ? new Date(deadline) : null,
      priority: priority || 'Moyenne',
      nonConformityId: nonConformityId || null,
    },
  });
  return NextResponse.json(action);
}
