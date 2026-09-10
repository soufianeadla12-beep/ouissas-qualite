import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
  const documents = await prisma.document.findMany({ where: { companyId: user.companyId }, orderBy: { dateCreated: 'desc' } });
  return NextResponse.json(documents);
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
  const { title, type, process } = await req.json();
  if (!title || !type) return NextResponse.json({ message: 'Titre et type requis.' }, { status: 400 });

  const count = await prisma.document.count({ where: { companyId: user.companyId } });
  const prefix = { Politique: 'POL', Manuel: 'MAN', Procédure: 'PROC', Instruction: 'INS', 'Mode opératoire': 'MOP', Formulaire: 'FOR', Rapport: 'RAP' }[type] || 'DOC';
  const code = `${prefix}-${String(count + 1).padStart(3, '0')}`;

  const doc = await prisma.document.create({
    data: { companyId: user.companyId, code, title, type, process, author: user.email, status: 'brouillon' },
  });
  return NextResponse.json(doc);
}
