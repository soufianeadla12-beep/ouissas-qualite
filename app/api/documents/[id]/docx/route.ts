import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Header, Footer, BorderStyle } from 'docx';
import type { ProcedureContent } from '@/lib/procedureContent';

const SECTIONS: { key: keyof ProcedureContent; title: string; list?: boolean }[] = [
  { key: 'objet', title: '1. Objet' },
  { key: 'domaineApplication', title: "2. Domaine d'application" },
  { key: 'references', title: '3. Références' },
  { key: 'definitions', title: '4. Définitions' },
  { key: 'responsabilites', title: '5. Responsabilités' },
  { key: 'description', title: '6. Description de la procédure' },
  { key: 'logigramme', title: '7. Logigramme du processus', list: true },
  { key: 'documentsAssocies', title: '8. Documents associés' },
  { key: 'enregistrements', title: '9. Enregistrements' },
  { key: 'indicateurs', title: '10. Indicateurs de performance' },
  { key: 'gestionRisques', title: '11. Gestion des risques' },
  { key: 'annexes', title: '12. Annexes' },
];

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });

  const doc = await prisma.document.findFirst({ where: { id: params.id, companyId: user.companyId } });
  if (!doc || !doc.content) return NextResponse.json({ message: 'Document introuvable.' }, { status: 404 });

  const company = await prisma.company.findUnique({ where: { id: user.companyId } });
  const content = doc.content as unknown as ProcedureContent;

  const bodyChildren: Paragraph[] = [];

  bodyChildren.push(
    new Paragraph({ text: doc.title, heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `${doc.code}  ·  Version ${doc.version}  ·  ${doc.dateCreated.toLocaleDateString('fr-FR')}`, color: '5B6472', size: 20 })],
      spacing: { after: 400 },
    }),
  );

  for (const section of SECTIONS) {
    bodyChildren.push(new Paragraph({ text: section.title, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 120 } }));
    if (section.list) {
      const steps = (content[section.key] as unknown as string[]) || [];
      steps.forEach((step, i) => {
        bodyChildren.push(new Paragraph({ text: `${i + 1}. ${step}` }));
      });
    } else {
      const text = (content[section.key] as unknown as string) || '';
      text.split('\n').filter(Boolean).forEach((line) => {
        bodyChildren.push(new Paragraph({ text: line }));
      });
    }
  }

  const wordDoc = new Document({
    sections: [
      {
        properties: {},
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: `${company?.name || ''}  —  ${doc.code}`, size: 18, color: '5B6472' })],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'E2E6EE' } },
                spacing: { before: 100 },
                children: [
                  new TextRun({ text: `Rédigé par : ${doc.author || '____________'}      `, size: 18 }),
                  new TextRun({ text: `Vérifié par : ____________      `, size: 18 }),
                  new TextRun({ text: `Approuvé par : ____________`, size: 18 }),
                ],
              }),
            ],
          }),
        },
        children: bodyChildren,
      },
    ],
  });

  const buffer = await Packer.toBuffer(wordDoc);

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${doc.code}.docx"`,
    },
  });
}
