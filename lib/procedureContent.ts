export interface ProcedureContent {
  objet: string;
  domaineApplication: string;
  references: string;
  definitions: string;
  responsabilites: string;
  description: string;
  logigramme: string[]; // une étape par entrée
  documentsAssocies: string;
  enregistrements: string;
  indicateurs: string;
  gestionRisques: string;
  annexes: string;
}

/**
 * Construit le contenu structuré d'une procédure à partir des informations
 * saisies dans l'assistant, en respectant la structure standard d'une
 * procédure qualité ISO 9001 (1. Objet → 12. Annexes). Les sections non
 * renseignées reçoivent une formulation par défaut plutôt que d'être vides,
 * pour rester exploitable telle quelle en base de travail.
 */
export function buildProcedureContent(input: {
  name: string;
  process: string;
  owner: string;
  objective: string;
  scope: string;
  description: string;
  actors: string;
  inputs: string;
  outputs: string;
  responsibilities: string;
  steps: string;
  documentsAssociated: string;
  indicators: string;
  risks: string;
}): ProcedureContent {
  const steps = input.steps
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    objet: input.objective?.trim() || `La présente procédure décrit les modalités de mise en œuvre du processus ${input.process} afin d'en garantir la maîtrise et la conformité.`,
    domaineApplication: input.scope?.trim() || `Cette procédure s'applique à l'ensemble des activités du processus ${input.process}, de l'entrée à la sortie du processus.`,
    references: 'ISO 9001:2015 — Systèmes de management de la qualité',
    definitions: 'Aucune définition spécifique. Se référer au vocabulaire ISO 9000 pour les termes qualité génériques.',
    responsabilites: input.responsibilities?.trim() || `Le pilote du processus (${input.owner || 'à désigner'}) est responsable de l'application et de la mise à jour de la présente procédure.`,
    description: input.description?.trim() || 'À compléter : décrire le déroulement détaillé du processus, ses entrées et ses sorties.',
    logigramme: steps.length ? steps : ['Réception de la demande / déclenchement du processus', 'Réalisation des activités décrites ci-dessus', "Contrôle et validation du résultat", 'Clôture et archivage'],
    documentsAssocies: input.documentsAssociated?.trim() || 'Aucun document associé identifié à ce stade.',
    enregistrements: 'Les enregistrements liés à cette procédure sont conservés conformément à la politique de gestion documentaire de l\'entreprise.',
    indicateurs: input.indicators?.trim() || 'À définir avec le pilote de processus lors de la première revue.',
    gestionRisques: input.risks?.trim() || 'Les risques associés à ce processus sont identifiés et suivis dans le module Risques & Opportunités.',
    annexes: '',
  };
}
