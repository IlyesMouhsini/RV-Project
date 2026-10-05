# ReValue — Simulateur d'estimation & Dépôt e-commerce (Seconde Main)

**ReValue** est une application web moderne conçue pour simplifier la revente de vêtements et d'accessoires de seconde main. Elle offre aux particuliers un tunnel fluide en 3 étapes pour estimer instantanément la valeur de leurs pièces selon la marque, le modèle et l'état, puis déclencher la prise en charge logistique via un pipeline d'automatisation.

---

## ⚡️ Fonctionnalités clés

- **Tunnel en 3 étapes réactif :** Saisie dynamique de l'article, calcul instantané de la cote de revente et validation des coordonnées.
- **Référentiel de cote & Moteur d'estimation :** Prise en compte de plus de 20 marques de mode (luxe, premium, accessible) et identification des modèles emblématiques pour un chiffrage précis basé sur les tendances du marché.
- **Transparence financière :** Calcul automatisé du gain net vendeur selon une grille de commission dégressive.
- **Pipeline d'ingestion & automatisation :** Envoi des données via Webhook vers un scénario Make (Integromat), stockage structuré dans Airtable et simulation d'email transactionnel.
- **Design soigné (D2C) :** Interface épurée, responsive et accessible construite avec Tailwind CSS.

---

## 🛠 Stack Technique

- **Frontend :** [SvelteKit](https://kit.svelte.dev/) (Svelte 5 Runes) + TypeScript
- **Styling :** [Tailwind CSS](https://tailwindcss.com/)
- **Bundler :** [Vite](https://vitejs.dev/)
- **Base de données :** [Airtable](https://airtable.com/) (Gestion des dépôts et statuts)
- **Automatisation :** [Make](https://www.make.com/) (Webhooks HTTP + Orchestration de flux)
- **Déploiement :** Vercel / Netlify

---

## 📐 Architecture & Flux de données

```text
[ Client SvelteKit ] 
       │
       │ (1. POST JSON payload via Webhook)
       ▼
[ Scénario Make ]
       ├─► [ Airtable API ] ───► Création de la fiche dépôt (Statut: En attente)
       └─► [ Email Service ] ──► Envoi de l'accusé de réception avec référence
