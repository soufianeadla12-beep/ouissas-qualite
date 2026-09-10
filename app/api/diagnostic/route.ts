import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { ensureIso9001Seeded } from '@/lib/seed';

const STATUS_SCORE: Record<string, number> = { conforme: 100, partiel: 50, non_conforme: 0 };

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });

  const standardId = await ensureIso9001Seeded();

  const standard = await prisma.standard.findUnique({
    where: { id: standardId },
    include: { clauses: { orderBy: { code: 'asc' }, include: { requirements: { orderBy: { code: 'asc' } } } } },
  });

  const responses = await prisma.diagnosticResponse.findMany({ where: { companyId: user.companyId } });
  const responseByReq: Record<string, (typeof responses)[number]> = {};
  responses.forEach((r) => (responseByReq[r.requirementId] = r));

  let totalScore = 0;
  let totalCount = 0;
  const clauses = standard!.clauses.map((cl) => {
    let sum = 0;
    let count = 0;
    const requirements = cl.requirements.map((r) => {
      const resp = responseByReq[r.id];
      if (resp?.status && resp.status !== 'na') {
        sum += STATUS_SCORE[resp.status] ?? 0;
        count++;
      }
      return { ...r, response: resp || null };
    });
    const chapterScore = count ? Math.round(sum / count) : null;
    totalScore += sum;
    totalCount += count;
    return { code: cl.code, title: cl.title, score: chapterScore, requirements };
  });

  const globalScore = totalCount ? Math.round(totalScore / totalCount) : 0;

  return NextResponse.json({ standard: { code: standard!.code, name: standard!.name }, clauses, globalScore, answered: totalCount });
}
