// === Types internes (utilisés par les composants) ===

export type Recette = {
  id: string;
  nom: string;
  nombre_parts: number;
  statut: "a_faire" | "en_cours" | "finalisee";
  est_publique: boolean;
  tags: string[];
  saison: string;
  auteur: { id: string; nom: string };
  ingredients: { nom: string; quantite: number; unite: string }[];
  instructions: string;
  etapes: { texte: string; image_url?: string }[];
  photo_url?: string;
  created_at: string;
};

export type Evenement = {
  id: string;
  titre: string;
  description: string;
  date: string;
  lieu: string;
  nombre_places: number;
  inscrits: number;
  statut: "a_venir" | "en_cours" | "passe";
  photo_url?: string;
};

export type Membre = {
  id: string;
  nom: string;
  role: string;
  bio: string;
  photo_url?: string;
};

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: string[];
};

// === Types API ChefMate (réponse brute) ===

export type ApiRecipe = {
  id: string;
  name: string;
  serving_count: number;
  status: string | null;
  is_public: boolean;
  images: { id: string; url: string; nom: string }[];
  sort_order: number;
  creator_id: string | null;
  created_at: string;
  updated_at: string;
  recipe_steps: {
    id: string;
    title: string | null;
    text: string;
    image_url: string | null;
    sort_order: number;
  }[];
  creator: { id: string; first_name: string; last_name: string } | null;
  recipe_teams: { team: { id: string; name: string } }[];
  recipe_type_assignments: { type: { id: string; name: string; color: string } }[];
  recipe_seasons: { season: { id: string; name: string; icon: string } }[];
  recipe_tags: { tag: { id: string; name: string; color: string } }[];
  ingredients: {
    id: string;
    name: string;
    quantity: number;
    sort_order: number;
    comment: string | null;
    unit: { id: string; name: string; abbreviation: string };
    aisle: { id: string; name: string; color: string } | null;
  }[];
};

export type ApiResponse<T> = {
  data: T;
  meta?: { total: number; limit: number; offset: number };
};
