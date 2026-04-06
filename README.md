# Vivante — Manger les lieux

Site web du collectif culinaire **Vivante**, ancré dans le Luberon (Provence).

## Stack

- **Next.js** (App Router) + TypeScript
- **Tailwind CSS** v4 (palette provençale custom)
- Données mockées dans `/data/` (pas d'API pour cette phase)

## Lancer en dev

```bash
npm install
npm run dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000).

## Structure du projet

```
app/
├── page.tsx                 # Accueil
├── recettes/                # Liste + détail recettes
├── evenements/              # Liste + détail événements
├── a-propos/                # Présentation du collectif
└── admin/                   # Dashboard + gestion (squelettes)

components/                  # Composants partagés
data/                        # Données mockées (recettes, événements, équipe)
lib/
├── types.ts                 # Types TypeScript
└── api.ts                   # Signatures API (stubs, prêtes pour ChefMate)
```

## Prochaines étapes

1. **Branchement API ChefMate** — Implémenter les fonctions dans `lib/api.ts` (base URL: `https://traiteur.zabar.fr/api/v1`)
2. **Auth admin** — Ajouter l'authentification JWT pour les pages `/admin`
3. **Fonctionnalités dynamiques** — Filtres recettes, inscription événements, CRUD admin
4. **Images** — Brancher les vraies images via le CDN ChefMate
