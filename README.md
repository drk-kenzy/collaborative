# Collaborative Text Editor (Simulation)

Une interface d'éditeur de texte collaboratif simulant des interactions multi-utilisateurs avec gestion de latence et synchronisation.

## Fonctionnalités
- **Interface Multi-Panneaux** : Header, Sidebar Gauche (Utilisateurs), Zone d'Édition, Sidebar Droite (Logs & Chat), Footer.
- **Simulation Système** : 
  - 3 utilisateurs simultanés simulés.
  - Latence réseau aléatoire (100ms - 1500ms).
  - Gestion des erreurs (1% packet loss).
- **Performance** : Mémoïsation et gestion fine du DOM pour les curseurs distants.
- **Design** : Tailwind CSS, Dark Mode, Responsive Design.

## Installation
```bash
npm install
```

## Lancement (Développement)
```bash
npm run dev
```

## Structure du Projet
- `src/hooks/useSimulation.ts` : Logique de simulation du réseau et des utilisateurs.
- `src/components/Editor.tsx` : Éditeur avec support multi-curseurs et optimisation de rendu.
- `src/components/` : Composants de l'interface (Header, Sidebars, Footer).
- `src/types.ts` : Définitions des types de données.
