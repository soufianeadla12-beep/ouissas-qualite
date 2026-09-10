import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });

  // Toujours filtré par le companyId du token : impossible de lire une
  // autre entreprise même en devinant un id.
  const company = await prisma.company.findUnique({ where: { id: user.companyId } });
  return NextResponse.json(company);
}

export async function PATCH(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
  if (!requireRole(user, ['ADMIN', 'QUALITY_MANAGER'])) {
    return NextResponse.json({ message: 'Rôle non autorisé pour cette action.' }, { status: 403 });
  }

  const body = await req.json();
  const { name, sector, logoUrl, address, city, country, employees, codePattern } = body || {};
  const company = await prisma.company.update({
    where: { id: user.companyId },
    data: { name, sector, logoUrl, address, city, country, employees, codePattern },
  });
  return NextResponse.json(company);
}
