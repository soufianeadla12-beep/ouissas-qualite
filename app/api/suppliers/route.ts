import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
  const list = await prisma.supplier.findMany({ where: { companyId: user.companyId } });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
  const { name, activity, quality, price, delay, reactivity } = await req.json();
  if (!name) return NextResponse.json({ message: 'Nom requis.' }, { status: 400 });
  const created = await prisma.supplier.create({
    data: { companyId: user.companyId, name, activity, quality: Number(quality) || 0, price: Number(price) || 0, delay: Number(delay) || 0, reactivity: Number(reactivity) || 0 },
  });
  return NextResponse.json(created);
}
