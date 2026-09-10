import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ message: 'Email et mot de passe requis.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.active) {
    return NextResponse.json({ message: 'Identifiants invalides.' }, { status: 401 });
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ message: 'Identifiants invalides.' }, { status: 401 });
  }

  const accessToken = signToken({ userId: user.id, companyId: user.companyId, role: user.role, email: user.email });
  return NextResponse.json({ accessToken, user: { id: user.id, companyId: user.companyId, role: user.role, email: user.email } });
}
