import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, requireRole, hashPassword } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
  if (!requireRole(user, ['ADMIN', 'QUALITY_MANAGER', 'DIRECTION'])) {
    return NextResponse.json({ message: 'Rôle non autorisé.' }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: { companyId: user.companyId },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
  if (!requireRole(user, ['ADMIN'])) {
    return NextResponse.json({ message: 'Seul un administrateur peut créer un utilisateur.' }, { status: 403 });
  }

  const body = await req.json();
  const { name, email, password, role, siteId } = body || {};
  if (!name || !email || !password) {
    return NextResponse.json({ message: 'Nom, email et mot de passe requis.' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ message: 'Un compte existe déjà avec cet email.' }, { status: 409 });

  const passwordHash = await hashPassword(password);
  const created = await prisma.user.create({
    data: { companyId: user.companyId, name, email, passwordHash, role: role || 'COLLABORATOR', siteId },
    select: { id: true, name: true, email: true, role: true, active: true },
  });
  return NextResponse.json(created);
}
