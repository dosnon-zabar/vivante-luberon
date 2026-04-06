import type { Evenement } from "@/lib/types";

export const evenements: Evenement[] = [
  {
    id: "1",
    titre: "Grand banquet de village",
    description:
      "Une grande tablée en plein air au cœur du village de Bonnieux. Menu provençal complet : aïoli géant, légumes du jardin, fromages de chèvre locaux et tarte aux fruits de saison. Chacun apporte sa chaise et sa bonne humeur. Les enfants sont les bienvenus, des jeux sont prévus sur la place.",
    date: "2026-06-21T19:00:00Z",
    lieu: "Place du village, Bonnieux",
    nombre_places: 120,
    inscrits: 87,
    statut: "a_venir",
    photo_url: "https://traiteur.zabar.fr/cdn/evenements/banquet-village.jpg",
  },
  {
    id: "2",
    titre: "Atelier cuisine d'été",
    description:
      "Apprenez à cuisiner les légumes d'été avec les producteurs du coin. Au programme : ratatouille, tian, farcis provençaux. Chaque participant repart avec un livret de recettes et un panier de légumes pour refaire les recettes chez soi. Atelier ouvert à tous les niveaux.",
    date: "2026-07-12T10:00:00Z",
    lieu: "Ferme des Music, Apt",
    nombre_places: 25,
    inscrits: 18,
    statut: "a_venir",
    photo_url: "https://traiteur.zabar.fr/cdn/evenements/atelier-cuisine.jpg",
  },
  {
    id: "3",
    titre: "Marché paysan nocturne",
    description:
      "Marché de producteurs locaux en nocturne avec dégustation et musique live. Retrouvez nos maraîchers, fromagers, vignerons et apiculteurs du Luberon. Ambiance guinguette, buvette sur place avec vins naturels et bières artisanales. Entrée libre.",
    date: "2026-08-02T18:00:00Z",
    lieu: "Cours Lauze de Perret, Apt",
    nombre_places: 200,
    inscrits: 0,
    statut: "a_venir",
    photo_url: "https://traiteur.zabar.fr/cdn/evenements/marche-paysan.jpg",
  },
  {
    id: "4",
    titre: "Rencontre paysanne : semences et autonomie",
    description:
      "Une journée d'échange entre paysans, jardiniers et curieux autour de la question des semences paysannes et de l'autonomie alimentaire. Troc de graines le matin, conférences l'après-midi, repas partagé le midi. Chacun apporte un plat à partager.",
    date: "2026-09-15T09:30:00Z",
    lieu: "Domaine de la Royère, Oppède",
    nombre_places: 60,
    inscrits: 34,
    statut: "a_venir",
    photo_url:
      "https://traiteur.zabar.fr/cdn/evenements/rencontre-paysanne.jpg",
  },
  {
    id: "5",
    titre: "Fête des récoltes",
    description:
      "Célébration de la fin des récoltes d'automne avec repas collectif, musique traditionnelle et danse. Au menu : soupe au pistou géante, daube provençale et desserts aux fruits du verger. Une journée pour remercier la terre et ceux qui la cultivent.",
    date: "2026-10-18T12:00:00Z",
    lieu: "Jardin partagé, Lourmarin",
    nombre_places: 80,
    inscrits: 52,
    statut: "a_venir",
    photo_url: "https://traiteur.zabar.fr/cdn/evenements/fete-recoltes.jpg",
  },
  {
    id: "6",
    titre: "Apéro collectif de printemps",
    description:
      "Premier apéro de la saison pour lancer les activités de l'année ! Tapenade, anchoïade, fougasse et vins du Luberon. L'occasion de se retrouver, de rencontrer les nouveaux membres du collectif et de planifier ensemble les événements à venir.",
    date: "2026-04-19T18:30:00Z",
    lieu: "Café associatif Le Simiane, Lacoste",
    nombre_places: 40,
    inscrits: 28,
    statut: "a_venir",
    photo_url: "https://traiteur.zabar.fr/cdn/evenements/apero-collectif.jpg",
  },
];
