import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { buildProcedureContent } from '@/lib/procedureContent';

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });

  const body = await req.json();
  const name: string = body.name || '';
  const process: string = body.process || '';
  if (!name.trim() || !process.trim()) {
    return NextResponse.json({ message: 'Le nom de la procédure et le processus sont requis.' }, { status: 400 });
  }

  const content = buildProcedureContent({
    name,
    process,
    owner: body.owner || '',
    objective: body.objective || '',
    scope: body.scope || '',
    description: body.description || '',
    actors: body.actors || '',
    inputs: body.inputs || '',
    outputs: body.outputs || '',
    responsibilities: body.responsibilities || '',
    steps: body.steps || '',
    documentsAssociated: body.documentsAssociated || '',
    indicators: body.indicators || '',
    risks: body.risks || '',
  });

  const processCode = process.slice(0, 3).toUpperCase();
  const count = await prisma.document.count({ where: { companyId: user.companyId, type: 'Procédure' } });
  const code = `PROC-${processCode}-${String(count + 1).padStart(3, '0')}`;

  const doc = await prisma.document.create({
    data: {
      companyId: user.companyId,
      code,
      title: name,
      type: 'Procédure',
      process,
      author: user.email,
      status: 'brouillon',
      content: content as any,
    },
  });

  return NextResponse.json(doc);
}
