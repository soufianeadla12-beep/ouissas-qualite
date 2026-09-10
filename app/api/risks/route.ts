import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
  const list = await prisma.risk.findMany({ where: { companyId: user.companyId } });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
  const { process, risk, cause, consequence, probability, severity, owner, controls } = await req.json();
  if (!risk || !probability || !severity) return NextResponse.json({ message: 'Risque, probabilité et gravité requis.' }, { status: 400 });

  const count = await prisma.risk.count({ where: { companyId: user.companyId } });
  const ref = `RISK-${String(count + 1).padStart(3, '0')}`;

  const created = await prisma.risk.create({
    data: { companyId: user.companyId, ref, process, risk, cause, consequence, probability: Number(probability), severity: Number(severity), owner, controls },
  });
  return NextResponse.json(created);
}
