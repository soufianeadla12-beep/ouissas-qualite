import { prisma } from './prisma';
import { ISO9001_STANDARD } from './iso9001';

/**
 * Crée le référentiel ISO 9001 en base s'il n'existe pas encore.
 * Idempotent : appelable à chaque requête sans risque de doublons
 * (grâce aux contraintes @@unique du schéma + upsert).
 */
export async function ensureIso9001Seeded() {
  const standard = await prisma.standard.upsert({
    where: { code: ISO9001_STANDARD.code },
    update: {},
    create: { code: ISO9001_STANDARD.code, name: ISO9001_STANDARD.name },
  });

  for (const cl of ISO9001_STANDARD.clauses) {
    const clause = await prisma.clause.upsert({
      where: { standardId_code: { standardId: standard.id, code: cl.code } },
      update: { title: cl.title },
      create: { standardId: standard.id, code: cl.code, title: cl.title },
    });
    for (const req of cl.requirements) {
      await prisma.requirement.upsert({
        where: { clauseId_code: { clauseId: clause.id, code: req.code } },
        update: { question: req.question, explanation: req.explanation },
        create: { clauseId: clause.id, code: req.code, question: req.question, explanation: req.explanation },
      });
    }
  }

  return standard.id;
}
