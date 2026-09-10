import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });

  const processes = await prisma.process.findMany({
    where: { companyId: user.companyId },
    orderBy: { code: 'asc' },
  });
  return NextResponse.json(processes);
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
  if (!requireRole(user, ['ADMIN', 'QUALITY_MANAGER'])) {
    return NextResponse.json({ message: 'Rôle non autorisé pour créer un processus.' }, { status: 403 });
  }

  const { code, name, type, owner, purpose } = await req.json();
  if (!code || !name || !type) {
    return NextResponse.json({ message: 'Code, nom et type sont requis.' }, { status: 400 });
  }

  const existing = await prisma.process.findUnique({ where: { companyId_code: { companyId: user.companyId, code } } });
  if (existing) return NextResponse.json({ message: 'Ce code processus existe déjà.' }, { status: 409 });

  const created = await prisma.process.create({
    data: { companyId: user.companyId, code, name, type, owner, purpose },
  });
  return NextResponse.json(created);
}
