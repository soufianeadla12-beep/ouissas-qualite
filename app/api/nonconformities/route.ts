import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
  const list = await prisma.nonConformity.findMany({
    where: { companyId: user.companyId },
    include: { actions: true },
    orderBy: { date: 'desc' },
  });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
  const { process, description, origin, severity } = await req.json();
  if (!description) return NextResponse.json({ message: 'Description requise.' }, { status: 400 });

  const count = await prisma.nonConformity.count({ where: { companyId: user.companyId } });
  const ref = `NC-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

  const nc = await prisma.nonConformity.create({
    data: { companyId: user.companyId, ref, process, description, origin, severity: severity || 'mineure' },
  });
  return NextResponse.json(nc);
}
