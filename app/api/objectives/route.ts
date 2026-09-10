import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
  const list = await prisma.objective.findMany({ where: { companyId: user.companyId } });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
  const { objective, kpi, target, current, unit, owner, process } = await req.json();
  if (!objective || !kpi) return NextResponse.json({ message: 'Objectif et KPI requis.' }, { status: 400 });
  const created = await prisma.objective.create({
    data: { companyId: user.companyId, objective, kpi, target: Number(target) || 0, current: Number(current) || 0, unit, owner, process },
  });
  return NextResponse.json(created);
}
