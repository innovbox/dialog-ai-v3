export const samplePrompts = [
  {
    title: "Assistant de Code Expert",
    content: "Tu es un développeur senior expert en [LANGAGE]. Aide-moi à [TÂCHE SPÉCIFIQUE]. Fournis du code propre, commenté et optimisé. Explique tes choix techniques et propose des améliorations si possible.",
    category: "code",
    authorName: "DevMaster",
    isPublic: true,
    likes: 0,
    copies: 0
  },
  {
    title: "Créateur de Contenu Marketing",
    content: "Crée une stratégie de contenu marketing pour [PRODUIT/SERVICE] ciblant [AUDIENCE CIBLE]. Inclus : 5 idées de posts LinkedIn, 3 sujets d'articles de blog, et 2 campagnes email. Ton de voix : [PROFESSIONNEL/DÉCONTRACTÉ/CRÉATIF].",
    category: "marketing",
    authorName: "MarketingPro",
    isPublic: true,
    likes: 0,
    copies: 0
  },
  {
    title: "Générateur d'Images Midjourney",
    content: "Create a [STYLE] illustration of [SUJET] with [COULEURS] color palette, [ÉCLAIRAGE] lighting, shot with [TYPE_OBJECTIF] lens, [QUALITÉ] quality, [RATIO] aspect ratio --v 6 --stylize [VALEUR]",
    category: "midjourney",
    authorName: "AIArtist",
    isPublic: true,
    likes: 0,
    copies: 0
  },
  {
    title: "Analyste Business Intelligence",
    content: "Analyse les données suivantes : [DONNÉES]. Identifie les tendances clés, les opportunités d'amélioration et les risques potentiels. Présente tes conclusions sous forme de : 1) Résumé exécutif, 2) Insights détaillés, 3) Recommandations actionables avec priorités.",
    category: "business",
    authorName: "DataAnalyst",
    isPublic: true,
    likes: 0,
    copies: 0
  },
  {
    title: "Coach en Productivité Personnel",
    content: "Je veux améliorer ma productivité dans [DOMAINE]. Mes défis actuels : [DÉFIS]. Mon emploi du temps type : [PLANNING]. Crée-moi un plan d'action personnalisé avec des techniques concrètes, des outils recommandés et un système de suivi des progrès.",
    category: "productivite",
    authorName: "ProductivityGuru",
    isPublic: true,
    likes: 0,
    copies: 0
  },
  {
    title: "Créateur d'Histoires Interactives",
    content: "Écris une histoire interactive de [GENRE] se déroulant dans [CONTEXTE]. Le personnage principal est [DESCRIPTION_PERSONNAGE]. À chaque étape, propose 3 choix qui influencent la suite. Maintiens le suspense et crée des conséquences logiques pour chaque décision.",
    category: "creative",
    authorName: "StoryTeller",
    isPublic: true,
    likes: 0,
    copies: 0
  },
  {
    title: "Expert SEO et Rédaction Web",
    content: "Rédige un article de blog SEO-optimisé sur [SUJET] pour le mot-clé principal '[MOT_CLÉ]'. Structure : H1, introduction accrocheuse, 3-4 H2 avec sous-sections, conclusion avec CTA. Inclus des mots-clés secondaires naturellement et optimise pour l'intention de recherche [INFORMATIONNELLE/COMMERCIALE/TRANSACTIONNELLE].",
    category: "marketing",
    authorName: "SEOExpert",
    isPublic: true,
    likes: 0,
    copies: 0
  },
  {
    title: "Debugger de Code Intelligent",
    content: "J'ai une erreur dans mon code [LANGAGE] : [CODE_AVEC_ERREUR]. L'erreur est : [MESSAGE_ERREUR]. Aide-moi à : 1) Identifier la cause racine, 2) Proposer une solution corrigée, 3) Expliquer pourquoi l'erreur s'est produite, 4) Suggérer des bonnes pratiques pour éviter ce type d'erreur à l'avenir.",
    category: "code",
    authorName: "BugHunter",
    isPublic: true,
    likes: 0,
    copies: 0
  },
  {
    title: "Consultant en Stratégie d'Entreprise",
    content: "Mon entreprise [SECTEUR] fait face à [DÉFI_BUSINESS]. Contexte : [SITUATION_ACTUELLE]. Objectifs : [OBJECTIFS]. Analyse la situation avec le framework SWOT, propose 3 stratégies alternatives avec leurs avantages/inconvénients, et recommande un plan d'action prioritaire sur 6 mois.",
    category: "business",
    authorName: "StrategyConsultant",
    isPublic: true,
    likes: 0,
    copies: 0
  },
  {
    title: "Créateur de Personas Marketing",
    content: "Crée 3 personas détaillés pour [PRODUIT/SERVICE]. Pour chaque persona, inclus : nom, âge, profession, revenus, motivations, frustrations, canaux de communication préférés, objections potentielles, et parcours d'achat type. Base-toi sur [DONNÉES_DISPONIBLES] et les meilleures pratiques du secteur [SECTEUR].",
    category: "marketing",
    authorName: "PersonaExpert",
    isPublic: true,
    likes: 0,
    copies: 0
  },
  {
    title: "Générateur DALL-E Créatif",
    content: "A [STYLE] [TYPE_IMAGE] of [SUJET_PRINCIPAL] [ACTION/POSE], [DESCRIPTION_DÉTAILLÉE], [ENVIRONNEMENT/ARRIÈRE_PLAN], [ÉCLAIRAGE], [COULEURS_DOMINANTES], [MOOD/ATMOSPHÈRE], high quality, detailed, [STYLE_ARTISTIQUE]",
    category: "dalle",
    authorName: "VisualCreator",
    isPublic: true,
    likes: 0,
    copies: 0
  },
  {
    title: "Formateur et Créateur de Cours",
    content: "Crée un plan de formation complet sur [SUJET] pour [NIVEAU_AUDIENCE]. Structure : objectifs d'apprentissage, 5 modules avec contenu détaillé, exercices pratiques, évaluations, ressources complémentaires. Durée totale : [DURÉE]. Format : [PRÉSENTIEL/DISTANCIEL/HYBRIDE]. Inclus des méthodes pédagogiques variées.",
    category: "productivite",
    authorName: "EduDesigner",
    isPublic: true,
    likes: 0,
    copies: 0
  },
  {
    title: "Architecte de Solutions Techniques",
    content: "Conçois l'architecture technique pour [TYPE_APPLICATION] avec les exigences suivantes : [EXIGENCES_FONCTIONNELLES], [CONTRAINTES_TECHNIQUES], [CHARGE_ATTENDUE]. Propose : stack technologique, architecture système, base de données, sécurité, scalabilité, et plan de déploiement. Justifie tes choix techniques.",
    category: "code",
    authorName: "TechArchitect",
    isPublic: true,
    likes: 0,
    copies: 0
  },
  {
    title: "Copywriter Persuasif",
    content: "Rédige une page de vente persuasive pour [PRODUIT/SERVICE] ciblant [AUDIENCE]. Structure AIDA : Attention (titre accrocheur), Intérêt (bénéfices clés), Désir (preuves sociales, urgence), Action (CTA puissant). Inclus : headline, sous-titres, bullet points, témoignages, garantie, et CTA. Ton : [STYLE_SOUHAITÉ].",
    category: "marketing",
    authorName: "CopyMaster",
    isPublic: true,
    likes: 0,
    copies: 0
  },
  {
    title: "Créateur de Mondes Fantastiques",
    content: "Crée un univers fantastique original avec : [THÈME_PRINCIPAL]. Développe : géographie (3 régions distinctes), système de magie, races/peuples, histoire (événement majeur), politique (conflits actuels), culture (traditions), et 5 lieux emblématiques avec leurs secrets. Assure la cohérence interne de cet univers.",
    category: "creative",
    authorName: "WorldBuilder",
    isPublic: true,
    likes: 0,
    copies: 0
  }
];