// Les seances. Chaque exercice pointe vers un extrait precis d'une video de
// Brieuc Le Dantec (chaine YouTube), lu en boucle sur son segment.
// Les timecodes ont ete valides un par un par analyse video (14 clips notes >= 7/10).

const SEANCES = [
  {
    id: "A",
    titre: "Pousser",
    sous_titre: "Pecs, epaules, triceps",
    couleur: "#ff7a18",
    exercices: [
      {
        nom: "Pompes",
        series: 3, reps: "8 reps", repos: 60,
        video: { id: "zK57ipDwkDg", debut: 68, fin: 74 },
        facile: "Mains sur le plan de travail ou une chaise : plus c'est haut, plus c'est facile.",
        dur: "Au sol, pieds sureleves sur une chaise.",
        cle: "Corps en planche du talon a la tete. Le bassin ne tombe pas."
      },
      {
        nom: "Extensions de triceps au sol",
        series: 3, reps: "8 reps", repos: 60,
        video: { id: "zK57ipDwkDg", debut: 496, fin: 502 },
        facile: "A genoux, amplitude reduite de moitie.",
        dur: "Jambes tendues, descente lente sur 3 secondes.",
        cle: "Les coudes restent colles au corps, ils ne s'ecartent pas."
      },
      {
        nom: "Pseudo-pompes piquees",
        series: 3, reps: "6 reps", repos: 75,
        video: { id: "zK57ipDwkDg", debut: 81, fin: 87 },
        facile: "Mains sur une chaise, fesses en l'air, descente de 5 cm seulement.",
        dur: "Pieds sur une chaise, tete qui descend jusqu'au sol.",
        cle: "Fesses hautes : c'est ce qui met la charge sur les epaules."
      },
      {
        nom: "Pompes explosives negatives",
        series: 3, reps: "5 reps", repos: 90,
        video: { id: "zK57ipDwkDg", debut: 352, fin: 358 },
        facile: "Oublie l'explosif : descends juste en 4 secondes, remonte sur les genoux.",
        dur: "Mains qui decollent en haut.",
        cle: "Tout le travail est dans la descente lente. Ne te jette pas au sol."
      }
    ]
  },
  {
    id: "B",
    titre: "Jambes",
    sous_titre: "Cuisses, fessiers, mollets",
    couleur: "#18a0ff",
    exercices: [
      {
        nom: "Fentes croisees",
        series: 3, reps: "8 par jambe", repos: 60,
        video: { id: "O27fXgm1bpA", debut: 328, fin: 334 },
        facile: "Tiens-toi au dossier d'une chaise, amplitude reduite.",
        dur: "Sans les mains, 2 secondes de pause en bas.",
        cle: "Le genou avant ne depasse jamais la pointe du pied."
      },
      {
        nom: "Marche du crabe",
        series: 3, reps: "20 pas", repos: 60,
        video: { id: "O27fXgm1bpA", debut: 229, fin: 235 },
        facile: "Reste plus haut sur les jambes, 10 pas.",
        dur: "Descends en squat complet, 30 pas.",
        cle: "Reste bas tout le long : si tu te releves entre les pas, ca ne compte pas."
      },
      {
        nom: "Pont fessier a une jambe",
        series: 3, reps: "10 par jambe", repos: 60,
        video: { id: "O27fXgm1bpA", debut: 476, fin: 482 },
        facile: "Les deux pieds au sol, monte et descend.",
        dur: "2 secondes de contraction en haut de chaque repetition.",
        cle: "Serre les fessiers en haut. Tu dois le sentir la, pas dans le bas du dos."
      },
      {
        nom: "Squats et fentes sautees",
        series: 3, reps: "10 reps", repos: 90,
        video: { id: "O27fXgm1bpA", debut: 92, fin: 98 },
        facile: "Enleve le saut : squats simples puis fentes marchees.",
        dur: "Enchaine sans pause entre le squat et la fente.",
        cle: "Amortis a la reception, genoux souples. Pas de bruit sourd."
      }
    ]
  },
  {
    id: "C",
    titre: "Dos et chaine posterieure",
    sous_titre: "Le jour que tout le monde saute",
    couleur: "#22c55e",
    exercices: [
      {
        nom: "Planche inversee",
        series: 3, reps: "20 secondes", repos: 60, duree: 20,
        video: { id: "zK57ipDwkDg", debut: 590, fin: 596 },
        facile: "Genoux flechis, comme sur la video.",
        dur: "Jambes tendues, une jambe levee.",
        cle: "Pousse le bassin vers le plafond, ouvre la poitrine."
      },
      {
        nom: "Gainage lateral avec montees de bassin",
        series: 3, reps: "8 par cote", repos: 60,
        video: { id: "zK57ipDwkDg", debut: 259, fin: 265 },
        facile: "Sur le genou au lieu du pied.",
        dur: "Bras du dessus tendu vers le plafond.",
        cle: "Le corps reste dans un seul plan, ne bascule pas vers l'avant."
      },
      {
        nom: "Rowing sous la table",
        series: 3, reps: "8 reps", repos: 75,
        video: null,
        facile: "Genoux plies, buste plus vertical.",
        dur: "Jambes tendues, pieds sur une chaise.",
        cle: "Allonge-toi sous une table solide, attrape le bord, tire la poitrine vers le plateau. Corps gaine, comme une planche."
      },
      {
        nom: "Superman",
        series: 3, reps: "10 reps", repos: 45,
        video: null,
        facile: "Decolle seulement les bras, puis seulement les jambes.",
        dur: "Tenue de 15 secondes en haut.",
        cle: "A plat ventre, decolle bras et jambes en meme temps. Regard vers le sol, pas vers l'avant."
      }
    ]
  },
  {
    id: "D",
    titre: "Gainage et recup",
    sous_titre: "La journee qui repare",
    couleur: "#a855f7",
    exercices: [
      {
        nom: "Gainage ouvert-ferme",
        series: 3, reps: "10 reps", repos: 45,
        video: { id: "O27fXgm1bpA", debut: 155, fin: 161 },
        facile: "Sur les genoux, ouvre une jambe a la fois.",
        dur: "Sur les mains au lieu des avant-bras.",
        cle: "Le bassin ne bouge pas de haut en bas. Seules les jambes s'ecartent."
      },
      {
        nom: "Gainage reach through",
        series: 3, reps: "8 par cote", repos: 45,
        video: { id: "O27fXgm1bpA", debut: 550, fin: 556 },
        facile: "Genou au sol du cote de l'appui.",
        dur: "Ralentis : 2 secondes pour passer le bras, 2 pour revenir.",
        cle: "Le mouvement vient du buste qui tourne, pas seulement du bras."
      },
      {
        nom: "Releves de genoux",
        series: 3, reps: "12 reps", repos: 45,
        video: { id: "A6r5MUIX_vE", debut: 938, fin: 944 },
        facile: "Un genou a la fois.",
        dur: "Jambes tendues, decollage lent.",
        cle: "Le bas du dos reste plaque au sol. S'il se creuse, plie plus les genoux."
      },
      {
        nom: "Montees de genoux au sol",
        series: 3, reps: "12 reps", repos: 45,
        video: { id: "O27fXgm1bpA", debut: 397, fin: 403 },
        facile: "Mains sous les fesses pour caler le dos.",
        dur: "Sans les mains, bras croises sur la poitrine.",
        cle: "Expire en montant. Ne tire pas sur la nuque."
      }
    ]
  }
];

// L'echauffement : 3 minutes, les memes mouvements tous les jours.
const ECHAUFFEMENT = [
  "30 s — rotations d'epaules, en avant puis en arriere",
  "30 s — cercles de bras, de plus en plus grands",
  "30 s — rotations de bassin",
  "30 s — squats a vide, lents, le plus bas possible",
  "30 s — montees de genoux sur place",
  "30 s — 10 pompes contre le mur"
];

const ETIREMENT = [
  "20 s — quadriceps, debout, talon aux fesses",
  "20 s — ischios, jambes tendues, mains vers les pieds",
  "20 s — pecs dans l'encadrement d'une porte",
  "20 s — triceps, coude derriere la tete",
  "20 s — chat / vache a quatre pattes",
  "20 s — torsion allonge sur le dos, chaque cote"
];

const TESTS = [
  { id: "pompes", label: "Pompes genoux, max d'affilee", unite: "reps" },
  { id: "squats", label: "Squats, max d'affilee", unite: "reps" },
  { id: "rowing", label: "Rowing sous table, max", unite: "reps" },
  { id: "planche", label: "Planche, tenue max", unite: "secondes" }
];
