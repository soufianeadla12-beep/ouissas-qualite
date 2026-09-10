export const ISO9001_STANDARD = {
  code: 'ISO9001',
  name: 'ISO 9001:2015',
  clauses: [
    { code: '4', title: "Contexte de l'organisation", requirements: [
      { code: '4.1', question: "L'organisme a-t-il déterminé les enjeux internes et externes pertinents ?", explanation: "Facteurs internes/externes influençant l'orientation stratégique." },
      { code: '4.2', question: 'Les besoins et attentes des parties intéressées sont-ils identifiés ?', explanation: 'Clients, fournisseurs, personnel, autorités et leurs exigences.' },
      { code: '4.4', question: 'Le SMQ et ses processus sont-ils définis, avec leurs interactions ?', explanation: 'Cartographie, entrées/sorties, séquence et interactions.' },
    ]},
    { code: '5', title: 'Leadership', requirements: [
      { code: '5.1', question: 'La direction démontre-t-elle son leadership et son engagement ?', explanation: 'Implication visible, ressources, orientation client.' },
      { code: '5.2', question: 'Une politique qualité est-elle établie et comprise ?', explanation: "Adaptée à la finalité, engageant l'amélioration continue." },
      { code: '5.3', question: 'Les rôles, responsabilités et autorités sont-ils attribués ?', explanation: 'Organigramme, fiches de fonction, délégations.' },
    ]},
    { code: '6', title: 'Planification', requirements: [
      { code: '6.1', question: 'Les risques et opportunités sont-ils déterminés et traités ?', explanation: 'Analyse liée au contexte, actions proportionnées.' },
      { code: '6.2', question: 'Des objectifs qualité mesurables sont-ils établis ?', explanation: 'Objectifs SMART cohérents avec la politique qualité.' },
    ]},
    { code: '7', title: 'Support', requirements: [
      { code: '7.1', question: 'Les ressources nécessaires au SMQ sont-elles déterminées ?', explanation: 'Moyens, infrastructures, surveillance/mesure.' },
      { code: '7.2', question: 'Les compétences du personnel sont-elles assurées ?', explanation: "Formation, qualification, évaluation d'efficacité." },
      { code: '7.5', question: 'Les informations documentées requises sont-elles maîtrisées ?', explanation: 'Identification, approbation, versions, diffusion.' },
    ]},
    { code: '8', title: 'Réalisation des activités opérationnelles', requirements: [
      { code: '8.1', question: 'La planification et maîtrise opérationnelle sont-elles assurées ?', explanation: 'Critères de processus, ressources, maîtrise des changements.' },
      { code: '8.2', question: 'Les exigences produits/services sont-elles déterminées et revues ?', explanation: 'Communication client, revue de commande.' },
      { code: '8.4', question: 'Les prestataires externes sont-ils maîtrisés ?', explanation: 'Évaluation, sélection, surveillance fournisseurs.' },
      { code: '8.7', question: 'Les éléments de sortie non conformes sont-ils maîtrisés ?', explanation: 'Isolement, traitement, dérogation, information.' },
    ]},
    { code: '9', title: 'Évaluation des performances', requirements: [
      { code: '9.1', question: 'La surveillance, mesure et analyse sont-elles réalisées ?', explanation: "Indicateurs, méthodes de collecte et d'analyse." },
      { code: '9.2', question: 'Des audits internes sont-ils planifiés et réalisés ?', explanation: 'Programme, critères, rapports, actions résultantes.' },
      { code: '9.3', question: 'Une revue de direction est-elle réalisée à intervalles planifiés ?', explanation: 'Éléments d\'entrée/sortie, décisions et actions.' },
    ]},
    { code: '10', title: 'Amélioration', requirements: [
      { code: '10.2', question: 'Les non-conformités sont-elles traitées et des actions engagées ?', explanation: 'Réaction, analyse de cause, action, vérification.' },
      { code: '10.3', question: "L'amélioration continue est-elle recherchée ?", explanation: "Exploitation des résultats d'analyse et de revue." },
    ]},
  ],
};
