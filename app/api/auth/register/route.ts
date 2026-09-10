import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { companyName, sector, managerName, email, password } = body || {};

  if (!companyName || !managerName || !email || !password || password.length < 8) {
    return NextResponse.json(
      { message: 'Champs requis manquants ou mot de passe trop court (8 caractères min).' },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: 'Un compte existe déjà avec cet email.' }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  const company = await prisma.company.create({
    data: {
      name: companyName,
      sector: sector || '',
      users: {
        create: { email, passwordHash, name: managerName, role: 'ADMIN' },
      },
    },
    include: { users: true },
  });

  const user = company.users[0];
  const accessToken = signToken({ userId: user.id, companyId: company.id, role: user.role, email: user.email });

  return NextResponse.json({ accessToken, user: { id: user.id, companyId: company.id, role: user.role, email: user.email } });
}
